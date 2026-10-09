'use client'
import { submitPriest } from '@/app/(frontend)/cadastro/actions'
import { PRIEST_PAGE } from '@/content/cadastro'
import { DESTINATIONS, PRIEST_GROUP_SIZES, PRIEST_INTERESTS, TRAVEL_PERIODS, UF_LIST, YES_NO } from '@/lib/leads/constants'
import { maskPhone } from '@/lib/leads/masks'
import { PRIEST_STEPS, priestSchema, type PriestInput } from '@/lib/leads/schemas'
import { ChipGroup, ConsentFields, Honeypot, SelectField, TextAreaField, TextField } from './fields'
import { FormActions, FormElement, ServerError, StepHeader, StepPanel, SuccessPanel } from './FormShell'
import { Turnstile } from './Turnstile'
import { useLeadForm } from './useLeadForm'

const STEP_LABELS = ['Seus dados', 'Sua atuação', 'Peregrinação']

export function PriestForm({ whatsappHref }: { whatsappHref: string }) {
  const { form, step, direction, back, next, handleSubmit, pending, serverError, done, onStart, setTurnstileToken, captchaKey } = useLeadForm<PriestInput>({
    type: 'padres',
    schema: priestSchema,
    action: submitPriest,
    steps: PRIEST_STEPS as string[][],
    defaults: { fullName: '', displayName: '', email: '', whatsapp: '', state: '', city: '', diocese: '', parish: '', ministry: '', mainInterest: '', hasOrganized: '', groupSize: '', destinations: [], travelPeriod: '', message: '', consentPrivacy: false },
  })

  if (done) return <SuccessPanel {...PRIEST_PAGE.form.success} whatsappHref={whatsappHref} />

  return (
    <FormElement
      onSubmit={handleSubmit}
      onFocusCapture={onStart}
    >
      <StepHeader labels={STEP_LABELS} current={step} />
      <Honeypot form={form} />
      <StepPanel stepKey={step} direction={direction}>
        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField form={form} name="fullName" label="Nome completo" required autoComplete="name" className="sm:col-span-2" />
            <TextField form={form} name="displayName" label="Nome pelo qual deseja ser identificado" hint="Ex.: Pe. João, Monsenhor Antônio." className="sm:col-span-2" />
            <TextField form={form} name="email" label="E-mail" required type="email" autoComplete="email" inputMode="email" />
            <TextField form={form} name="whatsapp" label="WhatsApp com DDD" required type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" mask={maskPhone} maxLength={16} />
            <SelectField form={form} name="state" label="Estado" required options={UF_LIST} placeholder="Selecione" />
            <TextField form={form} name="city" label="Cidade" required autoComplete="address-level2" />
          </div>
        ) : null}
        {step === 1 ? (
          <>
            <TextField form={form} name="diocese" label="Diocese" required placeholder="Ex.: Arquidiocese de São Paulo" />
            <TextField form={form} name="parish" label="Paróquia ou comunidade" required />
            <TextField form={form} name="ministry" label="Função ou ministério exercido" required placeholder="Ex.: Pároco, vigário paroquial, capelão" />
            <ChipGroup form={form} name="mainInterest" label="Interesse principal" required options={PRIEST_INTERESTS} />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <ChipGroup form={form} name="hasOrganized" label="Já organizou ou acompanhou peregrinações?" options={YES_NO} columns={2} />
            <ChipGroup form={form} name="groupSize" label="Quantidade aproximada de pessoas interessadas" options={PRIEST_GROUP_SIZES} columns={3} />
            <ChipGroup form={form} name="destinations" label="Destinos de interesse" hint="Selecione quantos quiser." options={DESTINATIONS} multiple columns={2} />
            <SelectField form={form} name="travelPeriod" label="Período previsto para a viagem" options={TRAVEL_PERIODS} placeholder="Selecione (opcional)" />
            <TextAreaField form={form} name="message" label="Mensagem adicional" maxLength={2000} />
            <ConsentFields form={form} purpose="avaliar o seu cadastro e permitir que a equipe da Via Lumina entre em contato sobre peregrinações e possíveis parcerias." />
            <Turnstile onToken={setTurnstileToken} resetKey={captchaKey} />
          </>
        ) : null}
      </StepPanel>
      <ServerError message={serverError} />
      <FormActions step={step} total={STEP_LABELS.length} pending={pending} submitLabel={PRIEST_PAGE.form.submit} onBack={back} onNext={next} />
      <p className="text-xs text-slate-500">* Campos obrigatórios. Seus dados ficam guardados ao avançar e voltar entre as etapas.</p>
    </FormElement>
  )
}
