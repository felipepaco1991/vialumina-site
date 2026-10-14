import type { Payload } from 'payload'
import type { Lead, PriestProfile, AgencyProfile, LeaderProfile, PilgrimProfile } from '@/payload-types'
import { destinationLabel, leadStatusLabel, leadTypeLabel, partnershipLabel, periodLabel, PRIEST_INTERESTS, AGENCY_PROFILES, AGENCY_INTERESTS, LEADER_ROLES, LEADER_REACH } from './constants'
import { toCsv } from './csv'
import { formatStoredPhone } from './masks'
import { buildLeadsWhere, type LeadFilters } from './query'

const label = (list: readonly { value: string; label: string }[], v?: string | null) => list.find((o) => o.value === v)?.label ?? v ?? ''
const dt = (v?: string | null) => (v ? new Date(v).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '')

/** CSV dos cadastros que atendem aos filtros (dados do perfil incluídos). Registra apenas contagem no log. */
export async function exportLeadsCsv(payload: Payload, filters: LeadFilters, userId: number | string): Promise<{ csv: string; count: number }> {
  const { docs } = await payload.find({ collection: 'leads', where: buildLeadsWhere(filters), depth: 1, limit: 5000, pagination: false, sort: '-createdAt', overrideAccess: true })
  const leads = docs as Lead[]
  const profileKind = filters.tab

  const base = ['Perfil', 'Nome', 'E-mail', 'WhatsApp', 'Cidade', 'UF', 'Destinos de interesse', 'Origem', 'Ponto de entrada', 'utm_source', 'utm_medium', 'utm_campaign', 'Status do atendimento', 'Aprovação da parceria', 'Responsável', 'Possível duplicidade', 'Consentimento promocional', 'Cadastrado em', 'Atualizado em']
  const extraHeaders = {
    PADRE: ['Nome de identificação', 'Diocese', 'Paróquia/comunidade', 'Função', 'Interesse principal', 'Já organizou peregrinação', 'Pessoas interessadas', 'Período previsto', 'Mensagem'],
    AGENCIA: ['Razão social', 'Nome fantasia', 'CNPJ', 'Cargo', 'Perfil de atuação', 'Interesse', 'Cadastur', 'Site', 'Instagram', 'Tempo de atuação', 'Já trabalha com turismo religioso', 'Volume', 'Mensagem'],
    FORMADOR: ['Igreja/comunidade/movimento', 'Como atua', 'Função ou ministério', 'Instagram', 'Pessoas que alcança', 'Já organizou grupos', 'Já conta com assessor espiritual', 'Pessoas interessadas', 'Período previsto', 'Mensagem'],
    PEREGRINO: ['Quando pretende viajar', 'Embarque', 'Pessoas', 'Já fez peregrinação', 'Viajar com grupo da comunidade', 'Mensagem'],
  }[profileKind]

  const rows = leads.map((l) => {
    const assignee = typeof l.assignee === 'object' && l.assignee ? (l.assignee.name ?? l.assignee.email) : ''
    const head = [
      leadTypeLabel(l.type), l.name, l.email, formatStoredPhone(l.phone), l.city ?? '', l.state ?? '', (l.destinations ?? []).map(destinationLabel).join('; '),
      l.source, l.entryPoint ?? '', l.utm?.source ?? '', l.utm?.medium ?? '', l.utm?.campaign ?? '', leadStatusLabel(l.status),
      l.type === 'PEREGRINO' ? '' : partnershipLabel(l.partnershipStatus ?? ''), assignee, l.possibleDuplicate ? 'Sim' : 'Não', l.marketingConsent ? 'Sim' : 'Não', dt(l.createdAt), dt(l.updatedAt),
    ]
    const yn = (v?: string | null) => (v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : '')
    if (l.type === 'PADRE') {
      const p = l.priestProfile as PriestProfile | null | undefined
      const o = typeof p === 'object' && p ? p : ({} as Partial<PriestProfile>)
      return [...head, o.displayName ?? '', o.diocese ?? '', o.parish ?? '', o.ministry ?? '', label(PRIEST_INTERESTS, o.mainInterest), yn(o.hasOrganized), o.groupSize ?? '', o.travelPeriod ? periodLabel(o.travelPeriod) : '', o.message ?? '']
    }
    if (l.type === 'AGENCIA') {
      const a = l.agencyProfile as AgencyProfile | null | undefined
      const o = typeof a === 'object' && a ? a : ({} as Partial<AgencyProfile>)
      return [...head, o.legalName ?? '', o.tradeName ?? '', o.cnpj ?? '', o.contactRole ?? '', label(AGENCY_PROFILES, o.profile), label(AGENCY_INTERESTS, o.interest), o.cadastur ?? '', o.website ?? '', o.instagram ?? '', o.tenure ?? '', yn(o.worksWithReligious), o.volume ?? '', o.message ?? '']
    }
    if (l.type === 'FORMADOR') {
      const f = l.leaderProfile as LeaderProfile | null | undefined
      const o = typeof f === 'object' && f ? f : ({} as Partial<LeaderProfile>)
      return [...head, o.community ?? '', label(LEADER_ROLES, o.role), o.roleDetail ?? '', o.instagram ?? '', label(LEADER_REACH, o.reach), yn(o.hasOrganized), yn(o.hasSpiritualGuide), o.groupSize ?? '', o.travelPeriod ? periodLabel(o.travelPeriod) : '', o.message ?? '']
    }
    const g = l.pilgrimProfile as PilgrimProfile | null | undefined
    const o = typeof g === 'object' && g ? g : ({} as Partial<PilgrimProfile>)
    return [...head, o.travelPeriod ? periodLabel(o.travelPeriod) : '', o.boardingCity ?? '', o.partySize ?? '', yn(o.previousPilgrimage), o.groupWithCommunity ?? '', o.message ?? '']
  })

  payload.logger.info(`Exportação de cadastros ${profileKind}: ${rows.length} registro(s) por usuário ${userId}.`)
  return { csv: toCsv([...base, ...extraHeaders], rows), count: rows.length }
}
