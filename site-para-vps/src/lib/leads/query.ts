import type { Where } from 'payload'
import { LEAD_STATUS, LEAD_TYPES, PARTNERSHIP_STATUS, UF_VALUES, DESTINATION_VALUES, type LeadType } from './constants'

/** Filtros do painel "Cadastros e Parcerias" (e da exportação), lidos da query string e validados por lista permitida. */
export type LeadFilters = {
  tab: LeadType
  q: string
  state: string
  status: string
  partnership: string
  destination: string
  from: string
  to: string
  onlyNew: boolean
  onlyDuplicates: boolean
  /** Exportação: somente quem consentiu com comunicações promocionais. */
  marketingOnly: boolean
  page: number
}

type Raw = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
const inList = (v: string, list: readonly string[]) => (list.includes(v) ? v : '')
const isoDate = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) ? v : '')

export function parseLeadFilters(raw: Raw): LeadFilters {
  return {
    tab: (inList(one(raw.tab), LEAD_TYPES.map((t) => t.value)) || 'PADRE') as LeadType,
    q: one(raw.q).trim().slice(0, 100),
    state: inList(one(raw.state), UF_VALUES),
    status: inList(one(raw.status), LEAD_STATUS.map((s) => s.value)),
    partnership: inList(one(raw.partnership), PARTNERSHIP_STATUS.map((s) => s.value)),
    destination: inList(one(raw.destination), DESTINATION_VALUES),
    from: isoDate(one(raw.from)),
    to: isoDate(one(raw.to)),
    onlyNew: one(raw.new) === '1',
    onlyDuplicates: one(raw.dup) === '1',
    marketingOnly: one(raw.marketing) === '1',
    page: Math.max(1, Math.min(500, Number(one(raw.page)) || 1)),
  }
}

export function buildLeadsWhere(f: LeadFilters): Where {
  const and: Where[] = [{ type: { equals: f.tab } }, { anonymizedAt: { exists: false } }]
  if (f.q) and.push({ or: [{ name: { like: f.q } }, { email: { like: f.q } }, { city: { like: f.q } }] })
  if (f.state) and.push({ state: { equals: f.state } })
  if (f.status) and.push({ status: { equals: f.status } })
  if (f.partnership) and.push({ partnershipStatus: { equals: f.partnership } })
  if (f.destination) and.push({ destinations: { in: [f.destination] } })
  if (f.from) and.push({ createdAt: { greater_than_equal: `${f.from}T00:00:00.000-03:00` } })
  if (f.to) and.push({ createdAt: { less_than_equal: `${f.to}T23:59:59.999-03:00` } })
  if (f.onlyNew) and.push({ status: { equals: 'novo' } })
  if (f.onlyDuplicates) and.push({ possibleDuplicate: { equals: true } })
  if (f.marketingOnly) and.push({ marketingConsent: { equals: true } })
  return { and }
}

/** Reaproveita os filtros na URL (abas, paginação, exportação). */
export function filtersToParams(f: LeadFilters, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams({ tab: f.tab })
  if (f.q) p.set('q', f.q)
  if (f.state) p.set('state', f.state)
  if (f.status) p.set('status', f.status)
  if (f.partnership) p.set('partnership', f.partnership)
  if (f.destination) p.set('destination', f.destination)
  if (f.from) p.set('from', f.from)
  if (f.to) p.set('to', f.to)
  if (f.onlyNew) p.set('new', '1')
  if (f.onlyDuplicates) p.set('dup', '1')
  if (f.marketingOnly) p.set('marketing', '1')
  for (const [k, v] of Object.entries(extra)) p.set(k, v)
  return p.toString()
}
