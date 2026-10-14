import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site-url'
import { getPublicTripSlugs } from '@/lib/trips.server'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['/', '/destinos', '/quem-somos', '/nossa-historia', '/contato', '/cadastro', '/cadastro/padres', '/cadastro/agencias', '/cadastro/formadores', '/promocoes', '/promocoes/trivva', '/promocoes/crescer', '/politica-de-privacidade'].map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: p === '/destinos' ? ('weekly' as const) : ('monthly' as const),
    priority: p === '/' ? 1 : p === '/destinos' ? 0.9 : 0.6,
  }))
  let trips: MetadataRoute.Sitemap = []
  try {
    trips = (await getPublicTripSlugs()).map((t) => ({ url: absoluteUrl(`/destinos/${t.slug}`), lastModified: t.updatedAt, changeFrequency: 'weekly', priority: 0.8 }))
  } catch {
    // Banco indisponível: mantém ao menos as páginas institucionais.
  }
  return [...pages, ...trips]
}
