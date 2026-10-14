'use client'
import { submitPilgrim } from '@/app/(frontend)/cadastro/actions'
import { PILGRIM_PAGE } from '@/content/cadastro'
import { DESTINATIONS, GROUP_INTENT, PARTY_SIZES, TRAVEL_PERIODS, UF_LIST, YES_NO } from '@/lib/leads/constants'
import { maskPhone } from '@/lib/leads/masks'
import { pilgrimSchema, type PilgrimInput } from '@/lib/leads/schemas'
import { ChipGroup, ConsentFields, Honeypot, SelectField, TextAreaField, TextField } from './fields'
import { FormElement, ServerError, SubmitButton, SuccessPanel } from './FormShell'
import { Turnstile } from './Turnstile'
import { useLeadForm } from './useLeadForm'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Formulário curto e direto: os campos opcionais ficam recolhidos para não alongar a página. */
export function PilgrimForm({ whatsappHref, communityHref }: { whatsappHref: string; communityHref?: string }) {
  const [more, setMore] = useState(false)
  const { form, handleSubmit, pending, serverError, done, onStart, setTurnstileToken, captchaKey } = useLeadForm<PilgrimInput>({
    type: 'peregrinos',
    schema: pilgrimSchema,
    action: submitPilgrim,
    defaults: { fullName: '', email: '', whatsapp: '', state: '', city: '', destinations: [], travelPeriod: '', boardingCity: '', partySize: '', previousPilgrimage: '', groupWithCommunity: '', message: '', consentPrivacy: false },
  })

  if (done) return <SuccessPanel {...PILGRIM_PAGE.form.success} whatsappHref={whatsappHref} communityHref={communityHref} />

  return (
    <FormElement onSubmit={handleSubmit} onFocusCapture={onStart}>
      <Honeypot form={form} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField form={form} name="fullName" label="Nome completo" required autoComplete="name" className="sm:col-span-2" />
        <TextField form={form} name="email" label="E-mail" required type="email" autoComplete="email" inputMode="email" />
        <TextField form={form} name="whatsapp" label="WhatsApp" required type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" mask={maskPhone} maxLength={16} />
        <TextField form={form} name="city" label="Cidade" required autoComplete="address-level2" />
        <SelectField form={form} name="state" label="Estado" required options={UF_LIST} placeholder="Selecione" />
      </div>
      <ChipGroup form={form} name="destinations" label="Destinos de interesse" required hint="Selecione quantos quiser." options={DESTINATIONS} multiple columns={2} />
      <ChipGroup form={form} name="travelPeriod" label="Quando pretende viajar?" required options={TRAVEL_PERIODS} columns={2} />

      <div className="rounded-2xl border border-navy-900/10">
        <button type="button" aria-expanded={more} onClick={() => setMore((v) => !v)} className="flex min-h-14 w-full items-center justify-between gap-3 px-5 text-left font-label text-sm font-semibold text-navy-900">
          Quer detalhar mais? (opcional)
          <ChevronDown className={cn('size-5 text-gold-700 transition-transform', more && 'rotate-180')} aria-hidden="true" />
        </button>
        <div hidden={!more} className="space-y-5 px-5 pb-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField form={form} name="boardingCity" label="Aeroporto ou cidade preferida para embarque" />
            <SelectField form={form} name="partySize" label="Quantas pessoas pretendem viajar?" options={PARTY_SIZES} placeholder="Selecione" />
          </div>
          <ChipGroup form={form} name="previousPilgrimage" label="Já participou de uma peregrinação?" options={YES_NO} columns={2} />
          <ChipGroup form={form} name="groupWithCommunity" label="Gostaria de viajar com um grupo de sua comunidade?" options={GROUP_INTENT} columns={3} />
          <TextAreaField form={form} name="message" label="Mensagem ou preferência especial" rows={3} maxLength={1000} />
        </div>
      </div>

      <ConsentFields form={form} purpose="registrar seu cadastro como cliente na base da Via Lumina e permitir que a equipe entre em contato com informações sobre as peregrinações do seu interesse." />
      <Turnstile onToken={setTurnstileToken} resetKey={captchaKey} />
      <ServerError message={serverError} />
      <SubmitButton pending={pending} label={PILGRIM_PAGE.form.submit} />
      <p className="text-xs text-slate-500">* Campos obrigatórios.</p>
    </FormElement>
  )
}
