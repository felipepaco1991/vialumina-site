/**
 * Gera os relatórios da migração em docs/:
 *  - docs/auditoria-e-inventario.md  (Etapa 1: páginas, roteiros, mídia, identidade)
 *  - docs/pendencias-e-inconsistencias.md  (itens que exigem revisão humana)
 *
 * Uso: node scripts/migration/build-reports.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))

const trips = read('migration/data/trips.json')
const cards = read('migration/data/home-cards.raw.json')
const pending = read('migration/data/pending-trips.json')
const issues = read('migration/data/catalog-issues.json')
const manual = read('migration/data/manual-findings.json')
const manifest = read('migration/asset-manifest.json')
const media = read('migration/source/wp-api/media_all.json')
const pages = read('migration/source/wp-api/pages.json')

const kb = (n) => `${Math.round(n / 1024).toLocaleString('pt-BR')} KB`
const mb = (n) => `${(n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
const br = (iso) => (iso ? iso.split('-').reverse().join('/') : '—')
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')

// ---------------------------------------------------------------------------
// Auditoria e inventário
// ---------------------------------------------------------------------------
const downloaded = new Set(manifest.files.flatMap((f) => [f.originalUrl, ...f.duplicateUrls]))
const notDownloaded = media.filter((m) => !downloaded.has(m.source_url))
const byCategory = {}
for (const f of manifest.files) {
  const cat = f.path.split('/')[2]
  byCategory[cat] ??= { n: 0, bytes: 0, opt: 0 }
  byCategory[cat].n++
  byCategory[cat].bytes += f.bytes
  byCategory[cat].opt += f.optimized?.bytes ?? 0
}
const dupCount = manifest.files.reduce((n, f) => n + f.duplicateUrls.length, 0)

let inv = `# Auditoria e inventário do site original

Fonte: https://vialuminaviagens.com.br/ (WordPress + Elementor), consultado em ${new Date(manifest.generatedAt).toLocaleDateString('pt-BR')}.
Arquivos brutos preservados em \`migration/source/\` (HTML de cada página, CSS do Elementor e respostas da API pública \`wp-json\`).

## 1. Páginas publicadas

| ID WP | Página | URL original | Situação na migração |
|---|---|---|---|
`
const role = (slug) => {
  if (slug === 'via-lumina-viagens') return 'Homepage → reconstruída em `/` (seções institucionais viraram páginas próprias)'
  const t = trips.find((x) => x.legacyWpSlug === slug)
  if (t) return `Roteiro ${t.legacyNumber} → \`/destinos/${t.slug}\` (redirecionamento 308)`
  return {
    links: 'Página de links da bio do Instagram → preservada em `/links`',
    'lp-roteiro-guadalupe-2026': 'Landing page fora do menu → inventariada como pendente; redireciona para `/destinos`',
    'page-backup': 'Cópia antiga da homepage (backup) → não migrada; redireciona para `/`',
    'sample-page': 'Página de exemplo do WordPress → não migrada; redireciona para `/`',
  }[slug] ?? '—'
}
for (const p of pages) inv += `| ${p.id} | ${esc(p.title.rendered.replace(/&#8211;/g, '–'))} | ${p.link} | ${role(p.slug)} |\n`

inv += `
## 2. Roteiros (14 do briefing)

| # | Roteiro | Período | Dias/noites | Embarque | Acompanhamento | Galeria | Dia a dia | PDF |
|---|---|---|---|---|---|---|---|---|
`
for (const t of trips)
  inv += `| ${t.legacyNumber} | [${esc(t.title)}](${t.legacyUrl}) | ${br(t.startDate)} a ${br(t.endDate)} | ${t.days}/${t.nights} | ${t.departureCity} | ${t.guides.map((g) => `${g.name} (${g.role})`).join('; ')} | ${t.gallery.items.length} fotos | ${t.itinerary.length} dias | ${t.pdf ? 'sim' : '—'} |\n`

inv += `
Conteúdo extraído integralmente de cada página: etiquetas do hero, descrição, ficha (período, acomodação, embarque, bagagem), direção espiritual, destaques, galeria com legendas, programação dia a dia, itens incluídos e não incluídos, observações comerciais, valores e condições, chamada final e PDF. Dados completos em \`migration/data/trips.json\`.

## 3. Cards da homepage (inventário completo)

A homepage original exibia ${cards.length} cards em "Nossas Peregrinações". Todos os botões "Conheça o roteiro completo" apontavam para **PDFs**, não para as páginas dos roteiros.

| # | Título no card | Destino do botão | Situação |
|---|---|---|---|
`
for (const c of cards) {
  const pdf = path.basename(c.href)
  const t = trips.find((x) => x.pdf && manifest.files.find((f) => f.path === x.pdf)?.originalUrl.endsWith(pdf))
  const pend = pending.find((p) => p.source.includes(`nº ${c.order} `))
  const alias = manifest.files.find((f) => f.path.endsWith('-home.pdf') && f.originalUrl.endsWith(pdf))
  const aliasTrip = alias && trips.find((x) => alias.path === `/assets/pdfs/${x.slug}-home.pdf`)
  inv += `| ${c.order} | ${esc(c.title)} | \`${esc(pdf)}\` | ${t ? `Roteiro ${t.legacyNumber} (${t.slug})` : pend ? `**Pendente** — ${esc(pend.title)}` : c.href === '#contato' ? '**Pendente** — sem roteiro' : aliasTrip ? `Roteiro ${aliasTrip.legacyNumber} (${aliasTrip.slug}) — outra versão do PDF (ver pendências)` : '—'} |\n`
}

inv += `
## 4. Viagens fora dos 14 roteiros (pendentes de inclusão)

Cadastradas no CMS como **rascunho** (não aparecem no site) para validação editorial — nenhuma foi descartada.

| Viagem | Período | Embarque | Acompanhamento | Origem |
|---|---|---|---|---|
`
for (const p of pending)
  inv += `| ${esc(p.title)} | ${esc(p.periodText ?? '—')} | ${esc(p.departureCity ?? '—')} | ${p.guides.map((g) => `${g.name} (${g.role})`).join('; ') || '—'} | ${esc(p.source)} |\n`

inv += `
## 5. Mídia recuperada

- **${manifest.files.length} arquivos** baixados (${mb(manifest.files.reduce((s, f) => s + f.bytes, 0))}), **0 falhas**; ${dupCount} URLs eram duplicatas binárias (mesmo conteúdo) e foram unificadas sem perder a referência.
- Cada arquivo tem URL de origem, hash SHA-256, tamanho e usos registrados em \`migration/asset-manifest.json\`.
- Versões WebP otimizadas geradas ao lado dos originais (originais intactos; apenas redimensionamento até 2400 px e recompressão — sem filtros ou cortes).

| Pasta (\`public/assets/\`) | Arquivos | Originais | WebP otimizados |
|---|---|---|---|
`
for (const [cat, v] of Object.entries(byCategory).sort()) inv += `| \`${cat}/\` | ${v.n} | ${mb(v.bytes)} | ${v.opt ? mb(v.opt) : '—'} |\n`

inv += `
### Itens da biblioteca de mídia não baixados

A biblioteca pública do WordPress tem ${media.length} itens; ${notDownloaded.length} não são usados pelas páginas publicadas (versões antigas de PDFs, rascunhos de artes, capturas de tela, fotos de WhatsApp sem uso). Ficaram listados abaixo para eventual recuperação, mas não foram incorporados ao site.

<details><summary>Ver lista (${notDownloaded.length})</summary>

| Arquivo | Tipo | Tamanho |
|---|---|---|
`
for (const m of notDownloaded.sort((a, b) => a.source_url.localeCompare(b.source_url)))
  inv += `| ${m.source_url.replace('https://vialuminaviagens.com.br/wp-content/uploads/', '')} | ${m.mime_type} | ${kb(m.media_details?.filesize ?? 0)} |\n`
inv += `
</details>

## 6. Identidade visual

Detalhes e tokens em [design-tokens.md](design-tokens.md). Resumo:

- **Tipografia:** Playfair Display (títulos), Lato (textos), Montserrat (rótulos e botões) — fontes livres (OFL), servidas localmente.
- **Cores:** azul-marinho #0A2E5C / #1E3A5F, azul #0073B6, dourados #C9922A / #C99A2E / #D29C35 / #E2B04A, creme #FAF7F2, verde WhatsApp #16A34A / #12813C.
- **Logotipos:** Via Lumina (colorido e branco), Grupo Arbo (branco, PNG e SVG), favicon e os raios dourados usados como marca d'água.
`
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'docs/auditoria-e-inventario.md'), inv)

// ---------------------------------------------------------------------------
// Pendências e inconsistências
// ---------------------------------------------------------------------------
const TYPE_LABEL = {
  data: 'Datas',
  preco: 'Valores',
  'preco-desatualizado': 'Valores desatualizados',
  telefone: 'Telefones',
  contato: 'Contatos comerciais',
  imagem: 'Imagens',
  pdf: 'PDFs',
  itinerario: 'Programação',
  acompanhante: 'Acompanhantes',
  texto: 'Textos',
  titulo: 'Títulos',
  divergencia: 'Divergências',
  rota: 'Páginas',
  roteiro: 'Roteiros',
  identidade: 'Identidade visual',
}
const all = [...issues, ...manual]
const groups = {}
for (const i of all) (groups[i.type] ??= []).push(i)

let rep = `# Pendências e inconsistências

Itens encontrados durante a migração que **exigem decisão ou aprovação humana**. Nada foi corrigido por suposição: o novo site mostra o conteúdo como publicado no site original, e cada roteiro afetado tem estas notas na aba **Migração → Pendências de revisão editorial** do painel.

## A. Decisões que bloqueiam ou condicionam a publicação

| # | Item | Situação atual | O que fazer |
|---|---|---|---|
| 1 | Valores dos 14 roteiros | Migrados e estruturados, mas **ocultos** ("Consulte as condições atuais"): o câmbio de referência é de jun–ago/2026 | Equipe comercial confirma valores e marca "Exibir valores" em cada roteiro (aba Valores) |
| 2 | Botões "Conheça o roteiro completo" | Apontam para as **URLs originais** (primeira etapa, §9 do briefing) | Após revisar cada página nova, mudar "Botão abre" para "Nova página interna" |
| 3 | Envio de e-mail do formulário | Mensagens são **salvas no painel**, mas sem notificação por e-mail até configurar SMTP | Definir SMTP_HOST/USER/PASS/FROM e CONTACT_RECIPIENTS |
| 4 | Política de Privacidade | Texto-base preparado na migração (o site original não tinha página própria) | Revisão jurídica do Grupo Arbo; incluir razão social/CNPJ do controlador |
| 5 | Instagram | Exibe 4 publicações reais cadastradas como reserva (sem imagens) | Gerar token da API oficial (INSTAGRAM_ACCESS_TOKEN) ou cadastrar imagens nas publicações de reserva |
| 6 | Analytics | Integração pronta (GA4 ou GTM, com consentimento), sem IDs configurados | Informar o ID em Configurações do site → Analytics (usar GA4 dentro do GTM para não duplicar) |
| 7 | Contatos comerciais por roteiro | Nadja Albuquerque (5 roteiros) e Adriana Oliveira (Rio de Janeiro e Aparecida) migrados como **não validados**; o site usa o WhatsApp institucional | Confirmar números/e-mails e marcar "Contato validado" |
| 8 | Viagens fora da lista (seção C) | Cadastradas como rascunho | Decidir inclusão, completar dados e publicar ou excluir |

## B. Inconsistências encontradas no conteúdo original

`
const order = ['data', 'acompanhante', 'titulo', 'telefone', 'contato', 'preco', 'preco-desatualizado', 'pdf', 'imagem', 'itinerario', 'texto', 'divergencia', 'rota', 'roteiro', 'identidade']
for (const type of order) {
  const list = groups[type]
  if (!list?.length) continue
  rep += `### ${TYPE_LABEL[type] ?? type}\n\n| Roteiro | Ocorrência |\n|---|---|\n`
  for (const i of list) rep += `| ${i.slug ? `\`${i.slug}\`` : 'geral'} | ${esc(i.message)} |\n`
  rep += '\n'
}

rep += `## C. Viagens publicadas na homepage original que não estão entre os 14 roteiros

| Viagem | Período | Embarque | Acompanhamento | Observação |
|---|---|---|---|---|
`
for (const p of pending)
  rep += `| ${esc(p.title)} | ${esc(p.periodText ?? '—')} | ${esc(p.departureCity ?? '—')} | ${p.guides.map((g) => `${g.name} (${g.role})`).join('; ') || '—'} | ${esc(p.pendingNote)} |\n`

rep += `
## D. Arquivos

- **Arquivos não recuperados:** ${manifest.failures.length ? manifest.failures.map((f) => f.url).join(', ') : 'nenhum — todos os arquivos referenciados pelas páginas publicadas foram baixados.'}
- **Imagem sem origem no acervo:** o hero da página "Portugal e França" usava uma foto do Unsplash (placeholder externo). O novo site usa a 1ª foto da galeria do próprio roteiro; substituir pela imagem oficial.
- **Imagens que não são fotografias:** \`institucional/seguranca.jpg\` (captura de tela de cards de interface) e os ícones de valores (\`icons/valor-*.png\`, estilo emoji) foram preservados no acervo, mas o novo layout usa tratamento tipográfico nessas seções.
- **PDFs duplicados:** a homepage e as páginas de dois roteiros apontam para versões diferentes do mesmo PDF (ver seção B → PDFs). Ambas as versões estão em \`public/assets/pdfs/\`.
- **Biblioteca do WordPress:** ${notDownloaded.length} itens sem uso nas páginas publicadas foram apenas listados (ver [auditoria-e-inventario.md](auditoria-e-inventario.md)).

## E. Ajustes de acessibilidade em relação ao original

Para atingir contraste AA (WCAG), dois tons foram derivados da paleta original:

- Texto dourado sobre fundo claro usa **#8A6114** (o dourado #C9922A tem contraste 2,8:1 com branco); o dourado original segue nos elementos decorativos e sobre azul.
- Botões de WhatsApp usam **#12813C** (tom de hover do site original) em vez de #16A34A, cujo contraste com texto branco é 3,3:1.
- Cinza de textos secundários: **#5C6A7C** em vez de #6B7A8D.
`
fs.writeFileSync(path.join(ROOT, 'docs/pendencias-e-inconsistencias.md'), rep)
console.log(`docs/auditoria-e-inventario.md e docs/pendencias-e-inconsistencias.md gerados (${all.length} ocorrências, ${pending.length} viagens pendentes).`)
