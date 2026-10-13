import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { LEGACY_REDIRECTS } from './src/lib/legacy-redirects'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS só faz sentido (e só é seguro) quando o site é servido em HTTPS.
  ...((process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://') ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Só WebP: o AVIF leva de 2 a 5 s para ser gerado na primeira visita a cada imagem/tamanho (WebP: ~0,2 s) e as imagens-fonte já são WebP.
    formats: ['image/webp'],
    // Sem as larguras 2048 e 3840: ninguém precisa delas e cada uma é uma conversão pesada a mais.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Imagens do site mudam raramente; evita reconverter a cada 4 h (padrão).
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [70, 75, 80],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/assets/**' }],
    remotePatterns: [
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
  async redirects() {
    // A barra final ("/pagina/") é removida antes pelo próprio Next (308), então basta a forma sem barra.
    return LEGACY_REDIRECTS.map(({ source, destination }) => ({ source, destination, permanent: true }))
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
