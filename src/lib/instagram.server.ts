import 'server-only'
import { getInstagramSettings } from './settings.server'
import { toImage, type ImageData } from './trip-model'

export type InstagramPost = { id: string; permalink: string; caption: string; image: ImageData | null; isVideo: boolean }

type ApiMedia = { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string }

/**
 * Publicações do perfil oficial via API do Instagram (Instagram Login, token de longa duração).
 * Sem token ou em caso de falha, usa as publicações de reserva cadastradas no CMS.
 * Nunca faz scraping da página do Instagram.
 */
export async function getInstagramFeed(): Promise<{ source: 'api' | 'fallback'; posts: InstagramPost[] }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (token) {
    try {
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=8&access_token=${encodeURIComponent(token)}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const json = (await res.json()) as { data?: ApiMedia[] }
        const posts = (json.data ?? []).map((m) => {
          const src = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url
          return {
            id: m.id,
            permalink: m.permalink,
            caption: m.caption ?? '',
            isVideo: m.media_type === 'VIDEO',
            image: src ? { url: src, alt: (m.caption ?? 'Publicação da Via Lumina no Instagram').slice(0, 120), width: 1080, height: 1080, focalX: 50, focalY: 50 } : null,
          }
        })
        if (posts.length) return { source: 'api', posts }
      }
    } catch {
      // Segue para o conteúdo de reserva.
    }
  }
  const settings = await getInstagramSettings()
  return {
    source: 'fallback',
    posts: (settings.fallbackPosts ?? []).map((p, i) => ({
      id: p.id ?? String(i),
      permalink: p.permalink,
      caption: p.caption ?? '',
      isVideo: p.permalink.includes('/reel/'),
      image: toImage(p.image, p.caption ?? ''),
    })),
  }
}
