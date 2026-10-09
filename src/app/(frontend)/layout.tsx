import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Analytics } from '@/components/analytics/Analytics'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { JsonLd } from '@/components/seo/JsonLd'
import { RevealObserver } from '@/components/ui/RevealObserver'
import { getSiteSettings } from '@/lib/settings.server'
import { SITE_URL, absoluteUrl } from '@/lib/site-url'
import { whatsappUrl } from '@/lib/whatsapp'
import { lato, montserrat, playfair } from '@/styles/fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Via Lumina Viagens · Peregrinação e Turismo Religioso',
    template: '%s | Via Lumina Viagens',
  },
  description:
    'Peregrine com a Via Lumina Viagens: caminhos de fé, experiência e propósito com Deus. Roteiros para os lugares mais sagrados do Cristianismo, com guia espiritual e suporte 24 horas.',
  applicationName: 'Via Lumina Viagens',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Via Lumina Viagens',
    images: [{ url: '/assets/home/hero-banner-topo.webp', width: 2400, height: 1205, alt: 'Via Lumina Viagens' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/logos/favicon-via-lumina.png', apple: '/assets/logos/favicon-via-lumina-alta.webp' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = { themeColor: '#0a2e5c', width: 'device-width', initialScale: 1 }

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)
  const a = settings.address

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${playfair.variable} ${lato.variable} ${montserrat.variable}`}>
      <head>
        {/* Marca o documento como "com JS" antes da pintura: só então as animações de entrada ocultam o conteúdo. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-navy-900 px-5 py-3 font-label text-sm font-semibold text-white transition focus:translate-y-0"
        >
          Ir para o conteúdo
        </a>
          <Header
            whatsappHref={wa}
            whatsappDisplay={settings.whatsappDisplay ?? ''}
            phoneHref={`tel:+${settings.phone}`}
            phoneDisplay={settings.phoneDisplay ?? ''}
          />
          <main id="conteudo">{children}</main>
          <Footer settings={settings} />
          <WhatsAppFloat href={wa} />
          <Analytics gtmId={settings.gtmId} ga4Id={settings.ga4Id} />
          <RevealObserver />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            '@id': `${SITE_URL}/#organizacao`,
            name: 'Via Lumina Viagens',
            alternateName: 'Via Lumina – Viagens de Fé',
            url: SITE_URL,
            logo: absoluteUrl('/assets/logos/via-lumina-logo.png'),
            image: absoluteUrl('/assets/home/hero-banner-topo.webp'),
            description: 'Operadora especializada em turismo religioso e peregrinações, marca do Grupo Arbo.',
            telephone: settings.phoneDisplay,
            email: settings.email,
            address: a
              ? {
                  '@type': 'PostalAddress',
                  streetAddress: [a.street, a.complement].filter(Boolean).join(', '),
                  addressLocality: a.city,
                  addressRegion: a.state,
                  postalCode: a.zip,
                  addressCountry: 'BR',
                }
              : undefined,
            parentOrganization: { '@type': 'Organization', name: 'Grupo Arbo', url: settings.grupoArboUrl },
            sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean),
            contactPoint: [{ '@type': 'ContactPoint', telephone: settings.whatsappDisplay, contactType: 'customer service', areaServed: 'BR', availableLanguage: 'Portuguese' }],
          }}
        />
      </body>
    </html>
  )
}
