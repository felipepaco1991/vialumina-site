/**
 * Extrai o conteúdo integral dos 14 roteiros a partir do HTML original
 * (migration/source/pages) e grava migration/data/trips.raw.json.
 *
 * O objetivo é fidelidade: nenhum texto é resumido ou reescrito aqui.
 * A normalização (datas ISO, países, regiões) acontece em build-catalog.mjs.
 *
 * Uso: node scripts/migration/extract-trips.mjs
 */
import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const SRC = path.join(ROOT, 'migration/source/pages')
const OUT = path.join(ROOT, 'migration/data/trips.raw.json')

/** Ordem e URLs oficiais conforme o briefing (seção 7). */
export const LEGACY_PAGES = [
  { n: 1, file: 'elementor-pagina-899', url: 'https://vialuminaviagens.com.br/elementor-pagina-899/' },
  { n: 2, file: 'elementor-pagina-942', url: 'https://vialuminaviagens.com.br/elementor-pagina-942/' },
  { n: 3, file: 'mexicoguadalupe-e-cancun', url: 'https://vialuminaviagens.com.br/mexicoguadalupe-e-cancun/' },
  { n: 4, file: 'rio-de-janeiro-e-aparecida', url: 'https://vialuminaviagens.com.br/rio-de-janeiro-e-aparecida/' },
  { n: 5, file: 'portugal-italia-e-vaticano', url: 'https://vialuminaviagens.com.br/portugal-italia-e-vaticano/' },
  { n: 6, file: 'santuarios-marianos', url: 'https://vialuminaviagens.com.br/santuarios-marianos/' },
  { n: 7, file: 'santuarios-marianos-2', url: 'https://vialuminaviagens.com.br/santuarios-marianos-2/' },
  { n: 8, file: 'elementor-pagina-1071', url: 'https://vialuminaviagens.com.br/elementor-pagina-1071/' },
  { n: 9, file: 'europa-sagrada', url: 'https://vialuminaviagens.com.br/europa-sagrada/' },
  { n: 10, file: 'santuarios-italianos-2', url: 'https://vialuminaviagens.com.br/santuarios-italianos-2/' },
  { n: 11, file: 'aparecida-do-norte-carlos', url: 'https://vialuminaviagens.com.br/aparecida-do-norte-carlos/' },
  { n: 12, file: 'santuarios-marianos-tito', url: 'https://vialuminaviagens.com.br/santuarios-marianos-tito/' },
  { n: 13, file: 'mexico-guadalupe-e-cancun', url: 'https://vialuminaviagens.com.br/mexico-guadalupe-e-cancun/' },
  { n: 14, file: 'egito-e-terra-santa', url: 'https://vialuminaviagens.com.br/egito-e-terra-santa/' },
]

/** Normaliza espaços sem alterar o conteúdo textual. */
const clean = (s) => (s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim()

/** Decodifica o e-mail ofuscado pelo Cloudflare (/cdn-cgi/l/email-protection#hex). */
function decodeCfEmail(href) {
  const m = /#([0-9a-f]+)/i.exec(href ?? '')
  if (!m) return null
  const bytes = m[1].match(/../g).map((h) => parseInt(h, 16))
  const key = bytes[0]
  return decodeURIComponent(
    escape(String.fromCharCode(...bytes.slice(1).map((b) => b ^ key))),
  )
}

function parseWhatsapp(href) {
  if (!href) return null
  try {
    const u = new URL(href)
    const phone = u.hostname === 'wa.me' ? u.pathname.slice(1) : u.searchParams.get('phone')
    return { href, phone, text: u.searchParams.get('text') }
  } catch {
    return { href, phone: null, text: null }
  }
}

function extract(file) {
  const html = fs.readFileSync(path.join(SRC, `${file}.html`), 'utf8')
  const $ = cheerio.load(html)
  // Quebras de linha visuais (<br>) viram espaço para não colar palavras.
  $('br').replaceWith(' ')
  const page = $('#via-lumina-page')
  if (!page.length) throw new Error(`#via-lumina-page ausente em ${file}`)

  // Imagem do hero: definida no CSS inline (última regra .hero com background-image vence).
  const heroBgs = [...html.matchAll(/\.hero\s*\{[^}]*?background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/g)].map(
    (m) => m[2],
  )
  const watermark = /vl-watermark\s*\{[^}]*?url\((['"]?)([^'")]+)\1\)/.exec(html)?.[2] ?? null

  const hero = page.find('header.hero')
  const tags = hero.find('.tags .tag').map((_, e) => clean($(e).text())).get()

  const summary = page.find('.hero-summary')
  const heroCta = summary.find('a.vl-btn-primary').attr('href')

  const infoCards = page
    .find('.intro-section .info-card')
    .map((_, e) => ({ label: clean($(e).find('h3').text()), value: clean($(e).find('p').text()) }))
    .get()

  // Direção espiritual: layout simples (.director-feature) ou duplo (.dual-guidance).
  const guides = []
  page.find('.director-feature .director-photo-wrap').each((_, e) => {
    const img = $(e).find('img')
    guides.push({
      name: clean($(e).find('.director-photo-label strong').text()),
      role: clean($(e).find('.director-photo-label span').text()),
      photo: img.attr('src') ?? null,
      photoAlt: clean(img.attr('alt')),
    })
  })
  page.find('.dual-guidance .guide-profile').each((_, e) => {
    const img = $(e).find('img')
    guides.push({
      name: clean($(e).find('.guide-profile-label strong').text()),
      role: clean($(e).find('.guide-profile-label span').text()),
      photo: img.attr('src') ?? null,
      photoAlt: clean(img.attr('alt')),
    })
  })
  const copy = page.find('.director-copy').first()
  const guidance = {
    eyebrow: clean(copy.find('.eyebrow').text()),
    heading: clean(copy.find('h2').text()),
    lead: clean(copy.find('.lead').text()),
    points: copy.find('.director-point span').map((_, e) => clean($(e).text())).get(),
  }

  const exp = page.find('.experience-section')
  const experience = {
    heading: clean(exp.find('.section-title').text()),
    intro: clean(exp.find('.section-intro').text()),
    cards: exp
      .find('.experience-card')
      .map((_, e) => ({
        place: clean($(e).find('.city').text()),
        title: clean($(e).find('h3').text()),
        text: clean($(e).find('p').text()),
      }))
      .get(),
  }

  const gal = page.find('.route-gallery')
  const gallery = {
    eyebrow: clean(gal.find('.route-gallery-head .eyebrow').text()),
    heading: clean(gal.find('.route-gallery-head h2').text()),
    slides: gal
      .find('figure.vl-slide')
      .map((_, e) => ({
        src: $(e).find('img').attr('src'),
        alt: clean($(e).find('img').attr('alt')),
        place: clean($(e).find('.vl-slide-kicker').text()),
        title: clean($(e).find('.vl-slide-place h3').text()),
      }))
      .get(),
  }

  const itinerary = page
    .find('.itinerary-section .timeline-item')
    .map((_, e) => ({
      title: clean($(e).find('.day-title').text()),
      paragraphs: $(e)
        .find('.timeline-content p')
        .map((_, p) => clean($(p).text()))
        .get()
        .filter(Boolean),
    }))
    .get()

  const pb = page.find('.package-banner')
  const packageSummary = {
    heading: clean(pb.find('h3').text()),
    text: clean(pb.find('p').text()),
    tags: pb.find('.package-tags span').map((_, e) => clean($(e).text())).get(),
  }

  const lists = {}
  page.find('.details-card').each((_, e) => {
    const title = clean($(e).find('.card-title').text())
    const items = $(e).find('li').map((_, li) => clean($(li).text())).get()
    if ($(e).find('ul.check-list').length) lists.included = { title, items }
    else lists.notIncluded = { title, items }
  })

  const obs = page.find('.observations')
  const observations = {
    heading: clean(obs.find('h4').text()),
    paragraphs: obs.find('p').map((_, p) => ({ text: clean($(p).text()), emphasis: $(p).find('em').length > 0 })).get(),
  }

  const pr = page.find('.pricing-section')
  const t = (sel) => clean(pr.find(sel).text()) || null
  const pricing = {
    planPrefix: t('.price-plan-prefix'),
    planValue: t('.price-plan-value'),
    planExtra: t('.price-plan-extra'),
    entry: t('.price-entry'),
    totalLabel: t('.price-total-label'),
    totalBrl: t('.price-total-brl'),
    totalUsd: t('.price-total-usd'),
    disclaimer: pr.find('.price-disclaimer p').map((_, p) => clean($(p).text())).get(),
  }

  const cta = $('.final-cta').first()
  const ctaLinks = cta.find('a.vl-btn')
  const finalCta = {
    kicker: clean(cta.find('.hero-kicker').text()),
    heading: clean(cta.find('h2').text()),
    text: clean(cta.find('p').first().text()),
    whatsapp: parseWhatsapp(ctaLinks.filter('.vl-btn-primary').attr('href')),
    email: (() => {
      const href = ctaLinks.filter('[href*="email-protection"]').attr('href')
      const decoded = decodeCfEmail(href)
      if (!decoded) return null
      const [to, query = ''] = decoded.split('?')
      return { to, ...Object.fromEntries(new URLSearchParams(query)) }
    })(),
    pdf: ctaLinks.filter('.vl-btn-pdf').attr('href') ?? null,
  }

  const meta = {
    title: clean($('title').text()),
    ogImage: $('meta[property="og:image"]').attr('content') ?? null,
    modified: $('meta[property="article:modified_time"]').attr('content') ?? null,
  }

  return {
    wpSlug: file,
    meta,
    heroImageCandidates: heroBgs,
    heroImage: heroBgs.at(-1) ?? null,
    watermark,
    tags,
    title: clean(hero.find('.main-title').text()),
    subtitle: clean(hero.find('.subtitle').text()),
    description: clean(summary.find('.hero-description').text()),
    heroWhatsapp: parseWhatsapp(heroCta),
    limitedNote: clean(summary.find('.limited-note').text()),
    infoCards,
    guides,
    guidance,
    experience,
    gallery,
    itinerary,
    packageSummary,
    included: lists.included ?? null,
    notIncluded: lists.notIncluded ?? null,
    observations,
    pricing,
    finalCta,
  }
}

const trips = LEGACY_PAGES.map(({ n, file, url }) => ({ n, legacyUrl: url, ...extract(file) }))
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(trips, null, 2))
for (const t of trips) {
  console.log(
    `${String(t.n).padStart(2)} ${t.title.padEnd(36)} dias=${t.itinerary.length} inc=${t.included?.items.length} exc=${t.notIncluded?.items.length} galeria=${t.gallery.slides.length} guias=${t.guides.map((g) => g.name).join('+')} hero=${path.basename(t.heroImage ?? '-')}`,
  )
}
console.log(`\n→ ${path.relative(ROOT, OUT)}`)
