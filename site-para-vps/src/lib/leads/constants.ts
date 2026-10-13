/** Constantes compartilhadas pelos cadastros (Padres, Agências e Peregrinos): formulários, CMS e painel. */

export const LEAD_TYPES = [
  { value: 'PADRE', label: 'Padre', plural: 'Padres', formKey: 'padres' },
  { value: 'AGENCIA', label: 'Agência', plural: 'Agências', formKey: 'agencias' },
  { value: 'PEREGRINO', label: 'Peregrino', plural: 'Peregrinos', formKey: 'peregrinos' },
] as const
export type LeadType = (typeof LEAD_TYPES)[number]['value']
export const leadTypeLabel = (t: string) => LEAD_TYPES.find((x) => x.value === t)?.label ?? t

export const LEAD_SOURCES = [
  { value: 'lp-padres', label: 'Landing page · Padres' },
  { value: 'lp-agencias', label: 'Landing page · Agências' },
  { value: 'lp-peregrinos', label: 'Landing page · Peregrinos' },
  { value: 'manual', label: 'Cadastro manual' },
] as const
export type LeadSource = (typeof LEAD_SOURCES)[number]['value']
export const SOURCE_BY_TYPE: Record<LeadType, LeadSource> = { PADRE: 'lp-padres', AGENCIA: 'lp-agencias', PEREGRINO: 'lp-peregrinos' }

/** Status de atendimento (funil comercial). */
export const LEAD_STATUS = [
  { value: 'novo', label: 'Novo cadastro' },
  { value: 'em-analise', label: 'Em análise' },
  { value: 'contato-iniciado', label: 'Contato iniciado' },
  { value: 'em-negociacao', label: 'Em negociação' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'encerrado', label: 'Encerrado' },
] as const
export type LeadStatus = (typeof LEAD_STATUS)[number]['value']
export const leadStatusLabel = (v: string) => LEAD_STATUS.find((s) => s.value === v)?.label ?? v

/** Aprovação de parceria — separada do status de atendimento. Só se aplica a padres e agências. */
export const PARTNERSHIP_STATUS = [
  { value: 'nao-se-aplica', label: 'Não se aplica' },
  { value: 'pendente', label: 'Pendente de análise' },
  { value: 'em-avaliacao', label: 'Em avaliação' },
  { value: 'aprovada', label: 'Parceria aprovada' },
  { value: 'nao-aprovada', label: 'Não aprovada' },
] as const
export const partnershipLabel = (v: string) => PARTNERSHIP_STATUS.find((s) => s.value === v)?.label ?? v

export const VERIFICATION_STATUS = [
  { value: 'nao-verificado', label: 'Não verificado' },
  { value: 'verificado', label: 'Verificado' },
  { value: 'divergente', label: 'Divergente' },
] as const

/** Finalidades de consentimento registradas. */
export const CONSENT_PURPOSES = [
  { value: 'cadastro-contato', label: 'Cadastro e contato sobre o interesse informado' },
  { value: 'comunicacoes', label: 'Comunicações promocionais e novidades (opcional)' },
] as const
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number]['value']

/**
 * Versão do aviso de privacidade apresentado nos formulários.
 * Altere junto com o texto em /politica-de-privacidade e nos avisos dos formulários.
 */
export const PRIVACY_NOTICE_VERSION = '2026-10-09'

export const UF_LIST = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
].map(([value, label]) => ({ value: value!, label: label! }))
export const UF_VALUES = UF_LIST.map((u) => u.value) as [string, ...string[]]

/** Destinos de interesse (alinhados ao catálogo de peregrinações). */
export const DESTINATIONS = [
  { value: 'brasil', label: 'Aparecida e outros destinos do Brasil' },
  { value: 'portugal-fatima', label: 'Portugal e Fátima' },
  { value: 'italia-vaticano', label: 'Itália e Vaticano' },
  { value: 'franca-lourdes', label: 'França e Lourdes' },
  { value: 'espanha-marianos', label: 'Espanha e Santuários Marianos' },
  { value: 'mexico-guadalupe', label: 'México e Guadalupe' },
  { value: 'egito-terra-santa', label: 'Egito e Terra Santa' },
  { value: 'indefinido', label: 'Ainda não escolhi meu destino' },
] as const
export const DESTINATION_VALUES = DESTINATIONS.map((d) => d.value) as unknown as [string, ...string[]]
export const destinationLabel = (v: string) => DESTINATIONS.find((d) => d.value === v)?.label ?? v

export const TRAVEL_PERIODS = [
  { value: 'ate-3-meses', label: 'Nos próximos 3 meses' },
  { value: '3-6-meses', label: 'Entre 3 e 6 meses' },
  { value: '6-12-meses', label: 'Entre 6 e 12 meses' },
  { value: 'mais-de-1-ano', label: 'Daqui a mais de 1 ano' },
  { value: 'pesquisando', label: 'Ainda estou pesquisando' },
] as const
export const TRAVEL_PERIOD_VALUES = TRAVEL_PERIODS.map((p) => p.value) as unknown as [string, ...string[]]
export const periodLabel = (v: string) => TRAVEL_PERIODS.find((p) => p.value === v)?.label ?? v

export const YES_NO = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
] as const

/* ----- Padres ----- */
export const PRIEST_INTERESTS = [
  { value: 'organizar', label: 'Organizar uma peregrinação com minha comunidade' },
  { value: 'acompanhar', label: 'Acompanhar espiritualmente uma peregrinação' },
  { value: 'conhecer-destinos', label: 'Conhecer os destinos disponíveis' },
  { value: 'parcerias', label: 'Receber informações sobre possíveis parcerias' },
  { value: 'outro', label: 'Outro' },
] as const
export const PRIEST_GROUP_SIZES = [
  { value: 'ate-15', label: 'Até 15' },
  { value: '16-30', label: '16 a 30' },
  { value: '31-50', label: '31 a 50' },
  { value: 'acima-50', label: 'Acima de 50' },
  { value: 'nao-sei', label: 'Ainda não sei' },
] as const

/* ----- Agências ----- */
export const AGENCY_PROFILES = [
  { value: 'agencia', label: 'Agência de viagens' },
  { value: 'operadora', label: 'Operadora de turismo' },
  { value: 'consultor', label: 'Consultor de turismo independente' },
  { value: 'outro', label: 'Outro' },
] as const
export const AGENCY_INTERESTS = [
  { value: 'comercializar', label: 'Comercializar roteiros da Via Lumina' },
  { value: 'grupos-exclusivos', label: 'Desenvolver grupos exclusivos' },
  { value: 'condicoes', label: 'Conhecer condições comerciais' },
  { value: 'turismo-religioso', label: 'Trabalhar com turismo religioso' },
  { value: 'outra', label: 'Outra possibilidade de parceria' },
] as const
export const AGENCY_TENURE = [
  { value: 'menos-1', label: 'Menos de 1 ano' },
  { value: '1-3', label: '1 a 3 anos' },
  { value: '4-10', label: '4 a 10 anos' },
  { value: 'mais-10', label: 'Mais de 10 anos' },
] as const
export const AGENCY_VOLUME = [
  { value: 'ate-10', label: 'Até 10 clientes/ano' },
  { value: '11-50', label: '11 a 50 clientes/ano' },
  { value: '51-200', label: '51 a 200 clientes/ano' },
  { value: 'acima-200', label: 'Mais de 200 clientes/ano' },
] as const

/* ----- Peregrinos ----- */
export const PARTY_SIZES = [
  { value: '1', label: '1 pessoa' },
  { value: '2', label: '2 pessoas' },
  { value: '3-4', label: '3 a 4 pessoas' },
  { value: '5-9', label: '5 a 9 pessoas' },
  { value: '10+', label: '10 pessoas ou mais' },
] as const
export const GROUP_INTENT = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'talvez', label: 'Talvez' },
] as const

/** Origens de acesso conhecidas (parâmetro ?origem=). Qualquer outro valor é ignorado. */
export const ENTRY_POINTS = ['menu', 'rodape', 'home', 'institucional', 'hub', 'catalogo'] as const
