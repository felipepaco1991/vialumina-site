import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/components/layout/PageHero'
import { JsonLd } from '@/components/seo/JsonLd'
import { CatalogFallback } from '@/components/trips/CatalogFallback'
import { TripCatalog } from '@/components/trips/TripCatalog'
import { getSiteSettings } from '@/lib/settings.server'
import { absoluteUrl } from '@/lib/site-url'
import { getListedTrips } from '@/lib/trips.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Destinos · Encontre sua próxima peregrinação',
  description:
    'Explore os roteiros da Via Lumina Viagens e descubra caminhos de fé, espiritualidade e experiências inesquecíveis. Filtre por destino, mês de saída, cidade de embarque e acompanhante espiritual.',
  alternates: { canonical: '/destinos' },
  openGraph: { images: [{ url: '/assets/home/banner-meio-roteiros.webp', width: 2400, height: 1205 }] },
}

export default async function DestinosPage() {
  const [trips, settings] = await Promise.all([getListedTrips(), getSiteSettings()])
  const wa = whatsappUrl(settings.whatsapp, 'Olá! Gostaria de ajuda para escolher uma peregrinação da Via Lumina.')
  return (
    <>
      <PageHero
        image={{ src: '/assets/home/banner-meio-roteiros.webp', alt: 'Basílica de São Pedro e a Ponte Sant’Angelo, em Roma, com os raios dourados da Via Lumina' }}
        eyebrow="Nossas peregrinações"
        title="Encontre sua próxima peregrinação"
        intro="Explore nossos roteiros e descubra caminhos de fé, espiritualidade e experiências inesquecíveis."
        crumbs={[{ label: 'Destinos', href: '/destinos' }]}
      />
      <section className="bg-cream-50 py-14 sm:py-20" aria-label="Catálogo de peregrinações">
        <div className="container-site">
          {/* O HTML estático já traz todos os roteiros (SEO e carregamento rápido);
              no navegador, o catálogo aplica os filtros presentes na URL. */}
          <Suspense fallback={<CatalogFallback trips={trips} />}>
            <TripCatalog trips={trips} whatsappHref={wa} />
          </Suspense>
        </div>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Peregrinações Via Lumina Viagens',
          itemListElement: trips.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(`/destinos/${t.slug}`),
            name: t.title,
          })),
        }}
      />
    </>
  )
}
