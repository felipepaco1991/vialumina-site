/**
 * Promoções e parcerias divulgadas pelo site (menu "Promoções", banners da home e páginas /promocoes/*).
 * Links externos e datas vêm dos próprios parceiros; confirme-os com eles antes de alterar.
 */

export const TRIVVA_SIGNUP_URL = 'https://trivva.com.br/cadastro-via-lumina'

export const CRESCER = {
  name: '30º Crescer',
  fullName: 'Encontro Nacional da Família Católica',
  tagline: 'Ame sua família, encontre a paz.',
  dates: '5 a 9 de fevereiro de 2027',
  place: 'Campina Grande (PB)',
  organizer: 'Comunidade de São Pio X',
  siteUrl: 'https://encontrodafamiliacatolica.com.br/',
  signupUrl: 'https://encontrodafamiliacatolica.com.br/inscricao/',
  caravansUrl: 'https://encontrodafamiliacatolica.com.br/caravanas/',
  lodgingUrl: 'https://encontrodafamiliacatolica.com.br/hospedagens/',
  programUrl: 'https://encontrodafamiliacatolica.com.br/programacao/',
  banner: {
    src: '/assets/promocoes/crescer-banner.webp',
    width: 1920,
    height: 640,
    color: '#360076',
  },
  bannerAlt:
    '30 anos do Crescer, Encontro Nacional da Família Católica — 5 a 9 de fevereiro de 2027, Campina Grande (PB). Ame sua família, encontre a paz.',
} as const

export const PROMOTIONS = [
  {
    slug: 'trivva',
    path: '/promocoes/trivva',
    label: 'Trivva — viagem de férias',
    eyebrow: 'Parceria Via Lumina + Trivva',
    title: 'Garanta também a sua viagem de férias',
    summary:
      'Inscreva-se em sua peregrinação e garanta também com a nossa parceira Trivva a sua viagem de férias.',
  },
  {
    slug: 'crescer',
    path: '/promocoes/crescer',
    label: '30º Crescer — Família Católica',
    eyebrow: 'Evento católico em Campina Grande (PB)',
    title: `${CRESCER.name} — ${CRESCER.fullName}`,
    summary: `${CRESCER.dates}, em ${CRESCER.place}. Inscrição gratuita no site oficial do encontro.`,
  },
] as const
