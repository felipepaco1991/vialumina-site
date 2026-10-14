import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  DESTINATIONS,
  LEAD_STATUS,
  LEAD_TYPES,
  PARTNERSHIP_STATUS,
  UF_LIST,
  destinationLabel,
  leadStatusLabel,
  partnershipLabel,
} from '@/lib/leads/constants'
import { formatStoredPhone } from '@/lib/leads/masks'
import { buildLeadsWhere, filtersToParams, parseLeadFilters } from '@/lib/leads/query'
import type { Lead } from '@/payload-types'

const PAGE_SIZE = 25

const box = { border: '1px solid var(--theme-elevation-150)', borderRadius: 8, background: 'var(--theme-elevation-0)' } as const
const input = { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '8px 10px', border: '1px solid var(--theme-elevation-250)', borderRadius: 6, background: 'var(--theme-input-bg, var(--theme-elevation-0))', color: 'var(--theme-text)', minHeight: 38 } as const
const th = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--theme-elevation-150)', color: 'var(--theme-elevation-600)', fontWeight: 600, whiteSpace: 'nowrap' } as const
const td = { padding: '10px 12px', borderBottom: '1px solid var(--theme-elevation-100)', verticalAlign: 'top' } as const

const badge = (text: string, tone: 'new' | 'warn' | 'ok' | 'muted') => (
  <span
    style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
      background: tone === 'new' ? 'var(--theme-success-100)' : tone === 'warn' ? 'var(--theme-warning-100)' : tone === 'ok' ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
      color: tone === 'new' ? 'var(--theme-success-800)' : tone === 'warn' ? 'var(--theme-warning-900)' : 'var(--theme-elevation-800)',
    }}
  >
    {text}
  </span>
)

/** Tela "Cadastros e Parcerias": abas por perfil, busca, filtros, exportação e acesso ao detalhe de cada registro. */
export async function LeadsView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  // Visões customizadas do Payload são públicas por padrão: exige login aqui.
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fcadastros')
  const roles = (req.user?.roles as string[] | undefined) ?? []
  if (!req.user || !roles.some((r) => r === 'admin' || r === 'comercial')) {
    return (
      <div style={{ padding: 'var(--base)' }}>
        <h1>Cadastros e Parcerias</h1>
        <p>Seu perfil não tem acesso a esta área. Peça a um administrador para incluir o perfil “Equipe comercial”.</p>
      </div>
    )
  }

  const f = parseLeadFilters(searchParams ?? {})
  const payload = req.payload
  const where = buildLeadsWhere(f)

  const [result, ...counts] = await Promise.all([
    payload.find({ collection: 'leads', where, depth: 1, limit: PAGE_SIZE, page: f.page, sort: '-createdAt', overrideAccess: true }),
    ...LEAD_TYPES.flatMap((t) => [
      payload.count({ collection: 'leads', overrideAccess: true, where: { and: [{ type: { equals: t.value } }, { anonymizedAt: { exists: false } }] } }),
      payload.count({ collection: 'leads', overrideAccess: true, where: { and: [{ type: { equals: t.value } }, { status: { equals: 'novo' } }, { anonymizedAt: { exists: false } }] } }),
    ]),
  ])
  const leads = result.docs as Lead[]
  const showPartnership = f.tab !== 'PEREGRINO'
  const activeTab = LEAD_TYPES.find((t) => t.value === f.tab)!
  const exportQs = filtersToParams({ ...f, page: 1 })

  return (
    <div style={{ padding: 'calc(var(--base) * 1) calc(var(--base) * 1.25)' }}>
      <header style={{ marginBottom: 'var(--base)' }}>
        <h1 style={{ margin: 0 }}>Cadastros e Parcerias</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-600)' }}>Padres, agências e peregrinos que se cadastraram pelas landing pages. Dados pessoais: use somente para o atendimento.</p>
      </header>

      <nav aria-label="Perfis" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--base)' }}>
        {LEAD_TYPES.map((t, i) => {
          const total = counts[i * 2]?.totalDocs ?? 0
          const news = counts[i * 2 + 1]?.totalDocs ?? 0
          const active = t.value === f.tab
          return (
            <Link
              key={t.value}
              href={`/admin/cadastros?tab=${t.value}`}
              aria-current={active ? 'page' : undefined}
              style={{
                padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8,
                border: `1px solid ${active ? 'var(--theme-text)' : 'var(--theme-elevation-150)'}`,
                background: active ? 'var(--theme-text)' : 'var(--theme-elevation-0)',
                color: active ? 'var(--theme-bg)' : 'var(--theme-text)',
              }}
            >
              {t.plural} <span style={{ opacity: 0.75, fontWeight: 400 }}>{total}</span>
              {news ? <span style={{ background: 'var(--theme-success-500)', color: '#fff', borderRadius: 999, padding: '0 8px', fontSize: 12 }}>{news} novo{news > 1 ? 's' : ''}</span> : null}
            </Link>
          )
        })}
      </nav>

      <form method="get" action="/admin/cadastros" style={{ ...box, padding: 'var(--base)', marginBottom: 'var(--base)', display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', alignItems: 'end' }}>
        <input type="hidden" name="tab" value={f.tab} />
        <label style={{ display: 'grid', gap: 4 }}>Buscar (nome, e-mail, cidade)<input name="q" defaultValue={f.q} style={input} /></label>
        <label style={{ display: 'grid', gap: 4 }}>Estado
          <select name="state" defaultValue={f.state} style={input}><option value="">Todos</option>{UF_LIST.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}</select>
        </label>
        <label style={{ display: 'grid', gap: 4 }}>Status do atendimento
          <select name="status" defaultValue={f.status} style={input}><option value="">Todos</option>{LEAD_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </label>
        {showPartnership ? (
          <label style={{ display: 'grid', gap: 4 }}>Aprovação da parceria
            <select name="partnership" defaultValue={f.partnership} style={input}><option value="">Todas</option>{PARTNERSHIP_STATUS.filter((s) => s.value !== 'nao-se-aplica').map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          </label>
        ) : null}
        <label style={{ display: 'grid', gap: 4 }}>Destino de interesse
          <select name="destination" defaultValue={f.destination} style={input}><option value="">Todos</option>{DESTINATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
        </label>
        <label style={{ display: 'grid', gap: 4 }}>Cadastrado de<input type="date" name="from" defaultValue={f.from} style={input} /></label>
        <label style={{ display: 'grid', gap: 4 }}>até<input type="date" name="to" defaultValue={f.to} style={input} /></label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 38 }}><input type="checkbox" name="new" value="1" defaultChecked={f.onlyNew} /> Somente novos</label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 38 }}><input type="checkbox" name="dup" value="1" defaultChecked={f.onlyDuplicates} /> Possíveis duplicidades</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ ...input, cursor: 'pointer', fontWeight: 600, background: 'var(--theme-text)', color: 'var(--theme-bg)' }}>Filtrar</button>
          <Link href={`/admin/cadastros?tab=${f.tab}`} style={{ ...input, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'var(--theme-text)' }}>Limpar</Link>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        <p style={{ margin: 0 }}><strong>{result.totalDocs}</strong> {result.totalDocs === 1 ? 'registro' : 'registros'} em {activeTab.plural.toLowerCase()}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={`/api/leads/export?${exportQs}`} style={{ ...input, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'var(--theme-text)', fontWeight: 600 }}>Exportar CSV (filtro atual)</a>
          <a href={`/api/leads/export?${exportQs}&marketing=1`} title="Somente quem aceitou receber comunicações promocionais" style={{ ...input, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'var(--theme-text)' }}>CSV só com consentimento promocional</a>
        </div>
      </div>

      <div style={{ ...box, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              <th style={th}>Nome</th>
              <th style={th}>Local</th>
              <th style={th}>{f.tab === 'PADRE' ? 'Paróquia / diocese' : f.tab === 'AGENCIA' ? 'Agência' : 'Destinos'}</th>
              <th style={th}>Origem</th>
              <th style={th}>Atendimento</th>
              {showPartnership ? <th style={th}>Parceria</th> : null}
              <th style={th}>Responsável</th>
              <th style={th}>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const priest = typeof l.priestProfile === 'object' ? l.priestProfile : null
              const agency = typeof l.agencyProfile === 'object' ? l.agencyProfile : null
              const assignee = typeof l.assignee === 'object' && l.assignee ? (l.assignee.name ?? l.assignee.email) : '—'
              const detail =
                f.tab === 'PADRE' ? [priest?.parish, priest?.diocese].filter(Boolean).join(' · ') : f.tab === 'AGENCIA' ? [agency?.tradeName, agency?.cnpj ? `CNPJ ${agency.cnpj}` : null].filter(Boolean).join(' · ') : (l.destinations ?? []).map(destinationLabel).join(', ')
              return (
                <tr key={l.id} style={l.status === 'novo' ? { background: 'var(--theme-success-50)' } : undefined}>
                  <td style={td}>
                    <Link href={`/admin/collections/leads/${l.id}`} style={{ fontWeight: 600 }}>{l.name}</Link>
                    <div style={{ color: 'var(--theme-elevation-600)', fontSize: 13 }}>{l.email}<br />{formatStoredPhone(l.phone)}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {l.status === 'novo' ? badge('Novo', 'new') : null}
                      {l.possibleDuplicate ? badge('Possível duplicidade', 'warn') : null}
                      {l.marketingConsent ? badge('Aceita novidades', 'ok') : null}
                    </div>
                  </td>
                  <td style={td}>{[l.city, l.state].filter(Boolean).join('/')}</td>
                  <td style={td}>{detail || '—'}</td>
                  <td style={td}>
                    {l.source}
                    {l.utm?.campaign ? <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)' }}>campanha: {l.utm.campaign}</div> : null}
                    {l.entryPoint ? <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)' }}>entrada: {l.entryPoint}</div> : null}
                  </td>
                  <td style={td}>{badge(leadStatusLabel(l.status), l.status === 'novo' ? 'new' : 'ok')}</td>
                  {showPartnership ? <td style={td}>{badge(partnershipLabel(l.partnershipStatus ?? 'pendente'), l.partnershipStatus === 'aprovada' ? 'new' : 'muted')}</td> : null}
                  <td style={td}>{assignee}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })}</td>
                </tr>
              )
            })}
            {leads.length === 0 ? (
              <tr><td colSpan={showPartnership ? 8 : 7} style={{ ...td, textAlign: 'center', padding: 'calc(var(--base) * 2)' }}>Nenhum cadastro encontrado com estes filtros.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 ? (
        <nav aria-label="Paginação" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginTop: 'var(--base)' }}>
          {result.hasPrevPage ? <Link href={`/admin/cadastros?${filtersToParams(f, { page: String(f.page - 1) })}`}>← Anterior</Link> : null}
          <span>Página {result.page} de {result.totalPages}</span>
          {result.hasNextPage ? <Link href={`/admin/cadastros?${filtersToParams(f, { page: String(f.page + 1) })}`}>Próxima →</Link> : null}
        </nav>
      ) : null}
    </div>
  )
}
