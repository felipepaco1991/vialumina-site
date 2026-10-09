/**
 * Baixa os arquivos publicados no site original, organiza em public/assets,
 * elimina duplicatas binárias (sha256) e grava migration/asset-manifest.json
 * com a URL de origem e os usos de cada arquivo.
 *
 * Pré-requisito: extract-trips.mjs e extract-home.mjs já executados.
 * Uso: node scripts/migration/download-assets.mjs
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { TRIP_SLUGS } from './slugs.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const PUBLIC = path.join(ROOT, 'public')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
const WP = 'https://vialuminaviagens.com.br/wp-content/uploads/'

const trips = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/data/trips.raw.json'), 'utf8'))
const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/data/home-cards.raw.json'), 'utf8'))

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

const ext = (url) => path.extname(new URL(url).pathname).toLowerCase()

// Biblioteca pública de mídia (wp-json) para resolver variantes reduzidas
// (ex.: foto-819x1024.jpg) para o arquivo integral publicado.
const media = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/source/wp-api/media_all.json'), 'utf8'))
const fullByBase = new Map(media.map((m) => [m.source_url.replace(/-scaled(\.\w+)$/, '$1'), m.source_url]))
function fullSize(url) {
  const base = url.replace(/-\d+x\d+(\.\w+)$/, '$1')
  if (base === url) return url
  return fullByBase.get(base.replace(/-scaled(\.\w+)$/, '$1')) ?? url
}

/** url → { dest, usages[] } ; o primeiro destino registrado prevalece. */
const plan = new Map()
function want(rawUrl, dest, usage) {
  if (!rawUrl || !rawUrl.startsWith('https://vialuminaviagens.com.br/')) return
  const url = fullSize(rawUrl)
  if (url !== rawUrl) usage = { ...usage, referencedAs: rawUrl }
  const entry = plan.get(url) ?? { dest, usages: [] }
  entry.usages.push(usage)
  plan.set(url, entry)
}

// ---- Identidade visual e homepage ----------------------------------------
const brand = [
  ['2026/04/LogoViaLumina-scaled.png', 'logos/via-lumina-logo.png', 'Logotipo principal (cabeçalho)'],
  ['2026/04/LogoLuminaBranco-scaled.png', 'logos/via-lumina-logo-branco.png', 'Logotipo branco (rodapé)'],
  ['2026/04/LogoArbo.png', 'logos/grupo-arbo.png', 'Logotipo Grupo Arbo'],
  ['2026/06/grupo-arbo-2.svg', 'logos/grupo-arbo.svg', 'Logotipo Grupo Arbo (vetor, biblioteca de mídia)'],
  ['2026/03/Logo_vialumina_final-scaled.jpg', 'logos/via-lumina-logo-final.jpg', 'Logotipo (página /links)'],
  ['2026/03/favicon_vlm.png', 'logos/favicon-via-lumina.png', 'Favicon'],
  ['2026/03/favicon_vialumina-05-scaled.png', 'logos/favicon-via-lumina-alta.png', 'Favicon em alta resolução (biblioteca)'],
  ['2026/08/raios_vlm-scaled.png', 'logos/raios-via-lumina.png', "Marca d'água dos raios (páginas de roteiro)"],
  ['2026/06/Prancheta-1.png', 'icons/valor-fe.png', 'Ícone do valor Fé'],
  ['2026/06/Prancheta-2.png', 'icons/valor-responsabilidade.png', 'Ícone do valor Responsabilidade'],
  ['2026/06/Prancheta-3.png', 'icons/valor-experiencia.png', 'Ícone do valor Experiência'],
  ['2026/06/Prancheta-5.png', 'icons/valor-excelencia.png', 'Ícone do valor Excelência'],
  ['2026/06/Prancheta-4.png', 'icons/valor-proposito.png', 'Ícone do valor Propósito'],
  ['2026/08/banner_topo-scaled.jpg', 'home/hero-banner-topo.jpg', 'Hero da homepage'],
  ['2026/04/banner_meio_roteiros-scaled.jpg', 'home/banner-meio-roteiros.jpg', 'Fundo da seção de roteiros da homepage'],
  ['2026/06/Prancheta-1-1.png', 'institucional/quem-somos.png', 'Imagem da seção Quem Somos'],
  ['2026/04/Seguro.jpg', 'institucional/seguranca.jpg', 'Imagem da seção Quem Somos (segurança)'],
  ['2026/04/AdobeStock_456923731.jpg', 'institucional/paisagem-sagrada.jpg', 'Faixa de imagem da homepage (CSS)'],
  ['sb-instagram-feed-images/vialuminaviagens.webp', 'institucional/instagram-avatar.webp', 'Avatar do Instagram'],
]
for (const [p, dest, role] of brand) want(WP + p, dest, { page: 'home', role })

// ---- 14 roteiros ----------------------------------------------------------
for (const t of trips) {
  const slug = TRIP_SLUGS[t.n]
  const dir = `destinos/${slug}`
  if (t.heroImage) want(t.heroImage, `${dir}/hero${ext(t.heroImage)}`, { page: slug, role: 'hero' })
  t.gallery.slides.forEach((s, i) =>
    want(s.src, `${dir}/galeria-${String(i + 1).padStart(2, '0')}-${slugify(s.title || s.alt)}${ext(s.src)}`, {
      page: slug,
      role: `galeria #${i + 1}`,
    }),
  )
  for (const g of t.guides)
    want(g.photo, `acompanhantes/${slugify(g.name)}${ext(g.photo)}`, { page: slug, role: `foto de ${g.name}` })
  if (t.finalCta.pdf) want(t.finalCta.pdf, `pdfs/${slug}.pdf`, { page: slug, role: 'PDF do roteiro (página)' })
}

// ---- Cards da homepage (14 roteiros + viagens pendentes) -------------------
// Associação card → roteiro pelo PDF, que é o identificador mais confiável.
const pdfToSlug = new Map(trips.map((t) => [path.basename(t.finalCta.pdf ?? ''), TRIP_SLUGS[t.n]]))
const pdfAliases = {
  // A homepage aponta para variações do mesmo PDF; registradas no relatório.
  'vlm_roteiro_santuarios_marianos_padre-tito_web.pdf': 'santuarios-marianos-tito',
  'roteiro_vlm_mexico_guadalupe_frei-jose-1.pdf': 'mexico-guadalupe-cancun-2028',
}
for (const c of cards) {
  const pdf = path.basename(c.href)
  const slug = pdfToSlug.get(pdf) ?? pdfAliases[pdf]
  if (slug) {
    if (c.image) want(c.image, `destinos/${slug}/arte-divulgacao${ext(c.image)}`, { page: 'home', role: `card #${c.order}` })
    if (c.href.endsWith('.pdf')) want(c.href, `pdfs/${slug}${pdfAliases[pdf] ? '-home' : ''}.pdf`, { page: 'home', role: `PDF do card #${c.order}` })
  } else {
    const key = slugify(c.href.endsWith('.pdf') ? pdf.replace(/\.pdf$/, '') : c.title)
    if (c.image) want(c.image, `destinos-pendentes/${key}/arte-divulgacao${ext(c.image)}`, { page: 'home', role: `card #${c.order} (pendente)` })
    if (c.href.endsWith('.pdf')) want(c.href, `destinos-pendentes/${key}/roteiro.pdf`, { page: 'home', role: `PDF do card #${c.order} (pendente)` })
  }
}

// ---- Download -------------------------------------------------------------
const manifest = { generatedAt: new Date().toISOString(), source: 'https://vialuminaviagens.com.br/', files: [], failures: [] }
const bySha = new Map()

for (const [url, { dest, usages }] of plan) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } }).catch((e) => ({ ok: false, status: e.message }))
  if (!res.ok) {
    manifest.failures.push({ url, dest, status: res.status, usages })
    console.log('FALHA', res.status, url)
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const sha = crypto.createHash('sha256').update(buf).digest('hex')
  const dup = bySha.get(sha)
  if (dup) {
    dup.duplicateUrls.push(url)
    dup.usages.push(...usages)
    console.log('dup  ', path.basename(url), '→', dup.path)
    continue
  }
  const abs = path.join(PUBLIC, 'assets', dest)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, buf)
  const entry = {
    path: `/assets/${dest}`,
    originalUrl: url,
    duplicateUrls: [],
    sha256: sha,
    bytes: buf.length,
    contentType: res.headers.get('content-type'),
    usages,
  }
  bySha.set(sha, entry)
  manifest.files.push(entry)
  console.log('ok   ', `${(buf.length / 1024).toFixed(0).padStart(6)} KB`, entry.path)
}

fs.writeFileSync(path.join(ROOT, 'migration/asset-manifest.json'), JSON.stringify(manifest, null, 2))
const total = manifest.files.reduce((s, f) => s + f.bytes, 0)
console.log(`\n${manifest.files.length} arquivos (${(total / 1e6).toFixed(1)} MB), ${manifest.failures.length} falhas`)
