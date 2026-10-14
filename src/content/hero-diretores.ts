/**
 * Banners da Hero com a direção espiritual em destaque (a pessoa à direita, com luz dourada e nome embaixo).
 * Chave = slug da peregrinação. Sem entrada aqui, o banner usa a arte de divulgação ao lado do texto.
 *
 * `photo` é um recorte (PNG/WebP com fundo transparente) da cabeça à cintura, em public/assets/acompanhantes.
 * O nome e a função vêm do roteiro no CMS (Sacerdotes e acompanhantes); `parish` é opcional.
 */
export type HeroDirector = {
  photo: { src: string; width: number; height: number }
  parish?: string
}

export const HERO_DIRECTORS: Record<string, HeroDirector> = {
  'europa-sagrada': {
    photo: {
      src: '/assets/acompanhantes/padre-marcos-fernando-recorte.webp',
      width: 490,
      height: 860,
    },
    parish: 'Paróquia Cristo Rei · Celândia Sul',
  },
}
