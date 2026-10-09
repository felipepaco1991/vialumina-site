/** Taxonomias compartilhadas entre o CMS e o site. */

export const REGIONS = [
  { value: 'brasil', label: 'Brasil' },
  { value: 'europa', label: 'Europa' },
  { value: 'america-do-norte', label: 'América do Norte' },
  { value: 'oriente-medio-africa', label: 'Oriente Médio e África' },
] as const
export type Region = (typeof REGIONS)[number]['value']
export const regionLabel = (value: string) => REGIONS.find((r) => r.value === value)?.label ?? value

export const TRIP_STATUS = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'sob-consulta', label: 'Sob consulta' },
  { value: 'esgotado', label: 'Esgotado' },
  { value: 'encerrado', label: 'Encerrado' },
] as const
export type TripStatus = (typeof TRIP_STATUS)[number]['value']

/** Status exibidos no catálogo público. */
export const LISTED_STATUS: TripStatus[] = ['publicado', 'sob-consulta', 'esgotado']
/** Status com página pública acessível (encerrado mantém a página por SEO, com aviso). */
export const PUBLIC_STATUS: TripStatus[] = ['publicado', 'sob-consulta', 'esgotado', 'encerrado']

export const STATUS_BADGE: Partial<Record<TripStatus, string>> = {
  'sob-consulta': 'Sob consulta',
  esgotado: 'Esgotado',
  encerrado: 'Viagem encerrada',
}

/** Faixas de duração do filtro (em dias). */
export const DURATION_RANGES = [
  { value: 'ate-7', label: 'Até 7 dias', min: 1, max: 7 },
  { value: '8-12', label: '8 a 12 dias', min: 8, max: 12 },
  { value: '13-15', label: '13 a 15 dias', min: 13, max: 15 },
  { value: '16-mais', label: '16 dias ou mais', min: 16, max: Infinity },
] as const
