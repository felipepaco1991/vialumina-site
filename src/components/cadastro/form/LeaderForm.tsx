'use client'
import { submitLeader } from '@/app/(frontend)/cadastro/actions'
import { LEADER_PAGE } from '@/content/cadastro'
import { DESTINATIONS, LEADER_REACH, LEADER_ROLES, PRIEST_GROUP_SIZES, TRAVEL_PERIODS, UF_LIST, YES_NO } from '@/lib/leads/constants'
import { maskPhone } from '@/lib/leads/masks'
import { LEADER_STEPS, leaderSchema, type LeaderInput } from '@/lib/leads/schemas'
import { ChipGroup, ConsentFields, Honeypot, SelectField, TextAreaField, TextField } from './fields'
import { FormActions, FormElement, ServerError, StepHeader, StepPanel, SuccessPanel } from './FormShell'
import { Turnstile } from './Turnstile'
import { useLeadForm } from './useLeadForm'

const STEP_LABELS = ['Seus dados', 'Sua atuação', 'Seu grupo']

export function LeaderForm({ whatsappHref }: { whatsappHref: string }) {
  const { form, step, direction, back, next, handleSubmit, pending, serverError, done, onStart, setTurnstileToken, captchaKey } = useLeadForm<LeaderInput>({
    type: 'formadores',
    schema: leaderSchema,
    action: submitLeader,
    steps: LEADER_STEPS as string[][],
    defaults: { fullName: '', email: '', whatsapp: '', state: '', city: '', community: '', role: '', roleDetail: '', instagram: '', reach: '', hasOrganized: '', hasSpiritualGuide: '', groupSize: '', destinations: [], travelPeriod: '', message: '', consentPrivacy: false },
  })

  if (done) return <SuccessPanel {...LEADER_PAGE.form.success} whatsappHref={whatsappHref} />

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
            <TextField form={form} name="email" label="E-mail" required type="email" autoComplete="email" inputMode="email" />
            <TextField form={form} name="whatsapp" label="WhatsApp com DDD" required type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" mask={maskPhone} maxLength={16} />
            <SelectField form={form} name="state" label="Estado" required options={UF_LIST} placeholder="Selecione" />
            <TextField form={form} name="city" label="Cidade" required autoComplete="address-level2" />
            <TextField form={form} name="community" label="Igreja, comunidade ou movimento a que você pertence" required placeholder="Ex.: Paróquia São José, Renovação Carismática" className="sm:col-span-2" />
          </div>
        ) : null}
        {step === 1 ? (
          <>
            <ChipGroup form={form} name="role" label="Como você atua na comunidade?" required options={LEADER_ROLES} />
            <TextField form={form} name="roleDetail" label="Qual é a sua função?" placeholder="Ex.: Coordenadora da pastoral familiar" />
            <TextField form={form} name="instagram" label="Instagram" placeholder="@seuperfil" hint="Ajuda a equipe a conhecer melhor o seu trabalho." />
            <ChipGroup form={form} name="reach" label="Quantas pessoas, aproximadamente, você alcança (grupo, comunidade, redes)?" options={LEADER_REACH} columns={2} />
            <ChipGroup form={form} name="hasOrganized" label="Já organizou grupos de viagem?" options={YES_NO} columns={2} />
            <ChipGroup form={form} name="hasSpiritualGuide" label="Já conta com um padre ou assessor espiritual para acompanhar o grupo?" options={YES_NO} columns={2} />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <ChipGroup form={form} name="groupSize" label="Quantidade aproximada de pessoas interessadas" options={PRIEST_GROUP_SIZES} columns={3} />
            <ChipGroup form={form} name="destinations" label="Destinos de interesse" hint="Selecione quantos quiser." options={DESTINATIONS} multiple columns={2} />
            <SelectField form={form} name="travelPeriod" label="Período previsto para a viagem" options={TRAVEL_PERIODS} placeholder="Selecione (opcional)" />
            <TextAreaField form={form} name="message" label="Mensagem adicional" maxLength={2000} />
            <ConsentFields form={form} purpose="avaliar o seu cadastro e permitir que a equipe da Via Lumina entre em contato sobre a formação de grupos de peregrinos e possíveis parcerias." />
            <Turnstile onToken={setTurnstileToken} resetKey={captchaKey} />
          </>
        ) : null}
      </StepPanel>
      <ServerError message={serverError} />
      <FormActions step={step} total={STEP_LABELS.length} pending={pending} submitLabel={LEADER_PAGE.form.submit} onBack={back} onNext={next} />
      <p className="text-xs text-slate-500">* Campos obrigatórios. Seus dados ficam guardados ao avançar e voltar entre as etapas.</p>
    </FormElement>
  )
}
