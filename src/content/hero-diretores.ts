/**
 * Banners da Hero com a direção espiritual em destaque (a pessoa à direita, nome e função embaixo,
 * sobre uma foto do destino). Chave = slug da peregrinação. Sem entrada aqui, o banner usa a arte
 * de divulgação ao lado do texto.
 *
 * - `photo`: recorte (fundo transparente) da cabeça à cintura, com o tronco já estendido para baixo,
 *   de modo que a figura chegue ao pé do banner (a faixa de nome cobre a emenda).
 * - `background`: foto de fundo do banner (16:9, luz de fim de tarde).
 * - `parish`: linhas da paróquia (opcional). Nome e função vêm do roteiro no CMS.
 */
export type HeroDirector = {
  photo: { src: string; width: number; height: number }
  background: { src: string; alt: string }
  parish?: string[]
}

export const HERO_DIRECTORS: Record<string, HeroDirector> = {
  'europa-sagrada': {
    photo: {
      src: '/assets/acompanhantes/padre-marcos-fernando-banner.webp',
      width: 1280,
      height: 1654,
    },
    background: {
      src: '/assets/destinos/europa-sagrada/banner-fundo.webp',
      alt: 'Basílica de São Pedro, no Vaticano, ao entardecer',
    },
    parish: ['Paróquia Cristo Rei', 'Celândia Sul'],
  },
}
