import { z } from 'zod'
import {
  AGENCY_INTERESTS,
  AGENCY_PROFILES,
  AGENCY_TENURE,
  AGENCY_VOLUME,
  DESTINATION_VALUES,
  ENTRY_POINTS,
  GROUP_INTENT,
  PARTY_SIZES,
  PRIEST_GROUP_SIZES,
  PRIEST_INTERESTS,
  TRAVEL_PERIOD_VALUES,
  UF_VALUES,
} from './constants'
import { isValidCnpj, normalizeBrPhone, normalizeInstagram, normalizeUrl, onlyDigits } from './masks'

/**
 * Validação dos cadastros — a mesma definição roda no navegador (react-hook-form) e no servidor (Server Actions).
 * Os campos opcionais aceitam string vazia (formulário não preenchido).
 */

const values = <T extends readonly { value: string }[]>(list: T) => list.map((i) => i.value) as unknown as [string, ...string[]]
const optionalEnum = (list: readonly { value: string }[]) => z.enum(values(list)).or(z.literal('')).optional().default('')
const optionalText = (max: number) => z.string().trim().max(max, `Máximo de ${max} caracteres.`).optional().default('')
const requiredText = (label: string, min = 2, max = 160) =>
  z.string().trim().min(min, `Informe ${label}.`).max(max, `Máximo de ${max} caracteres.`)

const phone = z
  .string()
  .trim()
  .refine((v) => normalizeBrPhone(v) !== null, 'Informe um WhatsApp válido com DDD, ex.: (11) 99999-9999.')
const email = z.string().trim().toLowerCase().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.').max(160, 'E-mail muito longo.')
const uf = z.enum(UF_VALUES, { message: 'Selecione o estado.' })
const destinations = z.array(z.enum(DESTINATION_VALUES)).max(DESTINATION_VALUES.length)

/** Campos técnicos e de consentimento comuns a todos os formulários. */
const common = {
  // Antispam: o campo "website" fica invisível e deve permanecer vazio; "startedAt" mede o tempo de preenchimento.
  website: z.string().max(0).optional().default(''),
  startedAt: z.number().int(),
  turnstileToken: z.string().max(4096).optional().default(''),
  sourcePage: z.string().max(300).optional().default(''),
  entryPoint: z.enum(ENTRY_POINTS).or(z.literal('')).optional().default(''),
  utm: z.record(z.string(), z.string().max(100)).optional().default({}),
  consentPrivacy: z.literal(true, { message: 'Para enviar o cadastro, é necessário concordar com o tratamento dos dados para esta finalidade.' }),
  consentMarketing: z.boolean().optional().default(false),
}

/* ------------------------------ Padres ------------------------------ */
export const priestSchema = z.object({
  ...common,
  fullName: requiredText('seu nome completo', 5),
  displayName: optionalText(80),
  email,
  whatsapp: phone,
  state: uf,
  city: requiredText('a cidade', 2, 100),
  diocese: requiredText('a diocese', 2, 120),
  parish: requiredText('a paróquia ou comunidade', 2, 140),
  ministry: requiredText('sua função ou ministério', 2, 100),
  mainInterest: z.enum(values(PRIEST_INTERESTS), { message: 'Selecione o interesse principal.' }),
  hasOrganized: optionalEnum([{ value: 'sim' }, { value: 'nao' }]),
  groupSize: optionalEnum(PRIEST_GROUP_SIZES),
  destinations,
  travelPeriod: z.enum(TRAVEL_PERIOD_VALUES).or(z.literal('')).optional().default(''),
  message: optionalText(2000),
})
export type PriestInput = z.input<typeof priestSchema>
export type PriestData = z.output<typeof priestSchema>

/* ------------------------------ Agências ------------------------------ */
/**
 * Regras entre campos da agência. Ficam em função própria porque o Zod só executa refinamentos de objeto quando
 * os demais campos já são válidos; assim o formulário em etapas consegue exibir estes erros já na etapa certa.
 */
export function agencyRuleErrors(v: { profile?: string; cnpj?: string; website?: string; instagram?: string; cadastur?: string }): Record<string, string> {
  const errors: Record<string, string> = {}
  // Consultor independente pode não ter CNPJ (política comercial: ajuste aqui se a regra mudar).
  const cnpjRequired = v.profile !== 'consultor'
  if (!v.cnpj) {
    if (cnpjRequired) errors.cnpj = 'Informe o CNPJ da empresa.'
  } else if (!isValidCnpj(v.cnpj)) errors.cnpj = 'CNPJ inválido. Confira os 14 dígitos.'
  if (v.website && !normalizeUrl(v.website)) errors.website = 'Informe um endereço de site válido, ex.: www.suaagencia.com.br.'
  if (v.instagram && !normalizeInstagram(v.instagram)) errors.instagram = 'Informe o @ do Instagram comercial.'
  if (v.cadastur && onlyDigits(v.cadastur).length < 6) errors.cadastur = 'Informe o número do Cadastur completo.'
  return errors
}

export const agencySchema = z
  .object({
    ...common,
    legalName: requiredText('a razão social', 2, 160),
    tradeName: requiredText('o nome fantasia', 2, 160),
    cnpj: z.string().trim().max(18).optional().default(''),
    contactName: requiredText('o nome do responsável', 5, 120),
    contactRole: requiredText('o cargo ou função', 2, 80),
    email,
    whatsapp: phone,
    state: uf,
    city: requiredText('a cidade', 2, 100),
    profile: z.enum(values(AGENCY_PROFILES), { message: 'Selecione o perfil de atuação.' }),
    interest: z.enum(values(AGENCY_INTERESTS), { message: 'Selecione o interesse na parceria.' }),
    cadastur: optionalText(40),
    website: optionalText(200),
    instagram: optionalText(80),
    tenure: optionalEnum(AGENCY_TENURE),
    worksWithReligious: optionalEnum([{ value: 'sim' }, { value: 'nao' }]),
    volume: optionalEnum(AGENCY_VOLUME),
    destinations,
    message: optionalText(2000),
  })
  .superRefine((v, ctx) => {
    for (const [path, message] of Object.entries(agencyRuleErrors(v))) ctx.addIssue({ code: 'custom', path: [path], message })
  })
export type AgencyInput = z.input<typeof agencySchema>
export type AgencyData = z.output<typeof agencySchema>

/* ------------------------------ Peregrinos ------------------------------ */
export const pilgrimSchema = z.object({
  ...common,
  fullName: requiredText('seu nome completo', 5),
  email,
  whatsapp: phone,
  state: uf,
  city: requiredText('a cidade', 2, 100),
  destinations: destinations.min(1, 'Selecione ao menos um destino de interesse.'),
  travelPeriod: z.enum(TRAVEL_PERIOD_VALUES, { message: 'Informe quando pretende viajar.' }),
  boardingCity: optionalText(100),
  partySize: optionalEnum(PARTY_SIZES),
  previousPilgrimage: optionalEnum([{ value: 'sim' }, { value: 'nao' }]),
  groupWithCommunity: optionalEnum(GROUP_INTENT),
  message: optionalText(1000),
})
export type PilgrimInput = z.input<typeof pilgrimSchema>
export type PilgrimData = z.output<typeof pilgrimSchema>

/** Campos validados em cada etapa dos formulários em etapas. */
export const PRIEST_STEPS: (keyof PriestInput)[][] = [
  ['fullName', 'displayName', 'email', 'whatsapp', 'state', 'city'],
  ['diocese', 'parish', 'ministry', 'mainInterest'],
  ['hasOrganized', 'groupSize', 'destinations', 'travelPeriod', 'message', 'consentPrivacy', 'consentMarketing'],
]
export const AGENCY_STEPS: (keyof AgencyInput)[][] = [
  ['legalName', 'tradeName', 'profile', 'cnpj', 'state', 'city'],
  ['contactName', 'contactRole', 'email', 'whatsapp', 'interest'],
  ['cadastur', 'website', 'instagram', 'tenure', 'worksWithReligious', 'volume', 'destinations', 'message', 'consentPrivacy', 'consentMarketing'],
]

export type LeadFormType = 'padres' | 'agencias' | 'peregrinos'

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> }
