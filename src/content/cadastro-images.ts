/**
 * Imagens de destaque (hero) das landing pages de cadastro.
 *
 * `ai`: fotografia gerada por IA (arquivo a ser adicionado em public/assets/cadastro/, ver docs/cadastros-e-parcerias.md,
 * com os prompts). Enquanto o arquivo não existir, a página usa `fallback`, uma fotografia do acervo original da Via Lumina.
 * Imagens de IA são exibidas com a legenda "Imagem ilustrativa criada por inteligência artificial" e nunca são
 * apresentadas como sacerdotes parceiros, clientes ou viagens reais.
 */
export type LandingImageSpec = {
  ai: { src: string; alt: string }
  fallback: { src: string; alt: string; position?: string }
}

export const LANDING_IMAGES = {
  padres: {
    ai: { src: '/assets/cadastro/padres-hero.webp', alt: 'Ilustração criada por inteligência artificial: sacerdote católico no interior de uma igreja tradicional, em atmosfera serena' },
    fallback: { src: '/assets/destinos/portugal-e-franca/galeria-01-santuario-de-fatima.webp', alt: 'Vista aérea do Santuário de Fátima, em Portugal', position: '40% 50%' },
  },
  agencias: {
    ai: { src: '/assets/cadastro/agencias-hero.webp', alt: 'Ilustração criada por inteligência artificial: consultores de turismo analisando roteiros em um notebook, em escritório contemporâneo' },
    fallback: { src: '/assets/destinos/portugal-italia-vaticano/hero.webp', alt: 'Basílica de São Pedro e a cidade do Vaticano', position: '55% 40%' },
  },
  peregrinos: {
    ai: { src: '/assets/cadastro/peregrinos-hero.webp', alt: 'Ilustração criada por inteligência artificial: peregrinos adultos de diferentes idades diante de um santuário, em luz natural' },
    fallback: { src: '/assets/institucional/quem-somos.webp', alt: 'Peregrina fotografa a Basílica de São Pedro, no Vaticano', position: 'center' },
  },
} as const satisfies Record<string, LandingImageSpec>
export type LandingImageKey = keyof typeof LANDING_IMAGES
