/**
 * Normaliza os roteiros extraídos (trips.raw.json) no formato do CMS e
 * gera migration/data/trips.json. Também registra, em
 * migration/data/catalog-issues.json, as divergências encontradas
 * durante a normalização — nada é corrigido por suposição.
 *
 * Uso: node scripts/migration/build-catalog.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { TRIP_SLUGS } from './slugs.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/data/trips.raw.json'), 'utf8'))
const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/data/home-cards.raw.json'), 'utf8'))
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/asset-manifest.json'), 'utf8'))

const issues = []
const issue = (slug, type, message, detail) => issues.push({ slug, type, message, ...(detail ? { detail } : {}) })

/** URL original → caminho local, considerando duplicatas binárias. */
const localByUrl = new Map()
for (const f of manifest.files) {
  localByUrl.set(f.originalUrl, f.path)
  for (const d of f.duplicateUrls) localByUrl.set(d, f.path)
  for (const u of f.usages) if (u.referencedAs) localByUrl.set(u.referencedAs, f.path)
}
const local = (url) => (url ? (localByUrl.get(url) ?? null) : null)

// ---------------------------------------------------------------------------
// Dados editoriais que não podem ser extraídos mecanicamente do HTML.
// Países: conforme títulos, cards de experiência e itinerário de cada página.
// Cidades: localidades visitadas no itinerário (sem a cidade de embarque e
// sem conexões/aeroportos de trânsito).
// ---------------------------------------------------------------------------
const EDITORIAL = {
  1: {
    countries: ['Portugal', 'França'],
    cities: ['Lisboa', 'Fátima', 'Toulouse', 'Lourdes', 'Paris', 'Lisieux'],
    sanctuaries: ['Santuário de Fátima', 'Santuário de Nossa Senhora de Lourdes', 'Capela da Medalha Milagrosa', 'Basílica do Sagrado Coração (Sacré-Cœur)', 'Basílica de Santa Teresinha'],
    departureCity: 'Brasília',
  },
  2: {
    countries: ['Brasil'],
    cities: ['São Paulo', 'Aparecida', 'Guaratinguetá', 'Lorena', 'Cachoeira Paulista', 'Campos do Jordão'],
    sanctuaries: ['Santuário Nacional de Nossa Senhora Aparecida', 'Canção Nova'],
    departureCity: 'Recife',
  },
  3: {
    countries: ['México'],
    cities: ['Cidade do México', 'Guadalupe', 'Tulpetlac', 'Cuautitlán', 'Cuernavaca', 'Taxco', 'Tlaxcala', 'Puebla', 'Cancún'],
    sanctuaries: ['Basílica de Nossa Senhora de Guadalupe'],
    departureCity: 'São Paulo/Guarulhos',
  },
  4: {
    countries: ['Brasil'],
    cities: ['Rio de Janeiro', 'Petrópolis', 'Cachoeira Paulista', 'Guaratinguetá', 'Aparecida', 'Campos do Jordão', 'São Paulo'],
    sanctuaries: ['Santuário Nacional de Nossa Senhora Aparecida', 'Canção Nova', 'Cristo Redentor'],
    departureCity: 'Recife',
  },
  5: {
    countries: ['Portugal', 'Itália', 'Vaticano'],
    cities: ['Lisboa', 'Fátima', 'Roma', 'Assis', 'Cássia', 'San Giovanni Rotondo', 'Monte Gargano', 'Lanciano', 'Vaticano'],
    sanctuaries: ['Santuário de Fátima', 'Basílica de São Francisco de Assis', 'Santuário de Santa Rita de Cássia', 'Santuário de São Padre Pio', 'Milagre Eucarístico de Lanciano'],
    departureCity: 'Fortaleza',
  },
  6: {
    countries: ['Portugal', 'Espanha', 'França'],
    cities: ['Lisboa', 'Fátima', 'Santiago de Compostela', 'Gijón', 'Lourdes', 'Paris', 'Lisieux'],
    sanctuaries: ['Santuário de Fátima', 'Catedral de Santiago de Compostela', 'Santuário de Nossa Senhora de Lourdes', 'Capela da Medalha Milagrosa'],
    departureCity: 'Brasília',
  },
  7: {
    countries: ['Portugal', 'França', 'Bósnia e Herzegovina'],
    cities: ['Lisboa', 'Fátima', 'Toulouse', 'Lourdes', 'Paris', 'Lisieux', 'Medjugorje'],
    sanctuaries: ['Santuário de Fátima', 'Santuário de Nossa Senhora de Lourdes', 'Capela da Medalha Milagrosa', 'Medjugorje'],
    departureCity: 'Londrina',
  },
  8: {
    countries: ['Brasil'],
    cities: ['São Paulo', 'Aparecida', 'Lorena', 'Guaratinguetá', 'Cachoeira Paulista', 'Campos do Jordão'],
    sanctuaries: ['Santuário Nacional de Nossa Senhora Aparecida', 'Canção Nova'],
    departureCity: 'Recife',
  },
  9: {
    countries: ['Suíça', 'Áustria', 'Itália', 'Vaticano'],
    cities: ['Zurique', 'Berna', 'Lucerna', 'Innsbruck', 'Salzburgo', 'Viena', 'Melk', 'Veneza', 'Pádua', 'Assis', 'Roma', 'Vaticano'],
    sanctuaries: ['Basílica de Santo Antônio de Pádua', 'Basílica de São Francisco de Assis', 'Basílica de São Pedro'],
    departureCity: 'Brasília',
  },
  10: {
    countries: ['Itália', 'Vaticano'],
    cities: ['Veneza', 'Pádua', 'Assis', 'Perugia', 'Orvieto', 'Cascia', 'San Giovanni Rotondo', 'Monte Gargano', 'Lanciano', 'Roma', 'Vaticano'],
    sanctuaries: ['Basílica de Santo Antônio de Pádua', 'Basílica de São Francisco de Assis', 'Santuário de Santa Rita de Cássia', 'Santuário de São Padre Pio', 'Milagre Eucarístico de Lanciano', 'Basílica de São Pedro'],
    departureCity: 'Recife',
  },
  11: {
    countries: ['Brasil'],
    cities: ['São Paulo', 'Aparecida', 'Lorena', 'Guaratinguetá', 'Cachoeira Paulista', 'Campos do Jordão'],
    sanctuaries: ['Santuário Nacional de Nossa Senhora Aparecida', 'Canção Nova'],
    departureCity: 'Recife',
  },
  12: {
    countries: ['França', 'Espanha', 'Portugal'],
    cities: ['Paris', 'Lisieux', 'Lourdes', 'Barcelona', 'Zaragoza', 'Madri', 'Ávila', 'Fátima', 'Lisboa'],
    sanctuaries: ['Capela da Medalha Milagrosa', 'Basílica de Santa Teresinha', 'Santuário de Nossa Senhora de Lourdes', 'Basílica de Nossa Senhora do Pilar', 'Santuário de Fátima'],
    departureCity: 'Aracaju',
  },
  13: {
    countries: ['México'],
    cities: ['Cidade do México', 'Guadalupe', 'Tulpetlac', 'Cuautitlán', 'Cuernavaca', 'Taxco', 'Tlaxcala', 'Puebla', 'Cancún'],
    sanctuaries: ['Basílica de Nossa Senhora de Guadalupe'],
    departureCity: 'Recife',
  },
  14: {
    countries: ['Egito', 'Israel'],
    cities: ['Cairo', 'Sinai', 'Monte Sinai', 'Eilat', 'Mar Morto', 'Jericó', 'Galileia', 'Nazaré', 'Caná', 'Cafarnaum', 'Betânia', 'Jerusalém', 'Belém', 'Tel Aviv'],
    sanctuaries: ['Mosteiro de Santa Catarina', 'Basílica da Natividade', 'Santo Sepulcro', 'Monte das Oliveiras', 'Monte Tabor'],
    departureCity: 'São Paulo/Guarulhos',
  },
}

const REGION_BY_COUNTRY = {
  Brasil: 'brasil',
  Portugal: 'europa',
  França: 'europa',
  Espanha: 'europa',
  Itália: 'europa',
  Vaticano: 'europa',
  Suíça: 'europa',
  Áustria: 'europa',
  'Bósnia e Herzegovina': 'europa',
  México: 'america-do-norte',
  Egito: 'oriente-medio-africa',
  Israel: 'oriente-medio-africa',
}

/** Destaques iniciais da homepage (editável no CMS). */
const FEATURED = new Set([1, 3, 9, 10, 11, 14])

// ---------------------------------------------------------------------------
const MONTHS = {
  jan: 1, janeiro: 1, fev: 2, fevereiro: 2, mar: 3, março: 3, abr: 4, abril: 4, mai: 5, maio: 5,
  jun: 6, junho: 6, jul: 7, julho: 7, ago: 8, agos: 8, agosto: 8, set: 9, setembro: 9,
  out: 10, outubro: 10, nov: 11, novembro: 11, dez: 12, dezembro: 12,
}
const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

/** "05 a 16 de outubro de 2027 · 9 noites" | "21 de setembro a 02 de outubro de 2027 · 10 noites" */
function parsePeriod(text) {
  const m =
    /(\d{1,2})(?:\s+de\s+([a-zç]+))?\s+a\s+(\d{1,2})\s+de\s+([a-zç]+)\s+de\s+(\d{4})(?:\s*·\s*(\d+)\s+noites)?/i.exec(text)
  if (!m) return null
  const [, d1, m1, d2, m2, y, nights] = m
  const endMonth = MONTHS[m2.toLowerCase()]
  const startMonth = m1 ? MONTHS[m1.toLowerCase()] : endMonth
  const startYear = startMonth > endMonth ? Number(y) - 1 : Number(y)
  return {
    startDate: iso(startYear, startMonth, Number(d1)),
    endDate: iso(Number(y), endMonth, Number(d2)),
    nights: nights ? Number(nights) : null,
  }
}

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000) + 1
const addDays = (isoDate, n) => new Date(Date.parse(isoDate) + n * 86400000).toISOString().slice(0, 10)

/** "R$ 28.962,08" → 28962.08 */
const money = (s) => {
  const m = /([\d.]+,\d{2})/.exec(s ?? '')
  return m ? Number(m[1].replace(/\./g, '').replace(',', '.')) : null
}

function parsePricing(p, slug) {
  const installments = /(\d+)x/i.exec(p.planPrefix ?? '')
  const rate = /USD\s*1,00\s*=\s*R\$\s*([\d,]+)\s+em\s+(\d{2})\/(\d{2})\/(\d{4})/.exec(p.disclaimer.join(' '))
  const currency = p.totalUsd ? 'USD' : 'BRL'
  const result = {
    currency,
    totalOriginalCurrency: currency === 'USD' ? money(p.totalUsd?.replace('USD', 'R$')) : money(p.totalBrl),
    totalBrl: money(p.totalBrl),
    installmentsCount: installments ? Number(installments[1]) : null,
    installmentValueBrl: money(p.planValue),
    extraInstallments: p.planExtra,
    entryText: p.entry,
    entryValueBrl: money(p.entry),
    exchangeRate: rate ? Number(rate[1].replace(',', '.')) : null,
    exchangeRateDate: rate ? iso(rate[4], rate[3], rate[2]) : null,
    conditions: p.disclaimer,
    display: {
      planPrefix: p.planPrefix,
      planValue: p.planValue,
      totalLabel: p.totalLabel,
      totalBrl: p.totalBrl,
      totalUsd: p.totalUsd,
    },
    // Valores publicados no site antigo. Ficam ocultos até aprovação comercial.
    approved: false,
    referenceNote: 'Valores migrados do site original; aguardam validação comercial antes da exibição.',
  }
  if (currency === 'USD' && !result.exchangeRate)
    issue(slug, 'preco', 'Valor em dólar sem câmbio de referência identificado.')
  if (result.exchangeRate && result.totalOriginalCurrency && result.totalBrl) {
    const calc = Math.round(result.totalOriginalCurrency * result.exchangeRate * 100) / 100
    if (Math.abs(calc - result.totalBrl) > 1)
      issue(slug, 'preco', `Total em R$ (${p.totalBrl}) difere de ${p.totalUsd} × câmbio ${result.exchangeRate} = R$ ${calc.toFixed(2)}.`)
  }
  if (result.installmentsCount && result.installmentValueBrl && result.totalBrl && !p.planExtra) {
    const sum = result.installmentsCount * result.installmentValueBrl + (result.entryValueBrl ?? 0)
    if (Math.abs(sum - result.totalBrl) > result.installmentsCount)
      issue(slug, 'preco', `${p.entry ? 'Entrada + parcelas' : 'Parcelas (sem entrada informada)'} somam R$ ${sum.toFixed(2)}; total publicado é ${p.totalBrl} (diferença de R$ ${(result.totalBrl - sum).toFixed(2)}).`, {
        entrada: p.entry,
        parcelas: `${p.planPrefix} ${p.planValue}`,
      })
  }
  if (result.exchangeRateDate)
    issue(slug, 'preco-desatualizado', `Câmbio de referência de ${result.exchangeRateDate}; valores exigem revalidação comercial.`)
  return result
}

/** "DIA 3 (07/out) – FÁTIMA" */
function parseDay(d, startDate, slug) {
  const m = /^DIA\s+(\d+)\s*\(([^)]*)\)\s*[–-]\s*(.+)$/i.exec(d.title)
  if (!m) {
    issue(slug, 'itinerario', `Título de dia fora do padrão: "${d.title}"`)
    return { day: null, dateLabel: null, date: null, route: d.title, title: d.title, paragraphs: d.paragraphs }
  }
  const [, day, label, route] = m
  const expected = addDays(startDate, Number(day) - 1)
  const lm = /(\d{1,2})\/([a-zç]+)/i.exec(label)
  if (lm) {
    const month = MONTHS[lm[2].toLowerCase()]
    const matches = Number(expected.slice(5, 7)) === month && Number(expected.slice(8)) === Number(lm[1])
    if (!matches)
      issue(slug, 'data', `Dia ${day} rotulado "${label}", mas pela data de saída seria ${expected.split('-').reverse().join('/')}.`, {
        titulo: d.title,
      })
  }
  return { day: Number(day), dateLabel: label, date: expected, route: route.trim(), title: d.title, paragraphs: d.paragraphs }
}

/** Contatos específicos informados nos cards da homepage. */
function homeContact(pdf) {
  const card = cards.find((c) => path.basename(c.href) === pdf)
  const text = card?.paragraphs.find((p) => p.startsWith('Contato:'))
  if (!text) return null
  const m = /Contato:\s*(.+?)\s+\[email.*?WhatsApp:\s*([()\d\s-]+)/.exec(text)
  if (!m) return null
  return { name: m[1].trim(), whatsappDisplay: m[2].trim(), email: card.email, cardOrder: card.order }
}

// ---------------------------------------------------------------------------
const trips = raw.map((t) => {
  const slug = TRIP_SLUGS[t.n]
  const ed = EDITORIAL[t.n]
  const info = Object.fromEntries(t.infoCards.map((c) => [c.label.toLowerCase(), c.value]))
  const period = parsePeriod(info['período'])
  if (!period) throw new Error(`Período não reconhecido em ${slug}: ${info['período']}`)
  const days = daysBetween(period.startDate, period.endDate)
  if (days !== t.itinerary.length)
    issue(slug, 'itinerario', `Período tem ${days} dias, mas o dia a dia publicado tem ${t.itinerary.length}.`)

  const heroLocal = local(t.heroImage)
  if (!heroLocal)
    issue(slug, 'imagem', 'Imagem do hero da página original não pertence ao acervo da Via Lumina (placeholder externo). Usada a 1ª foto da galeria; substituir pela imagem oficial.', {
      urlOriginal: t.heroImage,
    })
  const gallery = t.gallery.slides.map((s) => ({ image: local(s.src), alt: s.alt, place: s.place, title: s.title }))
  const pdf = local(t.finalCta.pdf)

  const contact = homeContact(path.basename(t.finalCta.pdf ?? ''))
  if (contact) {
    const digits = contact.whatsappDisplay.replace(/\D/g, '')
    contact.whatsapp = `55${digits}`
    if (digits.length !== 11)
      issue(slug, 'telefone', `WhatsApp do contato ${contact.name} tem ${digits.length} dígitos ("${contact.whatsappDisplay}"); celular brasileiro deve ter 11 (DDD + 9 dígitos).`)
    if (!contact.email)
      issue(slug, 'contato', `E-mail do contato ${contact.name} não pôde ser recuperado (proteção de e-mail sem endereço codificado no site original).`)
    issue(slug, 'contato', `Contato comercial específico (${contact.name}) informado no card da homepage; validar antes de exibir na página do roteiro.`)
  }

  const departureTag = t.tags.find((x) => /SAÍDA/i.test(x)) ?? ''
  const monthTag = t.tags.find((x) => /\d{4}/.test(x)) ?? ''

  return {
    legacyNumber: t.n,
    slug,
    legacyUrl: t.legacyUrl,
    legacyWpSlug: t.wpSlug,
    title: t.title,
    subtitle: t.subtitle,
    description: t.description,
    heroTags: { period: monthTag, departure: departureTag },
    limitedNote: t.limitedNote,
    regions: [...new Set(ed.countries.map((c) => REGION_BY_COUNTRY[c]))],
    countries: ed.countries,
    cities: ed.cities,
    sanctuaries: ed.sanctuaries,
    departureCity: ed.departureCity,
    departureAirport: info['embarque'],
    startDate: period.startDate,
    endDate: period.endDate,
    days,
    nights: period.nights,
    periodText: info['período'],
    accommodation: info['acomodação'],
    baggage: info['bagagem'],
    guides: t.guides.map((g) => ({ name: g.name, role: g.role, photo: local(g.photo), photoAlt: g.photoAlt })),
    guidance: t.guidance,
    featuredImage: heroLocal ?? gallery[0]?.image,
    featuredImageAlt: heroLocal ? `${t.title} — ${t.subtitle}` : gallery[0]?.alt,
    cardArt: manifest.files.find((f) => f.path.startsWith(`/assets/destinos/${slug}/arte-divulgacao`))?.path ?? null,
    gallery: { eyebrow: t.gallery.eyebrow, heading: t.gallery.heading, items: gallery },
    highlights: t.experience,
    itinerary: t.itinerary.map((d) => parseDay(d, period.startDate, slug)),
    packageSummary: t.packageSummary,
    included: t.included,
    notIncluded: t.notIncluded,
    observations: t.observations,
    pricing: parsePricing(t.pricing, slug),
    pdf,
    finalCta: { kicker: t.finalCta.kicker, heading: t.finalCta.heading, text: t.finalCta.text },
    whatsappMessage: t.finalCta.whatsapp?.text ?? null,
    email: t.finalCta.email,
    contact,
    status: 'published',
    featured: FEATURED.has(t.n),
    sortOrder: t.n,
    seo: {
      title: `${t.title} · ${monthTag.replace(/\s*\|\s*/, ' ')} · Peregrinação`,
      description: t.description,
    },
    source: { modified: t.meta.modified, ogImage: t.meta.ogImage },
  }
})

// Verificações transversais -------------------------------------------------
for (const t of trips) {
  for (const g of t.guides) if (!g.photo) issue(t.slug, 'imagem', `Foto de ${g.name} não recuperada.`)
  if (!t.pdf) issue(t.slug, 'pdf', 'PDF do roteiro não recuperado.')
  if (!t.cardArt) issue(t.slug, 'imagem', 'Arte de divulgação da homepage não associada.')
}
// A homepage aponta para um PDF diferente do da página do roteiro.
for (const f of manifest.files)
  if (/\/pdfs\/.+-home\.pdf$/.test(f.path)) {
    const slug = f.path.match(/pdfs\/(.+)-home\.pdf$/)[1]
    issue(slug, 'pdf', `O card da homepage aponta para outro arquivo PDF (${path.basename(f.originalUrl)}) diferente do botão da página (${path.basename(trips.find((t) => t.slug === slug).pdf)}). Confirmar a versão vigente.`)
  }
// Mesma imagem usada como hero em roteiros diferentes.
const heroUse = Object.groupBy(trips, (t) => t.featuredImage)
for (const [img, list] of Object.entries(heroUse))
  if (list.length > 1)
    issue(null, 'imagem', `A mesma fotografia é capa de ${list.length} roteiros: ${list.map((t) => t.slug).join(', ')}.`, { imagem: img })

fs.writeFileSync(path.join(ROOT, 'migration/data/trips.json'), JSON.stringify(trips, null, 2))
fs.writeFileSync(path.join(ROOT, 'migration/data/catalog-issues.json'), JSON.stringify(issues, null, 2))
for (const t of trips)
  console.log(`${t.slug.padEnd(34)} ${t.startDate} → ${t.endDate} ${String(t.days).padStart(2)}d/${t.nights}n ${t.departureCity.padEnd(20)} ${t.regions.join(',')} ${t.pricing.currency} ${t.pricing.totalOriginalCurrency}`)
console.log(`\n${issues.length} ocorrências registradas em migration/data/catalog-issues.json`)
