'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useForm, type FieldValues, type Resolver, type UseFormReturn } from 'react-hook-form'
import type { ZodType } from 'zod'
import { track, type AnalyticsEvent } from '@/lib/analytics'
import { ENTRY_POINTS } from '@/lib/leads/constants'
import type { LeadFormType, LeadResult } from '@/lib/leads/schemas'
import { captureUtm } from '@/lib/leads/utm'

type Options<T extends FieldValues> = {
  type: LeadFormType
  schema: ZodType<unknown>
  action: (values: T) => Promise<LeadResult>
  defaults: Record<string, unknown>
  /** Campos de cada etapa (formulários em etapas). */
  steps?: string[][]
  /** Regras entre campos validadas junto com o esquema (ex.: CNPJ conforme o perfil), mesmo em etapas incompletas. */
  extraErrors?: (values: Record<string, never>) => Record<string, string>
}

/**
 * Estado compartilhado dos formulários de cadastro: validação, etapas, antispam, UTMs, envio e analytics.
 * `submit_form_*` só é registrado depois que o servidor confirma ter gravado o cadastro.
 */
export function useLeadForm<T extends FieldValues>({ type, schema, action, defaults, steps, extraErrors }: Options<T>) {
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [focusTick, setFocusTick] = useState(0)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0)
  const started = useRef(false)

  const form = useForm<T>({
    // O resolver valida o esquema completo; os campos de etapas anteriores permanecem no estado ao navegar.
    resolver: (async (values, context, options) => {
      const base = await (zodResolver(schema as never) as Resolver<FieldValues>)(values, context, options as never)
      const extra = extraErrors?.(values as never) ?? {}
      if (!Object.keys(extra).length) return base
      const errors: Record<string, unknown> = { ...base.errors }
      for (const [field, message] of Object.entries(extra)) errors[field] = { type: 'custom', message }
      return { values: {}, errors } as never
    }) as Resolver<T>,
    defaultValues: { ...defaults, startedAt: 0, website: '', utm: {}, sourcePage: '', entryPoint: '', consentMarketing: false } as never,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const origem = params.get('origem') ?? ''
    form.setValue('startedAt' as never, Date.now() as never)
    form.setValue('sourcePage' as never, window.location.pathname as never)
    form.setValue('utm' as never, captureUtm(window.location.search) as never)
    form.setValue('entryPoint' as never, ((ENTRY_POINTS as readonly string[]).includes(origem) ? origem : '') as never)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Primeira interação com o formulário (foco ou alteração). */
  const onStart = useCallback(() => {
    if (started.current) return
    started.current = true
    track(`start_form_${type}` as AnalyticsEvent)
  }, [type])

  const stepOfField = (name: string) => steps?.findIndex((s) => s.includes(name)) ?? -1

  const goToFirstError = (errors: Record<string, unknown>) => {
    if (!steps) return
    const idx = Math.min(...Object.keys(errors).map(stepOfField).filter((i) => i >= 0), steps.length)
    if (idx < steps.length) {
      setDirection(idx < step ? -1 : 1)
      setFocusTick((t) => t + 1)
      setStep(idx)
    }
  }

  // Após voltar à etapa com erro, leva o foco ao primeiro campo inválido (a etapa acabou de ser montada).
  useEffect(() => {
    if (!focusTick) return
    const t = setTimeout(() => document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus(), 350)
    return () => clearTimeout(t)
  }, [focusTick])

  const back = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const next = async () => {
    if (!steps) return
    const ok = await form.trigger(steps[step] as never)
    if (!ok) {
      // Marca os campos da etapa como "tocados": a partir daqui os erros somem assim que o valor é corrigido.
      for (const f of steps[step]) form.setValue(f as never, form.getValues(f as never) as never, { shouldTouch: true })
      track('form_error', { form: type, step: step + 1, fields: Object.keys(form.formState.errors).filter((k) => steps[step].includes(k)).join(',') })
      return
    }
    setDirection(1)
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const onValid = (values: T) => {
    setServerError(null)
    startTransition(async () => {
      let res: LeadResult
      try {
        res = await action({ ...values, turnstileToken } as T)
      } catch {
        res = { ok: false, error: 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.' }
      }
      if (res.ok) {
        track(`submit_form_${type}` as AnalyticsEvent)
        setDone(true)
        return
      }
      setServerError(res.error)
      track('form_error', { form: type, reason: 'servidor', fields: Object.keys(res.fieldErrors ?? {}).join(',') })
      for (const [field, message] of Object.entries(res.fieldErrors ?? {})) if (message) form.setError(field as never, { message })
      goToFirstError(res.fieldErrors ?? {})
      setTurnstileToken('')
      setCaptchaKey((k) => k + 1)
    })
  }

  const onInvalid = (errors: Record<string, unknown>) => {
    track('form_error', { form: type, reason: 'validacao', fields: Object.keys(errors).join(',') })
    goToFirstError(errors)
  }

  const handleSubmit = form.handleSubmit(onValid as never, onInvalid as never)

  return { form: form as UseFormReturn<FieldValues>, step, direction, back, next, handleSubmit, pending, serverError, done, onStart, setTurnstileToken, captchaKey }
}
