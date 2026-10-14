/**
 * Modelos de visualização das peregrinações (seguros para componentes cliente).
 * Convertidos a partir dos documentos do CMS em trips.server.ts.
 */
import type { Media, Trip } from '@/payload-types'
import type { TripStatus } from './taxonomy'
import { calendarDate, normalizeText, toParagraphs } from './format'

export type ImageData = {
  url: string
  alt: string
  width: number
  height: number
  focalX: number
  focalY: number
}

export type GuideData = { name: string; role: string; photo: ImageData | null; bio: string | null }

export type PriceData = {
  currency: 'BRL' | 'USD' | 'EUR'
  totalOriginalCurrency: number | null
  totalBrl: number | null
  installmentsCount: number | null
  installmentValueBrl: number | null
  extraInstallments: string | null
  entryText: string | null
  exchangeRate: number | null
  exchangeRateDate: string | null
  conditions: string[]
}

export type TripCardData = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  /** Destino do botão "Conheça o roteiro completo". */
  href: string
  external: boolean
  image: ImageData | null
  /** Arte de divulgação (pôster) — a mesma peça exibida nos cards do site Via Lumina. */
  cardArt: ImageData | null
  regions: string[]
  countries: string[]
  cities: string[]
  sanctuaries: string[]
  departureCity: string | null
  startDate: string | null
  endDate: string | null
  days: number | null
  nights: number | null
  guides: { name: string; role: string }[]
  status: TripStatus
  featured: boolean
  sortOrder: number
  /** Somente quando aprovado para exibição. */
  price: PriceData | null
  /** Texto normalizado (sem acentos) usado pela busca. */
  searchText: string
}

export type ItineraryDay = { day: number; dateLabel: string | null; route: string; paragraphs: string[] }

export type TripDetailData = TripCardData & {
  internalHref: string
  legacyUrl: string | null
  periodTag: string | null
  departureTag: string | null
  limitedNote: string | null
  periodText: string | null
  departureAirport: string | null
  accommodation: string | null
  baggage: string | null
  guideProfiles: GuideData[]
  guidance: { eyebrow: string | null; heading: string | null; lead: string | null; points: string[] }
  highlights: { heading: string | null; intro: string | null; cards: { place: string | null; title: string; text: string | null }[] }
  gallery: { eyebrow: string | null; heading: string | null; items: (ImageData & { place: string | null; title: string | null })[] }
  itinerary: ItineraryDay[]
  packageSummary: { heading: string | null; text: string | null; tags: string[] }
  included: { title: string; items: string[] }
  notIncluded: { title: string; items: string[] }
  observations: { heading: string; paragraphs: { text: string; emphasis: boolean }[] }
  /** Condições comerciais sempre exibidas (sem valores), mesmo com preços ocultos. */
  pdf: { url: string; filename: string } | null
  whatsappMessage: string | null
  contact: { name: string; whatsapp: string | null; email: string | null } | null
  finalCta: { kicker: string | null; heading: string; text: string | null }
  seo: { title: string | null; description: string | null; image: ImageData | null }
  updatedAt: string
}

/** URLs de arquivos do CMS como caminhos relativos (servidos pelo próprio site). */
export const relativeFileUrl = (url: string) => url.replace(/^https?:\/\/[^/]+(?=\/api\/(media|documents)\/file\/)/, '')

export function toImage(media: unknown, fallbackAlt = ''): ImageData | null {
  if (!media || typeof media !== 'object') return null
  const m = media as Media
  if (!m.url) return null
  return {
    url: relativeFileUrl(m.url),
    alt: m.alt || fallbackAlt,
    width: m.width ?? 1600,
    height: m.height ?? 1000,
    focalX: m.focalX ?? 50,
    focalY: m.focalY ?? 50,
  }
}

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

function priceOf(trip: Trip): PriceData | null {
  const p = trip.pricing
  if (!p?.showPrices) return null
  return {
    currency: (p.currency ?? 'BRL') as PriceData['currency'],
    totalOriginalCurrency: p.totalOriginalCurrency ?? null,
    totalBrl: p.totalBrl ?? null,
    installmentsCount: p.installmentsCount ?? null,
    installmentValueBrl: p.installmentValueBrl ?? null,
    extraInstallments: p.extraInstallments ?? null,
    entryText: p.entryText ?? null,
    exchangeRate: p.exchangeRate ?? null,
    exchangeRateDate: calendarDate(p.exchangeRateDate),
    conditions: (p.conditions ?? []).map((c) => c.text),
  }
}

const guidesOf = (trip: Trip) =>
  (trip.guides ?? []).flatMap((g) => {
    const person = typeof g.guide === 'object' ? g.guide : null
    return person ? [{ name: person.name, role: g.role, person }] : []
  })

export function toCard(trip: Trip): TripCardData {
  const guides = guidesOf(trip).map(({ name, role }) => ({ name, role }))
  const internal = `/destinos/${trip.slug}`
  const external = trip.linkTarget === 'legacy' && Boolean(trip.legacyUrl)
  const countries = strings(trip.countries)
  const cities = strings(trip.cities)
  const sanctuaries = strings(trip.sanctuaries)
  return {
    id: trip.id,
    slug: trip.slug ?? String(trip.id),
    title: trip.title,
    subtitle: trip.subtitle ?? null,
    description: trip.description ?? null,
    href: external ? trip.legacyUrl! : internal,
    external,
    image: toImage(trip.featuredImage, trip.title),
    cardArt: toImage(trip.cardArt, `Arte de divulgação — ${trip.title}`),
    regions: strings(trip.regions),
    countries,
    cities,
    sanctuaries,
    departureCity: trip.departureCity ?? null,
    startDate: calendarDate(trip.startDate),
    endDate: calendarDate(trip.endDate),
    days: trip.days ?? null,
    nights: trip.nights ?? null,
    guides,
    status: trip.status,
    featured: Boolean(trip.featured),
    sortOrder: trip.sortOrder ?? 100,
    price: priceOf(trip),
    searchText: normalizeText(
      [
        trip.title,
        trip.subtitle,
        trip.description,
        ...countries,
        ...cities,
        ...sanctuaries,
        trip.departureCity,
        ...guides.flatMap((g) => [g.name, g.role]),
        ...(trip.highlights?.cards ?? []).flatMap((c) => [c.place, c.title, c.text]),
      ]
        .filter(Boolean)
        .join(' · '),
    ),
  }
}

export function toDetail(trip: Trip): TripDetailData {
  const card = toCard(trip)
  const pdf = typeof trip.pdf === 'object' && trip.pdf?.url ? { url: relativeFileUrl(trip.pdf.url), filename: trip.pdf.filename ?? 'roteiro.pdf' } : null
  const c = trip.contact
  return {
    ...card,
    internalHref: `/destinos/${card.slug}`,
    legacyUrl: trip.legacyUrl ?? null,
    periodTag: trip.periodTag ?? null,
    departureTag: trip.departureTag ?? null,
    limitedNote: trip.limitedNote ?? null,
    periodText: trip.periodText ?? null,
    departureAirport: trip.departureAirport ?? null,
    accommodation: trip.accommodation ?? null,
    baggage: trip.baggage ?? null,
    guideProfiles: guidesOf(trip).map(({ person, role }) => ({
      name: person.name,
      role,
      photo: toImage(person.photo, `${person.name} — ${role}`),
      bio: person.bio ?? null,
    })),
    guidance: {
      eyebrow: trip.guidance?.eyebrow ?? null,
      heading: trip.guidance?.heading ?? null,
      lead: trip.guidance?.lead ?? null,
      points: (trip.guidance?.points ?? []).map((p) => p.text),
    },
    highlights: {
      heading: trip.highlights?.heading ?? null,
      intro: trip.highlights?.intro ?? null,
      cards: (trip.highlights?.cards ?? []).map((x) => ({ place: x.place ?? null, title: x.title, text: x.text ?? null })),
    },
    gallery: {
      eyebrow: trip.gallery?.eyebrow ?? null,
      heading: trip.gallery?.heading ?? null,
      items: (trip.gallery?.items ?? []).flatMap((it) => {
        const img = toImage(it.image, it.title ?? trip.title)
        return img ? [{ ...img, place: it.place ?? null, title: it.title ?? null }] : []
      }),
    },
    itinerary: (trip.itinerary ?? []).map((d) => ({
      day: d.day,
      dateLabel: d.dateLabel ?? null,
      route: d.route,
      paragraphs: toParagraphs(d.description),
    })),
    packageSummary: {
      heading: trip.packageSummary?.heading ?? null,
      text: trip.packageSummary?.text ?? null,
      tags: strings(trip.packageSummary?.tags),
    },
    included: { title: trip.included?.title ?? 'O preço do pacote inclui', items: (trip.included?.items ?? []).map((i) => i.text) },
    notIncluded: { title: trip.notIncluded?.title ?? 'O preço do pacote não inclui', items: (trip.notIncluded?.items ?? []).map((i) => i.text) },
    observations: {
      heading: trip.observations?.heading ?? 'Observações',
      paragraphs: (trip.observations?.paragraphs ?? []).map((p) => ({ text: p.text, emphasis: Boolean(p.emphasis) })),
    },
    pdf,
    whatsappMessage: trip.whatsappMessage ?? null,
    contact: c?.validated && c.name ? { name: c.name, whatsapp: c.whatsapp ?? null, email: c.email ?? null } : null,
    finalCta: {
      kicker: trip.finalCta?.kicker ?? null,
      heading: trip.finalCta?.heading || 'Quer saber mais sobre esta peregrinação?',
      text: trip.finalCta?.text ?? null,
    },
    seo: {
      title: trip.seo?.title ?? null,
      description: trip.seo?.description ?? null,
      image: toImage(trip.seo?.image),
    },
    updatedAt: trip.updatedAt,
  }
}
