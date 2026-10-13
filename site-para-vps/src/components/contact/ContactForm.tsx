'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, LoaderCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { submitInquiry } from '@/app/(frontend)/contato/actions'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { contactSchema, type ContactInput } from '@/lib/contact-schema'

type TripOption = { slug: string; label: string }

const fieldBase =
  'w-full rounded-2xl border bg-white px-4 text-[1rem] text-ink-900 shadow-[inset_0_1px_2px_rgb(10_46_92/0.05)] outline-none transition placeholder:text-slate-500 focus:border-gold-500 focus:ring-4 focus:ring-gold-200/60'

export function ContactForm({ trips, defaultTrip }: { trips: TripOption[]; defaultTrip?: string }) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<{ delivered: boolean } | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', whatsapp: '', trip: defaultTrip ?? '', message: '', website: '', startedAt: 0, sourcePage: '' },
  })

  useEffect(() => {
    setValue('startedAt', Date.now())
    setValue('sourcePage', window.location.pathname + window.location.search)
  }, [setValue])

  const onSubmit = (values: ContactInput) => {
    setServerError(null)
    startTransition(async () => {
      const res = await submitInquiry(values)
      if (res.ok) {
        track('form_submit', { form: 'contato', trip: values.trip || undefined })
        setResult({ delivered: res.delivered })
        reset()
        return
      }
      setServerError(res.error)
      for (const [field, message] of Object.entries(res.fieldErrors ?? {}))
        if (message) setError(field as keyof ContactInput, { message })
    })
  }

  if (result)
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-white p-10 text-center shadow-soft ring-1 ring-navy-900/5">
        <CircleCheck className="mx-auto size-12 text-whatsapp" aria-hidden="true" />
        <h3 className="mt-5 font-display text-3xl text-navy-900">Mensagem recebida!</h3>
        <p className="mx-auto mt-3 max-w-md text-slate-700">Obrigado pelo contato. Nossa equipe vai responder pelo e-mail ou WhatsApp informado o mais breve possível.</p>
        <button type="button" onClick={() => setResult(null)} className="mt-8 font-label text-sm font-bold text-gold-700 hover:underline">
          Enviar outra mensagem
        </button>
      </div>
    )

  const err = (name: keyof ContactInput) =>
    errors[name]?.message ? (
      <p id={`${name}-erro`} className="mt-1.5 text-sm font-semibold text-alert">
        {String(errors[name]?.message)}
      </p>
    ) : null
  const aria = (name: keyof ContactInput) => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `${name}-erro` : undefined })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-[var(--radius-card)] bg-white p-6 shadow-soft ring-1 ring-navy-900/5 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-2 block font-label text-sm font-semibold text-navy-900">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input id="name" autoComplete="name" className={cn(fieldBase, 'h-13', errors.name ? 'border-alert' : 'border-navy-900/15')} {...aria('name')} {...register('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-label text-sm font-semibold text-navy-900">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input id="email" type="email" autoComplete="email" inputMode="email" className={cn(fieldBase, 'h-13', errors.email ? 'border-alert' : 'border-navy-900/15')} {...aria('email')} {...register('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="whatsapp" className="mb-2 block font-label text-sm font-semibold text-navy-900">
            WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            className={cn(fieldBase, 'h-13', errors.whatsapp ? 'border-alert' : 'border-navy-900/15')}
            {...aria('whatsapp')}
            {...register('whatsapp')}
          />
          {err('whatsapp')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="trip" className="mb-2 block font-label text-sm font-semibold text-navy-900">
            Destino de interesse
          </label>
          <select id="trip" className={cn(fieldBase, 'h-13 cursor-pointer border-navy-900/15')} {...register('trip')}>
            <option value="">Selecione uma peregrinação (opcional)</option>
            {trips.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
            <option value="outro">Outro / ainda não decidi</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block font-label text-sm font-semibold text-navy-900">
            Mensagem <span aria-hidden="true">*</span>
          </label>
          <textarea id="message" rows={5} className={cn(fieldBase, 'py-3', errors.message ? 'border-alert' : 'border-navy-900/15')} {...aria('message')} {...register('message')} />
          {err('message')}
        </div>
      </div>

      {/* Antispam: invisível para pessoas, preenchido por robôs. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label className="flex cursor-pointer gap-3 text-[0.95rem] leading-relaxed text-slate-700">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-navy-900" {...aria('consent')} {...register('consent')} />
          <span>
            Concordo com o uso dos meus dados para receber o atendimento solicitado, conforme a{' '}
            <Link href="/politica-de-privacidade" className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4" target="_blank">
              Política de Privacidade
            </Link>
            . <span aria-hidden="true">*</span>
          </span>
        </label>
        {err('consent')}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-xl bg-alert/10 px-4 py-3 text-sm font-semibold text-alert">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-navy-900 px-8 font-label font-semibold text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] transition hover:-translate-y-0.5 hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
        {pending ? 'Enviando…' : 'Enviar mensagem'}
      </button>
      <p className="text-xs text-slate-500">* Campos obrigatórios.</p>
    </form>
  )
}
