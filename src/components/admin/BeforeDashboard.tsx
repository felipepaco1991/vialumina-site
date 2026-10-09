import type { Payload } from 'payload'

/** Resumo de pendências exibido no topo do painel. */
export async function BeforeDashboard({ payload }: { payload: Payload }) {
  const [published, drafts, withNotes, hiddenPrices, legacyLinks, newInquiries, failedEmails, newLeads, duplicateLeads] = await Promise.all([
    payload.count({ collection: 'trips', where: { status: { not_equals: 'rascunho' } } }),
    payload.count({ collection: 'trips', where: { status: { equals: 'rascunho' } } }),
    payload.count({ collection: 'trips', where: { 'reviewNotes.text': { exists: true } } }),
    payload.count({ collection: 'trips', where: { and: [{ status: { not_equals: 'rascunho' } }, { 'pricing.showPrices': { not_equals: true } }] } }),
    payload.count({ collection: 'trips', where: { and: [{ status: { not_equals: 'rascunho' } }, { linkTarget: { equals: 'legacy' } }] } }),
    payload.count({ collection: 'inquiries', where: { status: { equals: 'novo' } } }),
    payload.count({ collection: 'inquiries', where: { emailDelivery: { not_equals: 'enviado' } } }),
    payload.count({ collection: 'leads', where: { status: { equals: 'novo' } } }),
    payload.count({ collection: 'leads', where: { possibleDuplicate: { equals: true } } }),
  ])
  const smtp = Boolean(process.env.SMTP_HOST)

  const items: { label: string; value: number | string; href: string; tone?: 'warn' | 'ok' }[] = [
    { label: 'Peregrinações no site', value: published.totalDocs, href: '/admin/collections/trips?where[status][not_equals]=rascunho' },
    { label: 'Rascunhos / viagens pendentes de inclusão', value: drafts.totalDocs, href: '/admin/collections/trips?where[status][equals]=rascunho', tone: drafts.totalDocs ? 'warn' : 'ok' },
    { label: 'Roteiros com pendências de revisão', value: withNotes.totalDocs, href: '/admin/collections/trips', tone: withNotes.totalDocs ? 'warn' : 'ok' },
    { label: 'Valores ocultos (aguardando aprovação comercial)', value: hiddenPrices.totalDocs, href: '/admin/collections/trips', tone: hiddenPrices.totalDocs ? 'warn' : 'ok' },
    { label: 'Botões apontando para o site antigo', value: legacyLinks.totalDocs, href: '/admin/collections/trips', tone: legacyLinks.totalDocs ? 'warn' : 'ok' },
    { label: 'Solicitações novas', value: newInquiries.totalDocs, href: '/admin/collections/inquiries?where[status][equals]=novo', tone: newInquiries.totalDocs ? 'warn' : 'ok' },
    { label: 'Cadastros novos (padres, agências, peregrinos)', value: newLeads.totalDocs, href: '/admin/cadastros', tone: newLeads.totalDocs ? 'warn' : 'ok' },
    { label: 'Cadastros com possível duplicidade', value: duplicateLeads.totalDocs, href: '/admin/cadastros?dup=1', tone: duplicateLeads.totalDocs ? 'warn' : 'ok' },
  ]

  return (
    <section style={{ marginBottom: 'calc(var(--base) * 2)' }}>
      <h2 style={{ marginBottom: 'var(--base)' }}>Via Lumina · Pendências</h2>
      {!smtp ? (
        <p style={{ padding: 'calc(var(--base) * 0.75)', borderRadius: 8, background: 'var(--theme-warning-100)', color: 'var(--theme-warning-900)', marginBottom: 'var(--base)' }}>
          <strong>Envio de e-mail não configurado.</strong> As mensagens do formulário estão sendo salvas em “Solicitações de contato”, mas não geram notificação por e-mail
          ({failedEmails.totalDocs} sem envio). Configure as variáveis SMTP_* e CONTACT_RECIPIENTS.
        </p>
      ) : null}
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'calc(var(--base) * 0.75)', listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((i) => (
          <li key={i.label}>
            <a
              href={i.href}
              style={{
                display: 'block',
                padding: 'var(--base)',
                borderRadius: 10,
                textDecoration: 'none',
                border: `1px solid ${i.tone === 'warn' ? 'var(--theme-warning-500)' : 'var(--theme-elevation-150)'}`,
                background: 'var(--theme-elevation-0)',
              }}
            >
              <span style={{ display: 'block', fontSize: 28, fontWeight: 700, color: 'var(--theme-text)' }}>{i.value}</span>
              <span style={{ color: 'var(--theme-elevation-700)' }}>{i.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
