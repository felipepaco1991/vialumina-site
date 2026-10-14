export const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/destinos', label: 'Destinos' },
  { href: '/nossa-historia', label: 'Nossa História' },
] as const

/** Último item do menu, logo antes do botão de WhatsApp. */
export const CONTACT_ITEM = { href: '/contato', label: 'Contato' } as const

/** Menu "Parcerias": empresas parceiras e suas promoções (página geral + uma página por parceria). */
export const PARTNERSHIP_ITEMS = [
  { href: '/promocoes', path: '/promocoes', label: 'Todas as promoções' },
  { href: '/promocoes/trivva', path: '/promocoes/trivva', label: 'Trivva — viagem de férias' },
  { href: '/promocoes/crescer', path: '/promocoes/crescer', label: '30º Crescer — Família Católica' },
] as const

/** Menu "Cadastre-se" (cabeçalho e rodapé): um cadastro para cada público. `origem` é gravada no cadastro. */
export const signupItems = (origem: 'menu' | 'rodape') =>
  [
    { href: `/contato?cadastro=1&origem=${origem}`, path: '/cadastro/peregrinos', label: 'Cadastro de peregrinos' },
    { href: `/cadastro/padres?origem=${origem}`, path: '/cadastro/padres', label: 'Seja um padre parceiro' },
    { href: `/cadastro/agencias?origem=${origem}`, path: '/cadastro/agencias', label: 'Seja uma agência parceira' },
    { href: `/cadastro/formadores?origem=${origem}`, path: '/cadastro/formadores', label: 'Seja um formador de grupo' },
  ] as const
