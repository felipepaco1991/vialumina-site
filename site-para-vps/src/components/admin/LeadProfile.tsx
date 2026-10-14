import type { UIFieldServerProps } from 'payload'
import {
  AGENCY_INTERESTS,
  AGENCY_PROFILES,
  AGENCY_TENURE,
  AGENCY_VOLUME,
  GROUP_INTENT,
  PARTY_SIZES,
  PRIEST_GROUP_SIZES,
  PRIEST_INTERESTS,
  destinationLabel,
  periodLabel,
} from '@/lib/leads/constants'
import { maskCnpj } from '@/lib/leads/masks'

const lab = (list: readonly { value: string; label: string }[], v?: string | null) => list.find((o) => o.value === v)?.label ?? v ?? '—'
const yn = (v?: string | null) => (v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : '—')

type Row = [string, string | null | undefined]

/** Dados do formulário (perfil relacionado), exibidos em leitura dentro do cadastro. */
export async function LeadProfile({ payload, id }: UIFieldServerProps) {
  if (!id) return null
  const lead = await payload.findByID({ collection: 'leads', id, depth: 1, overrideAccess: true })
  let rows: Row[] = []

  if (lead.type === 'PADRE' && typeof lead.priestProfile === 'object' && lead.priestProfile) {
    const p = lead.priestProfile
    rows = [
      ['Nome de identificação', p.displayName], ['Diocese', p.diocese], ['Paróquia ou comunidade', p.parish], ['Função ou ministério', p.ministry],
      ['Interesse principal', lab(PRIEST_INTERESTS, p.mainInterest)], ['Já organizou ou acompanhou peregrinações', yn(p.hasOrganized)], ['Pessoas interessadas', lab(PRIEST_GROUP_SIZES, p.groupSize)],
      ['Destinos de interesse', (p.destinations ?? []).map(destinationLabel).join('; ') || '—'], ['Período previsto', p.travelPeriod ? periodLabel(p.travelPeriod) : '—'], ['Mensagem', p.message],
    ]
  } else if (lead.type === 'AGENCIA' && typeof lead.agencyProfile === 'object' && lead.agencyProfile) {
    const a = lead.agencyProfile
    rows = [
      ['Razão social', a.legalName], ['Nome fantasia', a.tradeName], ['CNPJ', a.cnpj ? maskCnpj(a.cnpj) : '—'], ['Verificação do CNPJ', a.cnpjVerification === 'verificado' ? 'Verificado' : a.cnpjVerification === 'divergente' ? 'Divergente' : 'Não verificado'],
      ['Cargo ou função', a.contactRole], ['Perfil de atuação', lab(AGENCY_PROFILES, a.profile)], ['Interesse', lab(AGENCY_INTERESTS, a.interest)], ['Cadastur', a.cadastur],
      ['Verificação do Cadastur', a.cadasturVerification === 'verificado' ? 'Verificado' : a.cadasturVerification === 'divergente' ? 'Divergente' : 'Não verificado'],
      ['Site', a.website], ['Instagram', a.instagram], ['Tempo de atuação', lab(AGENCY_TENURE, a.tenure)], ['Trabalha com turismo religioso', yn(a.worksWithReligious)], ['Volume', lab(AGENCY_VOLUME, a.volume)],
      ['Destinos de interesse', (a.destinations ?? []).map(destinationLabel).join('; ') || '—'], ['Mensagem', a.message],
    ]
  } else if (lead.type === 'PEREGRINO' && typeof lead.pilgrimProfile === 'object' && lead.pilgrimProfile) {
    const g = lead.pilgrimProfile
    rows = [
      ['Destinos de interesse', (g.destinations ?? []).map(destinationLabel).join('; ') || '—'], ['Quando pretende viajar', g.travelPeriod ? periodLabel(g.travelPeriod) : '—'], ['Embarque', g.boardingCity],
      ['Pessoas na viagem', lab(PARTY_SIZES, g.partySize)], ['Já participou de peregrinação', yn(g.previousPilgrimage)], ['Viajar com grupo da comunidade', lab(GROUP_INTENT, g.groupWithCommunity)], ['Mensagem', g.message],
    ]
  }

  return (
    <section style={{ marginBottom: 'calc(var(--base) * 1.5)' }}>
      <h3 style={{ marginBottom: 'calc(var(--base) * 0.5)' }}>Dados do formulário</h3>
      <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: '6px 16px', margin: 0, padding: 'var(--base)', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <dt style={{ color: 'var(--theme-elevation-600)' }}>{k}</dt>
            <dd style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{v || '—'}</dd>
          </div>
        ))}
        {rows.length === 0 ? <p style={{ gridColumn: '1 / -1', margin: 0 }}>Sem dados de perfil.</p> : null}
      </dl>
    </section>
  )
}
