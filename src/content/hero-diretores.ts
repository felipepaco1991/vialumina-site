/**
 * Banners da Hero com a direção espiritual em destaque (a pessoa à direita, nome e função embaixo,
 * sobre uma foto do destino). Chave = slug da peregrinação. Sem entrada aqui, o banner usa a arte
 * de divulgação ao lado do texto.
 *
 * Posições são medidas sobre a arte de referência (16:9) e valem em % do banner:
 * - `photo`: recorte da pessoa (fundo transparente), em public/assets/acompanhantes.
 * - `placement`: largura em vw (limitada pela altura em telas menos largas que 16:9), distância do topo
 *   e da direita (negativa = a roupa sai do banner). A figura continua para baixo, atrás da barra do rodapé.
 * - `nameplate`: centro horizontal e distância mínima da base da faixa "Direção espiritual · Nome".
 * - `mobileCrop`: fração da altura do recorte mostrada no celular (a partir do topo). Padrão 1.
 * - `background`: foto de fundo do banner (16:9, luz de fim de tarde) e o ponto de enquadramento.
 * - `parish`: linhas da paróquia (opcional). Nome e função vêm do roteiro no CMS.
 */
export type HeroDirector = {
  photo: { src: string; width: number; height: number }
  placement: { width: number; top: number; right: number }
  nameplate: { x: number; bottom: number }
  mobileCrop?: number
  background: { src: string; alt: string; position?: string }
  parish?: string[]
}

export const HERO_DIRECTORS: Record<string, HeroDirector> = {
  'europa-sagrada': {
    photo: {
      src: '/assets/acompanhantes/padre-marcos-fernando-banner.webp',
      width: 1280,
      height: 1654,
    },
    placement: { width: 39, top: 12, right: 1.5 },
    nameplate: { x: 79, bottom: 9.5 },
    background: {
      src: '/assets/destinos/europa-sagrada/banner-fundo.webp',
      alt: 'Basílica de São Pedro, no Vaticano, ao entardecer',
      position: '62% center',
    },
    parish: ['Paróquia Cristo Rei', 'Celândia Sul'],
  },
  'mexico-guadalupe-cancun-2027': {
    photo: {
      src: '/assets/acompanhantes/padre-fabio-fernandes-banner.webp',
      width: 799,
      height: 1433,
    },
    placement: { width: 45.6, top: 12.5, right: -2 },
    nameplate: { x: 79.2, bottom: 12.9 },
    mobileCrop: 0.66,
    background: {
      src: '/assets/destinos/mexico-guadalupe-cancun-2027/banner-fundo.webp',
      alt: 'Basílica de Nossa Senhora de Guadalupe, na Cidade do México, ao entardecer',
      position: 'center',
    },
  },
  'aparecida-carlos-2027': {
    photo: {
      src: '/assets/acompanhantes/padre-carlos-eduardo-banner.webp',
      width: 1078,
      height: 1404,
    },
    placement: { width: 45.5, top: 10.1, right: 0 },
    nameplate: { x: 80, bottom: 6.8 },
    mobileCrop: 0.74,
    background: {
      src: '/assets/destinos/aparecida-carlos-2027/banner-fundo.webp',
      alt: 'Santuário Nacional de Aparecida ao entardecer',
      position: 'center',
    },
  },
}
