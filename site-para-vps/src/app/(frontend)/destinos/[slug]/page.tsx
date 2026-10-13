import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TrackOnMount } from '@/components/analytics/Analytics'
import { JsonLd } from '@/components/seo/JsonLd'
import { Gallery } from '@/components/trips/Gallery'
import { ItineraryTimeline } from '@/components/trips/ItineraryTimeline'
import { RelatedTrips } from '@/components/trips/RelatedTrips'
import { TripSubNav } from '@/components/trips/TripSubNav'
import {
  ArboBand,
  GuideFeature,
  Highlights,
  PackageDetails,
  PricingAndTerms,
  TripCta,
  TripFacts,
  TripHero,
} from '@/components/trips/TripSections'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDateRange } from '@/lib/format'
import { getSiteSettings } from '@/lib/settings.server'
import { absoluteUrl } from '@/lib/site-url'
import { getPublicTripSlugs, getRelatedTrips, getTripBySlug } from '@/lib/trips.server'
import { tripWhatsappMessage, whatsappUrl } from '@/lib/whatsapp'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    return (await getPublicTripSlugs()).map(({ slug }) => ({ slug }))
  } catch {
    // Sem banco no build: as páginas são geradas sob demanda.
    return []
  }
}

export async function generateMetadata({ params }: PageProps<'/destinos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) return { title: 'Peregrinação não encontrada' }
  const image = trip.seo.image ?? trip.image
  const description = trip.seo.description || trip.description || `${trip.title}: ${formatDateRange(trip.startDate, trip.endDate)}.`
  return {
    title: trip.seo.title || trip.title,
    description,
    alternates: { canonical: trip.internalHref },
    openGraph: {
      type: 'website',
      title: trip.title,
      description,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    robots: trip.status === 'encerrado' ? { index: false, follow: true } : undefined,
  }
}

export default async function TripPage({ params }: PageProps<'/destinos/[slug]'>) {
  const { slug } = await params
  const [trip, settings] = await Promise.all([getTripBySlug(slug), getSiteSettings()])
  if (!trip) notFound()
  const related = await getRelatedTrips(trip)

  const phone = trip.contact?.whatsapp ?? settings.whatsapp
  const message = trip.whatsappMessage || tripWhatsappMessage(trip)
  const wa = whatsappUrl(phone, message)
  const contactHref = `/contato?roteiro=${encodeURIComponent(trip.slug)}#formulario`

  const sections = [
    { id: 'resumo', label: 'Resumo' },
    ...(trip.guideProfiles.length ? [{ id: 'acompanhamento', label: 'Acompanhamento' }] : []),
    ...(trip.highlights.cards.length ? [{ id: 'destaques', label: 'Destaques' }] : []),
    ...(trip.gallery.items.length ? [{ id: 'galeria', label: 'Galeria' }] : []),
    ...(trip.itinerary.length ? [{ id: 'programacao', label: 'Programação' }] : []),
    { id: 'pacote', label: 'O que inclui' },
    { id: 'valores', label: 'Valores' },
    { id: 'contato-roteiro', label: 'Contato' },
  ]

  return (
    <>
      <TrackOnMount event="view_trip" params={{ trip: trip.slug }} />
      <TripSubNav sections={sections} whatsappHref={wa} tripSlug={trip.slug} />
      <TripHero trip={trip} whatsappHref={wa} />
      {trip.status === 'encerrado' ? (
        <div role="status" className="bg-gold-100 py-4 text-center font-label text-sm font-semibold text-navy-900">
          Esta peregrinação foi encerrada. Conheça as próximas saídas em{' '}
          <Link href="/destinos" className="underline">
            Destinos
          </Link>
          .
        </div>
      ) : null}
      <TripFacts trip={trip} />
      <GuideFeature trip={trip} />
      <Highlights trip={trip} />

      {trip.gallery.items.length ? (
        <section id="galeria" aria-labelledby="galeria-titulo" className="scroll-mt-36 bg-cream-50 py-20 sm:py-24">
          <div className="container-site">
            <Reveal className="mb-12">
              <SectionHeading id="galeria-titulo" eyebrow={trip.gallery.eyebrow || 'Galeria'} title={trip.gallery.heading || trip.title} />
            </Reveal>
            <Gallery items={trip.gallery.items} />
          </div>
        </section>
      ) : null}

      {trip.itinerary.length ? (
        <section id="programacao" aria-labelledby="programacao-titulo" className="scroll-mt-36 bg-cream-50 pt-4 pb-20 sm:pb-24">
          <div className="container-site max-w-4xl!">
            <Reveal className="mb-10">
              <SectionHeading id="programacao-titulo" eyebrow="Programação completa" title="Dia a dia da peregrinação" />
            </Reveal>
            <ItineraryTimeline days={trip.itinerary} />
          </div>
        </section>
      ) : null}

      <PackageDetails trip={trip} />
      <PricingAndTerms trip={trip} whatsappHref={wa} />
      <ArboBand />
      <TripCta trip={trip} whatsappHref={wa} contactHref={contactHref} />
      <RelatedTrips trips={related} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: trip.title,
          description: trip.description,
          url: absoluteUrl(trip.internalHref),
          image: trip.image ? absoluteUrl(trip.image.url) : undefined,
          touristType: 'Peregrinação religiosa',
          provider: { '@id': absoluteUrl('/#organizacao') },
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: trip.itinerary.length,
            itemListElement: trip.itinerary.map((d) => ({ '@type': 'ListItem', position: d.day, name: `Dia ${d.day}: ${d.route}`, description: d.paragraphs.join(' ') })),
          },
          subjectOf: {
            '@type': 'Event',
            name: trip.title,
            startDate: trip.startDate,
            endDate: trip.endDate,
            eventStatus: trip.status === 'encerrado' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
            location: trip.cities.length ? trip.cities.map((c) => ({ '@type': 'Place', name: c })) : undefined,
            ...(trip.price?.totalBrl
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: trip.price.totalBrl,
                    priceCurrency: 'BRL',
                    availability: trip.status === 'esgotado' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
                    url: absoluteUrl(trip.internalHref),
                  },
                }
              : {}),
          },
        }}
      />
    </>
  )
}
