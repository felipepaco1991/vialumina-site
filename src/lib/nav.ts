export const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/destinos', label: 'Destinos' },
  { href: '/nossa-historia', label: 'Nossa História' },
  { href: '/contato', label: 'Contato' },
] as const

/** Menu "Promoções": página geral + uma página por promoção. */
export const PROMOTION_ITEMS = [
  { href: '/promocoes', path: '/promocoes', label: 'Todas as promoções' },
  { href: '/promocoes/trivva', path: '/promocoes/trivva', label: 'Trivva — viagem de férias' },
  { href: '/promocoes/crescer', path: '/promocoes/crescer', label: '30º Crescer — Família Católica' },
] as const

/** Menu "Parcerias" (padres e agências) e destaque "Cadastre-se" (peregrinos). */
export const PARTNERSHIP_ITEMS = [
  { href: '/cadastro/padres?origem=menu', path: '/cadastro/padres', label: 'Para Padres' },
  { href: '/cadastro/agencias?origem=menu', path: '/cadastro/agencias', label: 'Para Agências' },
] as const
export const SIGNUP_ITEM = { href: '/cadastro/peregrinos?origem=menu', path: '/cadastro/peregrinos', label: 'Cadastre-se' } as const

/** Links dos cadastros no rodapé. */
export const SIGNUP_LINKS = [
  { href: '/cadastro/peregrinos?origem=rodape', label: 'Cadastro de peregrinos' },
  { href: '/cadastro/padres?origem=rodape', label: 'Seja um padre parceiro' },
  { href: '/cadastro/agencias?origem=rodape', label: 'Seja uma agência parceira' },
] as const
