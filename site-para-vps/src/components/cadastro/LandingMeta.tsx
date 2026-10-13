import { TrackOnMount } from '@/components/analytics/Analytics'
import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl } from '@/lib/site-url'
import type { AnalyticsEvent } from '@/lib/analytics'

/** Evento de visualização da landing page + dados estruturados da página. */
export function LandingMeta({ event, path, name, description }: { event: AnalyticsEvent; path: string; name: string; description: string }) {
  return (
    <>
      <TrackOnMount event={event} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name, description, url: absoluteUrl(path), inLanguage: 'pt-BR', isPartOf: { '@id': absoluteUrl('/#organizacao') } }} />
    </>
  )
}
