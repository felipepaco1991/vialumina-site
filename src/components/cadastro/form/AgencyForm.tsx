'use client'
import { submitAgency } from '@/app/(frontend)/cadastro/actions'
import { AGENCY_PAGE } from '@/content/cadastro'
import { AGENCY_INTERESTS, AGENCY_PROFILES, AGENCY_TENURE, AGENCY_VOLUME, DESTINATIONS, UF_LIST, YES_NO } from '@/lib/leads/constants'
import { maskCnpj, maskPhone } from '@/lib/leads/masks'
import { AGENCY_STEPS, agencyRuleErrors, agencySchema, type AgencyInput } from '@/lib/leads/schemas'
import { ChipGroup, ConsentFields, Honeypot, SelectField, TextAreaField, TextField } from './fields'
import { FormActions, FormElement, ServerError, StepHeader, StepPanel, SuccessPanel } from './FormShell'
import { Turnstile } from './Turnstile'
import { useLeadForm } from './useLeadForm'

const STEP_LABELS = ['A empresa', 'Responsável e interesse', 'Perfil comercial']

export function AgencyForm({ whatsappHref }: { whatsappHref: string }) {
  const { form, step, direction, back, next, handleSubmit, pending, serverError, done, onStart, setTurnstileToken, captchaKey } = useLeadForm<AgencyInput>({
    type: 'agencias',
    schema: agencySchema,
    action: submitAgency,
    steps: AGENCY_STEPS as string[][],
    extraErrors: (v) => agencyRuleErrors(v),
    defaults: {
      legalName: '', tradeName: '', cnpj: '', contactName: '', contactRole: '', email: '', whatsapp: '', state: '', city: '', profile: '', interest: '',
      cadastur: '', website: '', instagram: '', tenure: '', worksWithReligious: '', volume: '', destinations: [], message: '', consentPrivacy: false,
    },
  })

  if (done) return <SuccessPanel {...AGENCY_PAGE.form.success} whatsappHref={whatsappHref} />

  const independent = form.watch('profile') === 'consultor'

  return (
    <FormElement onSubmit={handleSubmit} onFocusCapture={onStart}>
      <StepHeader labels={STEP_LABELS} current={step} />
      <Honeypot form={form} />
      <StepPanel stepKey={step} direction={direction}>
        {step === 0 ? (
          <>
            <ChipGroup form={form} name="profile" label="Perfil de atuação" required options={AGENCY_PROFILES} columns={2} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField form={form} name="legalName" label="Razão social" required autoComplete="organization" className="sm:col-span-2" hint={independent ? 'Se não tiver empresa, informe seu nome completo.' : undefined} />
              <TextField form={form} name="tradeName" label="Nome fantasia" required />
              <TextField
                form={form}
                name="cnpj"
                label="CNPJ"
                required={!independent}
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                mask={maskCnpj}
                maxLength={18}
                hint={independent ? 'Opcional para consultores independentes sem CNPJ.' : 'Será conferido posteriormente pela nossa equipe.'}
              />
              <SelectField form={form} name="state" label="Estado" required options={UF_LIST} placeholder="Selecione" />
              <TextField form={form} name="city" label="Cidade" required autoComplete="address-level2" />
            </div>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField form={form} name="contactName" label="Nome do responsável" required autoComplete="name" />
              <TextField form={form} name="contactRole" label="Cargo ou função" required autoComplete="organization-title" />
              <TextField form={form} name="email" label="E-mail comercial" required type="email" autoComplete="email" inputMode="email" />
              <TextField form={form} name="whatsapp" label="WhatsApp" required type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" mask={maskPhone} maxLength={16} />
            </div>
            <ChipGroup form={form} name="interest" label="Interesse na parceria" required options={AGENCY_INTERESTS} />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField form={form} name="cadastur" label="Cadastur, se aplicável" inputMode="numeric" />
              <TextField form={form} name="website" label="Site da empresa" type="url" inputMode="url" placeholder="www.suaagencia.com.br" autoComplete="url" />
              <TextField form={form} name="instagram" label="Instagram comercial" placeholder="@suaagencia" />
              <SelectField form={form} name="tenure" label="Tempo de atuação" options={AGENCY_TENURE} placeholder="Selecione" />
            </div>
            <ChipGroup form={form} name="worksWithReligious" label="Já trabalha com turismo religioso?" options={YES_NO} columns={2} />
            <SelectField form={form} name="volume" label="Volume aproximado de clientes ou grupos" options={AGENCY_VOLUME} placeholder="Prefiro não informar" />
            <ChipGroup form={form} name="destinations" label="Destinos de maior interesse" options={DESTINATIONS} multiple columns={2} />
            <TextAreaField form={form} name="message" label="Mensagem adicional" maxLength={2000} />
            <ConsentFields form={form} purpose="analisar o cadastro da sua agência e permitir que a equipe comercial da Via Lumina entre em contato sobre possibilidades de parceria. O cadastro não representa credenciamento." />
            <Turnstile onToken={setTurnstileToken} resetKey={captchaKey} />
          </>
        ) : null}
      </StepPanel>
      <ServerError message={serverError} />
      <FormActions step={step} total={STEP_LABELS.length} pending={pending} submitLabel={AGENCY_PAGE.form.submit} onBack={back} onNext={next} />
      <p className="text-xs text-slate-500">* Campos obrigatórios. Seus dados ficam guardados ao avançar e voltar entre as etapas.</p>
    </FormElement>
  )
}
