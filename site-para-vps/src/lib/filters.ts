/**
 * Lógica de filtros do catálogo /destinos — pura e compartilhada entre
 * servidor (renderização inicial) e cliente (atualização instantânea).
 * As opções de filtro são derivadas dos roteiros cadastrados, nunca de listas fixas.
 */
import { slugify } from '@/fields/slug'
import { formatMonthYear, normalizeText } from './format'
import { DURATION_RANGES, REGIONS, regionLabel } from './taxonomy'
import type { TripCardData } from './trip-model'

export type SortKey = 'data' | 'relevancia' | 'duracao'

export type FilterState = {
  q: string
  regiao: string[]
  pais: string[]
  mes: string[]
  embarque: string[]
  duracao: string[]
  acompanhante: string[]
  preco: string[]
  ordem: SortKey
}

export const EMPTY_FILTERS: FilterState = {
  q: '',
  regiao: [],
  pais: [],
  mes: [],
  embarque: [],
  duracao: [],
  acompanhante: [],
  preco: [],
  ordem: 'data',
}

const LIST_KEYS = ['regiao', 'pais', 'mes', 'embarque', 'duracao', 'acompanhante', 'preco'] as const
type ListKey = (typeof LIST_KEYS)[number]

/** Faixas de preço total em R$ (somente valores aprovados). */
export const PRICE_RANGES = [
  { value: 'ate-10-mil', label: 'Até R$ 10 mil', min: 0, max: 10_000 },
  { value: '10-25-mil', label: 'R$ 10 mil a R$ 25 mil', min: 10_000, max: 25_000 },
  { value: '25-35-mil', label: 'R$ 25 mil a R$ 35 mil', min: 25_000, max: 35_000 },
  { value: 'acima-35-mil', label: 'Acima de R$ 35 mil', min: 35_000, max: Infinity },
] as const

// --- Chaves de cada roteiro por faceta ------------------------------------

const monthKey = (t: TripCardData) => t.startDate?.slice(0, 7) ?? null
const guideKey = (g: { name: string }) => slugify(g.name)

function keysOf(t: TripCardData, key: ListKey): string[] {
  switch (key) {
    case 'regiao':
      return t.regions
    case 'pais':
      return t.countries.map(slugify)
    case 'mes': {
      const m = monthKey(t)
      return m ? [m] : []
    }
    case 'embarque':
      return t.departureCity ? [slugify(t.departureCity)] : []
    case 'duracao':
      return t.days ? DURATION_RANGES.filter((r) => t.days! >= r.min && t.days! <= r.max).map((r) => r.value) : []
    case 'acompanhante':
      return t.guides.map(guideKey)
    case 'preco': {
      const v = t.price?.totalBrl
      return v ? PRICE_RANGES.filter((r) => v >= r.min && v < r.max).map((r) => r.value) : []
    }
  }
}

// --- Busca ------------------------------------------------------------------

const terms = (q: string) => normalizeText(q).split(/\s+/).filter((w) => w.length > 1 || /\d/.test(w))

/** Pontuação de relevância; 0 = não corresponde a todos os termos. */
export function relevance(t: TripCardData, q: string): number {
  const words = terms(q)
  if (!words.length) return 1
  const fields: [string, number][] = [
    [normalizeText(t.title), 6],
    [normalizeText([...t.countries, ...t.cities].join(' ')), 4],
    [normalizeText(t.guides.map((g) => g.name).join(' ')), 4],
    [normalizeText(t.sanctuaries.join(' ')), 3],
    [normalizeText(t.departureCity ?? ''), 2],
    [t.searchText, 1],
  ]
  let score = 0
  for (const w of words) {
    const hit = fields.reduce((s, [text, weight]) => s + (text.includes(w) ? weight : 0), 0)
    if (!hit) return 0
    score += hit
  }
  return score
}

// --- Aplicação ---------------------------------------------------------------

function matches(t: TripCardData, state: FilterState, except?: ListKey | 'q'): boolean {
  if (except !== 'q' && state.q && relevance(t, state.q) === 0) return false
  for (const key of LIST_KEYS) {
    if (key === except) continue
    const selected = state[key]
    if (!selected.length) continue
    const own = keysOf(t, key)
    if (!selected.some((v) => own.includes(v))) return false
  }
  return true
}

const byDate = (a: TripCardData, b: TripCardData) => (a.startDate ?? '9999').localeCompare(b.startDate ?? '9999')

export function applyFilters(trips: TripCardData[], state: FilterState): TripCardData[] {
  const result = trips.filter((t) => matches(t, state))
  switch (state.ordem) {
    case 'relevancia':
      return result.sort(
        (a, b) =>
          relevance(b, state.q) - relevance(a, state.q) || Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder || byDate(a, b),
      )
    case 'duracao':
      return result.sort((a, b) => (a.days ?? 0) - (b.days ?? 0) || byDate(a, b))
    default:
      return result.sort(byDate)
  }
}

// --- Facetas --------------------------------------------------------------------

export type FacetOption = { value: string; label: string; count: number }
export type Facets = Record<ListKey, FacetOption[]> & { priceAvailable: boolean }

/** Opções de cada filtro com contagem considerando os demais filtros ativos. */
export function buildFacets(trips: TripCardData[], state: FilterState): Facets {
  const labels: Record<ListKey, Map<string, string>> = {
    regiao: new Map(REGIONS.map((r) => [r.value, r.label])),
    pais: new Map(),
    mes: new Map(),
    embarque: new Map(),
    duracao: new Map(DURATION_RANGES.map((r) => [r.value, r.label])),
    acompanhante: new Map(),
    preco: new Map(PRICE_RANGES.map((r) => [r.value, r.label])),
  }
  for (const t of trips) {
    t.countries.forEach((c) => labels.pais.set(slugify(c), c))
    const m = monthKey(t)
    if (m) labels.mes.set(m, formatMonthYear(m))
    if (t.departureCity) labels.embarque.set(slugify(t.departureCity), t.departureCity)
    t.guides.forEach((g) => labels.acompanhante.set(guideKey(g), `${g.name} · ${g.role}`))
  }

  const facets = {} as Facets
  for (const key of LIST_KEYS) {
    const pool = trips.filter((t) => matches(t, state, key))
    const counts = new Map<string, number>()
    for (const t of trips) for (const k of keysOf(t, key)) counts.set(k, counts.get(k) ?? 0)
    for (const t of pool) for (const k of keysOf(t, key)) counts.set(k, (counts.get(k) ?? 0) + 1)
    const options = [...counts.keys()].map((value) => ({
      value,
      label: labels[key].get(value) ?? (key === 'regiao' ? regionLabel(value) : value),
      count: counts.get(value) ?? 0,
    }))
    // Ordem natural: meses e durações cronológicos; regiões na ordem definida; demais alfabéticos.
    const order = key === 'regiao' ? REGIONS.map((r) => r.value as string) : key === 'duracao' ? DURATION_RANGES.map((r) => r.value as string) : key === 'preco' ? PRICE_RANGES.map((r) => r.value as string) : null
    options.sort((a, b) =>
      order ? order.indexOf(a.value) - order.indexOf(b.value) : key === 'mes' ? a.value.localeCompare(b.value) : a.label.localeCompare(b.label, 'pt-BR'),
    )
    facets[key] = options
  }
  // Preço só é filtrável com ao menos dois roteiros com valores aprovados em R$.
  facets.priceAvailable = trips.filter((t) => t.price?.totalBrl).length >= 2
  return facets
}

// --- URL ------------------------------------------------------------------------

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>

const getAll = (src: ParamSource, key: string): string[] => {
  if (src instanceof URLSearchParams) return src.getAll(key).flatMap((v) => v.split(',')).filter(Boolean)
  const v = src[key]
  return (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(',')).filter(Boolean)
}

export function parseFilters(src: ParamSource): FilterState {
  const q = getAll(src, 'q').join(' ').slice(0, 120)
  const ordemRaw = getAll(src, 'ordem')[0]
  const ordem: SortKey = ordemRaw === 'relevancia' || ordemRaw === 'duracao' || ordemRaw === 'data' ? ordemRaw : q ? 'relevancia' : 'data'
  const state: FilterState = { ...EMPTY_FILTERS, q, ordem }
  for (const key of LIST_KEYS) state[key] = [...new Set(getAll(src, key).map((v) => v.slice(0, 80)))].slice(0, 20)
  return state
}

export function serializeFilters(state: FilterState): string {
  const params = new URLSearchParams()
  if (state.q.trim()) params.set('q', state.q.trim())
  for (const key of LIST_KEYS) for (const v of state[key]) params.append(key, v)
  const defaultOrder: SortKey = state.q.trim() ? 'relevancia' : 'data'
  if (state.ordem !== defaultOrder) params.set('ordem', state.ordem)
  return params.toString()
}

export const activeFilterCount = (s: FilterState) => (s.q.trim() ? 1 : 0) + LIST_KEYS.reduce((n, k) => n + s[k].length, 0)

export const FILTER_LABELS: Record<ListKey, string> = {
  regiao: 'Região',
  pais: 'País',
  mes: 'Mês de saída',
  embarque: 'Cidade de embarque',
  duracao: 'Duração',
  acompanhante: 'Acompanhamento espiritual',
  preco: 'Faixa de preço',
}
export { LIST_KEYS }
export type { ListKey }
