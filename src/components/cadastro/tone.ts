/**
 * Identidade visual de cada cadastro. As três páginas tinham o mesmo azul, o que fazia parecerem a mesma página:
 * cada público ganha um fundo próprio (hero e formulário) e uma cor de apoio nos ícones.
 * As classes ficam escritas por extenso para o Tailwind encontrá-las.
 */
export type LandingTone = 'padres' | 'agencias' | 'peregrinos'

export const TONES: Record<LandingTone, { hero: string; form: string; chip: string; badge: string; label: string }> = {
  // Vinho: cor litúrgica, para o público sacerdotal.
  padres: {
    hero: 'bg-[linear-gradient(160deg,#2a0d1b_0%,#4a1530_50%,#5e1d3b_80%,#2b0f1e_100%)]',
    form: 'bg-[linear-gradient(160deg,#2a0d1b_0%,#4a1530_55%,#5e1d3b_100%)]',
    chip: 'bg-[#f6e6ec] text-[#5e1d3b]',
    badge: 'border-[#e7b8c9]/50 bg-[#5e1d3b]/60',
    label: 'Cadastro para padres',
  },
  // Verde-petróleo: parceria comercial, para agências.
  agencias: {
    hero: 'bg-[linear-gradient(160deg,#03212a_0%,#0a3f4a_50%,#0d5260_80%,#04262e_100%)]',
    form: 'bg-[linear-gradient(160deg,#03212a_0%,#0a3f4a_55%,#0d5260_100%)]',
    chip: 'bg-[#dcefef] text-[#0d5260]',
    badge: 'border-[#9fd3d6]/50 bg-[#0d5260]/60',
    label: 'Cadastro para agências',
  },
  // Azul institucional: o cadastro do cliente (peregrino), a porta principal do site.
  peregrinos: {
    hero: 'bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_50%,#0d3568_80%,#071f42_100%)]',
    form: 'bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_55%,#0d3568_100%)]',
    chip: 'bg-gold-100 text-gold-700',
    badge: 'border-gold-300/50 bg-navy-900/60',
    label: 'Cadastro de clientes · Peregrinos',
  },
}
