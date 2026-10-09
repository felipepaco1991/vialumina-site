/* eslint-disable @typescript-eslint/no-explicit-any -- dados JSON da migração, validados pelo próprio schema do Payload */
/**
 * Importa o conteúdo migrado (migration/data) para o CMS.
 * Idempotente: pode ser executado novamente; registros existentes são
 * atualizados pelo slug e arquivos não são enviados em duplicidade.
 *
 * Uso: npm run seed
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { slugify } from '@/fields/slug'

const ROOT = process.cwd()
const readJson = <T>(rel: string): T => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) as T

type ManifestFile = { path: string; originalUrl: string; usages: { page: string; role: string }[] }
type RawTrip = ReturnType<typeof readJson<any>>
type Issue = { slug: string | null; type: string; message: string }

const manifest = readJson<{ files: ManifestFile[] }>('migration/asset-manifest.json')
const trips = readJson<RawTrip[]>('migration/data/trips.json')
const pending = readJson<any[]>('migration/data/pending-trips.json')
const issues = [
  ...readJson<Issue[]>('migration/data/catalog-issues.json'),
  ...readJson<Issue[]>('migration/data/manual-findings.json'),
]

const ctx = { disableRevalidate: true }
const originalOf = (p: string) => manifest.files.find((f) => f.path === p)?.originalUrl

async function upsertMedia(payload: Payload, publicPath: string | null | undefined, alt: string) {
  if (!publicPath) return null
  const originalUrl = originalOf(publicPath) ?? publicPath
  const found = await payload.find({ collection: 'media', where: { originalUrl: { equals: originalUrl } }, limit: 1, context: ctx })
  if (found.docs[0]) return found.docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt, originalUrl },
    filePath: path.join(ROOT, 'public', publicPath),
    context: ctx,
  })
  return doc.id
}

async function upsertDocument(payload: Payload, publicPath: string | null | undefined, title: string) {
  if (!publicPath) return null
  const originalUrl = originalOf(publicPath) ?? publicPath
  const found = await payload.find({ collection: 'documents', where: { originalUrl: { equals: originalUrl } }, limit: 1, context: ctx })
  if (found.docs[0]) return found.docs[0].id
  const doc = await payload.create({
    collection: 'documents',
    data: { title, originalUrl },
    filePath: path.join(ROOT, 'public', publicPath),
    context: ctx,
  })
  return doc.id
}

async function upsertGuide(payload: Payload, g: { name: string; role: string; photo?: string | null; photoAlt?: string }) {
  const slug = slugify(g.name)
  const found = await payload.find({ collection: 'guides', where: { slug: { equals: slug } }, limit: 1, context: ctx })
  if (found.docs[0]) return found.docs[0].id
  const photo = await upsertMedia(payload, g.photo, g.photoAlt || g.name)
  const doc = await payload.create({
    collection: 'guides',
    data: { name: g.name, slug, defaultRole: g.role, photo: photo ?? undefined },
    context: ctx,
  })
  return doc.id
}

async function upsertTrip(payload: Payload, data: Record<string, unknown>) {
  const found = await payload.find({ collection: 'trips', where: { slug: { equals: data.slug } }, limit: 1, context: ctx })
  if (found.docs[0]) {
    await payload.update({ collection: 'trips', id: found.docs[0].id, data, context: ctx })
    return 'atualizado'
  }
  await payload.create({ collection: 'trips', data: data as any, context: ctx })
  return 'criado'
}

const notesFor = (slug: string) => issues.filter((i) => i.slug === slug).map((i) => ({ text: `[${i.type}] ${i.message}` }))

async function seedTrips(payload: Payload) {
  for (const t of trips) {
    const featuredImage = await upsertMedia(payload, t.featuredImage, t.featuredImageAlt || t.title)
    const cardArt = await upsertMedia(payload, t.cardArt, `Arte de divulgação da peregrinação ${t.title}`)
    const guides = []
    for (const g of t.guides) guides.push({ guide: await upsertGuide(payload, g), role: g.role })
    const galleryItems = []
    for (const item of t.gallery.items)
      galleryItems.push({ image: await upsertMedia(payload, item.image, item.alt), place: item.place, title: item.title })
    const pdf = await upsertDocument(payload, t.pdf, `Roteiro ${t.title} (${t.heroTags.period})`)

    const result = await upsertTrip(payload, {
      title: t.title,
      slug: t.slug,
      status: t.status === 'published' ? 'publicado' : 'rascunho',
      featured: t.featured,
      sortOrder: t.sortOrder,
      linkTarget: 'legacy',
      legacyUrl: t.legacyUrl,
      subtitle: t.subtitle,
      description: t.description,
      periodTag: t.heroTags.period,
      departureTag: t.heroTags.departure,
      limitedNote: t.limitedNote,
      featuredImage,
      cardArt,
      startDate: t.startDate,
      endDate: t.endDate,
      nights: t.nights,
      periodText: t.periodText,
      departureCity: t.departureCity,
      departureAirport: t.departureAirport,
      accommodation: t.accommodation,
      baggage: t.baggage,
      regions: t.regions,
      countries: t.countries,
      cities: t.cities,
      sanctuaries: t.sanctuaries,
      guides,
      guidance: { ...t.guidance, points: t.guidance.points.map((text: string) => ({ text })) },
      highlights: t.highlights,
      gallery: { eyebrow: t.gallery.eyebrow, heading: t.gallery.heading, items: galleryItems },
      itinerary: t.itinerary.map((d: any) => ({
        day: d.day,
        dateLabel: d.dateLabel,
        route: d.route,
        description: d.paragraphs.join('\n\n'),
      })),
      packageSummary: t.packageSummary,
      included: { title: t.included.title, items: t.included.items.map((text: string) => ({ text })) },
      notIncluded: { title: t.notIncluded.title, items: t.notIncluded.items.map((text: string) => ({ text })) },
      observations: { heading: t.observations.heading, paragraphs: t.observations.paragraphs },
      pricing: {
        showPrices: false,
        currency: t.pricing.currency,
        totalOriginalCurrency: t.pricing.totalOriginalCurrency,
        totalBrl: t.pricing.totalBrl,
        installmentsCount: t.pricing.installmentsCount,
        installmentValueBrl: t.pricing.installmentValueBrl,
        extraInstallments: t.pricing.extraInstallments,
        entryText: t.pricing.entryText,
        entryValueBrl: t.pricing.entryValueBrl,
        exchangeRate: t.pricing.exchangeRate,
        exchangeRateDate: t.pricing.exchangeRateDate,
        conditions: t.pricing.conditions.map((text: string) => ({ text })),
        internalNote: t.pricing.referenceNote,
      },
      pdf,
      whatsappMessage: t.whatsappMessage,
      contact: t.contact
        ? { name: t.contact.name, whatsapp: /^55\d{10,11}$/.test(t.contact.whatsapp) ? t.contact.whatsapp : undefined, email: t.contact.email ?? undefined, validated: false }
        : undefined,
      finalCta: t.finalCta,
      seo: { title: t.seo.title, description: t.seo.description },
      legacyNumber: t.legacyNumber,
      legacyWpSlug: t.legacyWpSlug,
      reviewNotes: notesFor(t.slug),
    })
    payload.logger.info(`Roteiro ${String(t.legacyNumber).padStart(2)} ${t.slug}: ${result}`)
  }
}

async function seedPending(payload: Payload) {
  for (const p of pending) {
    const cardArt = await upsertMedia(payload, p.cardArt, `Arte de divulgação: ${p.title}`)
    const pdf = await upsertDocument(payload, p.pdf, `Roteiro ${p.title} (pendente)`)
    const guides = []
    for (const g of p.guides) guides.push({ guide: await upsertGuide(payload, g), role: g.role })
    const result = await upsertTrip(payload, {
      title: p.title,
      slug: `pendente-${p.key}`,
      status: 'rascunho',
      featured: false,
      sortOrder: 900,
      linkTarget: 'internal',
      subtitle: p.subtitle,
      description: p.description ?? p.subtitle,
      startDate: p.startDate ?? undefined,
      endDate: p.endDate ?? undefined,
      periodText: p.periodText ?? undefined,
      departureCity: p.departureCity ?? undefined,
      countries: p.countries,
      cardArt,
      featuredImage: cardArt,
      pdf,
      guides,
      reviewNotes: [
        { text: `[pendente] ${p.pendingNote}` },
        { text: `[origem] ${p.source}` },
      ],
    })
    payload.logger.info(`Pendente ${p.key}: ${result}`)
  }
}

async function seedSettings(payload: Payload) {
  await payload.updateGlobal({ slug: 'site-settings', data: {}, context: ctx })
  const instagram = await payload.findGlobal({ slug: 'instagram' })
  if (!instagram.fallbackPosts?.length) {
    // Publicações reais do perfil, exibidas no site original (outubro/2026).
    await payload.updateGlobal({
      slug: 'instagram',
      context: ctx,
      data: {
        handle: 'vialuminaviagens',
        bio: 'Uma marca do Grupo Arbo, com 40 anos de história no turismo.\nCaminhos de Fé, Experiência e Propósito com Deus.',
        fallbackPosts: [
          { permalink: 'https://www.instagram.com/p/DeNR1s_Fyjj/', caption: '✈️ Embarque com a Via Lumina: Roteiro Itália e Portugal! Participe dessa peregrinação com saída de São Paulo em outubro de 2027.' },
          { permalink: 'https://www.instagram.com/reel/DeKHs1_D6_U/', caption: 'Este é um convite muito especial do Padre José Tito Lívio a você: 13 Dias de Fé e Devoção: Roteiro Santuários Marianos!' },
          { permalink: 'https://www.instagram.com/reel/Dd8_h40DAjz/', caption: 'Fé, Cultura e Contemplação no Coração do México! Ouça o chamado do Frei José Adriano, participe dessa peregrinação com saída de Recife em março de 2028.' },
          { permalink: 'https://www.instagram.com/p/Dd8kIEAlyVD/', caption: 'Prevenção que salva vidas 💗 Outubro é o mês dedicado à conscientização sobre a importância da prevenção e do cuidado com a saúde da mulher.' },
        ],
      },
    })
  }
}

async function seedAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    payload.logger.warn('SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD ausentes: nenhum administrador criado.')
    return
  }
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
  if (totalDocs) return
  await payload.create({ collection: 'users', data: { email, password, name: 'Administrador', roles: ['admin'] }, context: ctx })
  payload.logger.info(`Administrador criado: ${email}`)
}

const payload = await getPayload({ config })
await seedAdmin(payload)
await seedSettings(payload)
await seedTrips(payload)
await seedPending(payload)
payload.logger.info('Seed concluído.')
process.exit(0)
