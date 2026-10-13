'use client'
import { Check, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useId, type ComponentProps, type ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/cn'
import { m } from '../motion'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Form = UseFormReturn<any>

export const inputClass =
  'w-full rounded-2xl border bg-white px-4 text-[1rem] text-ink-900 shadow-[inset_0_1px_2px_rgb(10_46_92/0.05)] outline-none transition placeholder:text-slate-500 focus:border-gold-500 focus:ring-4 focus:ring-gold-200/60'

const errorOf = (form: Form, name: string): string | undefined => {
  const e = form.formState.errors[name]
  return e && typeof e.message === 'string' ? e.message : undefined
}

/** Rótulo + controle + mensagem de erro junto ao campo. */
export function Field({ form, name, label, required, hint, className, children }: { form: Form; name: string; label: string; required?: boolean; hint?: string; className?: string; children: (a: { id: string; aria: Record<string, unknown> }) => ReactNode }) {
  const id = `f-${useId().replace(/:/g, '')}-${name}`
  const error = errorOf(form, name)
  const describedBy = [error ? `${id}-erro` : null, hint ? `${id}-dica` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className={className} data-field={name}>
      <label htmlFor={id} className="mb-2 block font-label text-sm font-semibold text-navy-900">
        {label} {required ? <span aria-hidden="true" className="text-gold-700">*</span> : <span className="font-normal text-slate-500">(opcional)</span>}
      </label>
      {children({ id, aria: { 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined } })}
      {hint && !error ? (
        <p id={`${id}-dica`} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-sm font-semibold text-alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type TextProps = {
  form: Form
  name: string
  label: string
  required?: boolean
  hint?: string
  className?: string
  mask?: (v: string) => string
} & Pick<ComponentProps<'input'>, 'type' | 'placeholder' | 'autoComplete' | 'inputMode' | 'maxLength'>

export function TextField({ form, name, label, required, hint, className, mask, ...input }: TextProps) {
  const invalid = Boolean(errorOf(form, name))
  return (
    <Field form={form} name={name} label={label} required={required} hint={hint} className={className}>
      {({ id, aria }) => (
        <input
          id={id}
          className={cn(inputClass, 'h-13', invalid ? 'border-alert' : 'border-navy-900/15')}
          {...input}
          {...aria}
          {...form.register(name, mask ? { onChange: (e) => { e.target.value = mask(e.target.value) } } : undefined)}
        />
      )}
    </Field>
  )
}

export function SelectField({ form, name, label, required, hint, className, options, placeholder }: { form: Form; name: string; label: string; required?: boolean; hint?: string; className?: string; options: readonly { value: string; label: string }[]; placeholder: string }) {
  const invalid = Boolean(errorOf(form, name))
  return (
    <Field form={form} name={name} label={label} required={required} hint={hint} className={className}>
      {({ id, aria }) => (
        <div className="relative">
          <select id={id} className={cn(inputClass, 'h-13 cursor-pointer appearance-none pr-11', invalid ? 'border-alert' : 'border-navy-900/15')} {...aria} {...form.register(name)}>
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        </div>
      )}
    </Field>
  )
}

export function TextAreaField({ form, name, label, required, hint, className, rows = 4, maxLength }: { form: Form; name: string; label: string; required?: boolean; hint?: string; className?: string; rows?: number; maxLength?: number }) {
  const invalid = Boolean(errorOf(form, name))
  return (
    <Field form={form} name={name} label={label} required={required} hint={hint} className={className}>
      {({ id, aria }) => <textarea id={id} rows={rows} maxLength={maxLength} className={cn(inputClass, 'py-3', invalid ? 'border-alert' : 'border-navy-900/15')} {...aria} {...form.register(name)} />}
    </Field>
  )
}

/** Escolha única (radio) ou múltipla (checkbox) em "chips" grandes, fáceis de tocar no celular. */
export function ChipGroup({ form, name, label, required, hint, options, multiple, className, columns = 1 }: { form: Form; name: string; label: string; required?: boolean; hint?: string; options: readonly { value: string; label: string }[]; multiple?: boolean; className?: string; columns?: 1 | 2 | 3 }) {
  const gid = useId().replace(/:/g, '')
  const value = form.watch(name) as string | string[] | undefined
  const selected = (v: string) => (multiple ? Array.isArray(value) && value.includes(v) : value === v)
  const error = errorOf(form, name)
  const toggle = (v: string) => {
    if (multiple) {
      const cur = Array.isArray(value) ? value : []
      form.setValue(name, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v], { shouldDirty: true, shouldValidate: form.formState.isSubmitted || Boolean(error), shouldTouch: true })
    } else form.setValue(name, !required && value === v ? '' : v, { shouldDirty: true, shouldValidate: form.formState.isSubmitted || Boolean(error), shouldTouch: true })
  }
  return (
    <fieldset className={className} data-field={name} aria-describedby={error ? `${gid}-erro` : undefined}>
      <legend className="mb-2.5 font-label text-sm font-semibold text-navy-900">
        {label} {required ? <span aria-hidden="true" className="text-gold-700">*</span> : <span className="font-normal text-slate-500">(opcional)</span>}
      </legend>
      {hint ? <p className="-mt-1.5 mb-2.5 text-sm text-slate-500">{hint}</p> : null}
      <div className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}>
        {options.map((o) => {
          const on = selected(o.value)
          return (
            <label key={o.value} className="group/chip relative block cursor-pointer">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={`${gid}-${name}`}
                checked={on}
                onChange={() => toggle(o.value)}
                // Radios opcionais podem ser desmarcados clicando de novo.
                onClick={!multiple && !required && on ? () => toggle(o.value) : undefined}
                className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
              />
              <span
                className={cn(
                  'flex min-h-12 active:scale-[0.985] items-center gap-3 rounded-2xl border px-4 py-2.5 text-[0.97rem] leading-snug transition-colors duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-gold-200/70',
                  on ? 'border-navy-900 bg-navy-900 text-white shadow-[0_8px_22px_rgb(10_46_92/0.18)]' : 'border-navy-900/15 bg-white text-ink-900 group-hover/chip:border-gold-500',
                  error && !on && 'border-alert/60',
                )}
              >
                <span aria-hidden="true" className={cn('flex size-5 shrink-0 items-center justify-center border transition-colors', multiple ? 'rounded-md' : 'rounded-full', on ? 'border-gold-300 bg-gold-300 text-navy-950' : 'border-navy-900/30 bg-white')}>
                  {on ? (
                    <m.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }}>
                      <Check className="size-3.5" strokeWidth={3} />
                    </m.span>
                  ) : null}
                </span>
                {o.label}
              </span>
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={`${gid}-erro`} role="alert" className="mt-2 text-sm font-semibold text-alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

/** Campo-armadilha para robôs: invisível e fora do fluxo de teclado. */
export function Honeypot({ form }: { form: Form }) {
  return (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <label htmlFor="website">Não preencha este campo</label>
      <input id="website" tabIndex={-1} autoComplete="off" {...form.register('website')} />
    </div>
  )
}

/**
 * Consentimentos (LGPD): o de privacidade é obrigatório para tratar o cadastro; o de comunicações promocionais
 * é separado, opcional e nunca condiciona o envio.
 */
export function ConsentFields({ form, purpose }: { form: Form; purpose: string }) {
  const errPrivacy = errorOf(form, 'consentPrivacy')
  const link = 'font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4'
  return (
    <div className="space-y-4 rounded-2xl bg-cream-100 p-5 text-[0.95rem] leading-relaxed text-slate-700" data-field="consentPrivacy">
      <p>
        <strong className="text-navy-900">Para que usaremos seus dados:</strong> {purpose} Coletamos apenas as informações deste formulário e não pedimos CPF nem dados financeiros. Saiba mais na{' '}
        <Link href="/politica-de-privacidade" target="_blank" className={link}>
          Política de Privacidade
        </Link>
        .
      </p>
      <div>
        <label className="flex cursor-pointer gap-3">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-navy-900" aria-invalid={errPrivacy ? true : undefined} aria-describedby={errPrivacy ? 'consentPrivacy-erro' : undefined} {...form.register('consentPrivacy')} />
          <span>
            Li e concordo com o tratamento dos meus dados pessoais para esta finalidade, conforme a Política de Privacidade. <span aria-hidden="true" className="text-gold-700">*</span>
          </span>
        </label>
        {errPrivacy ? (
          <p id="consentPrivacy-erro" role="alert" className="mt-1.5 ml-8 text-sm font-semibold text-alert">
            {errPrivacy}
          </p>
        ) : null}
      </div>
      <label className="flex cursor-pointer gap-3">
        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-navy-900" {...form.register('consentMarketing')} />
        <span>
          <span className="font-semibold text-navy-900">Opcional:</span> aceito receber novidades, roteiros e comunicações promocionais da Via Lumina por e-mail e WhatsApp. Posso retirar este consentimento a qualquer momento, e ele não é necessário para enviar o cadastro.
        </span>
      </label>
    </div>
  )
}

export type FieldValuesAny = FieldValues
