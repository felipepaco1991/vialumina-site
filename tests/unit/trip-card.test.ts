import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TripCard } from '@/components/trips/TripCard'
import type { ImageData, TripCardData } from '@/lib/trip-model'
import { cardFixtures } from '../fixtures/trips'

const img = (url: string, width: number, height: number): ImageData => ({ url, alt: url, width, height, focalX: 50, focalY: 50 })
const render = (trip: TripCardData, props: Record<string, unknown> = {}) => renderToStaticMarkup(createElement(TripCard, { trip, ...props }))

describe('TripCard: arte de divulgação', () => {
  const base = cardFixtures[0]!

  it('exibe a arte inteira, na proporção original, sem selos sobrepostos', () => {
    const html = render({ ...base, image: img('/api/media/file/foto.webp', 1600, 1000), cardArt: img('/api/media/file/arte.webp', 2048, 2560) })
    expect(html).toContain('arte.webp')
    expect(html).not.toContain('foto.webp')
    expect(html).toContain('aspect-ratio:2048 / 2560')
    expect(html).not.toContain('aspect-[4/3]')
    expect(html).not.toContain('Saída de')
  })

  it('mantém o selo de situação fora da arte', () => {
    const html = render({ ...base, status: 'esgotado', cardArt: img('/api/media/file/arte.webp', 1080, 1350) })
    expect(html).toContain('Esgotado')
  })

  it('sem arte, usa a fotografia principal como antes', () => {
    const html = render({ ...base, image: img('/api/media/file/foto.webp', 1600, 1000), cardArt: null })
    expect(html).toContain('foto.webp')
    expect(html).toContain('aspect-[4/3]')
  })

  it('variante de destaque também mostra a arte', () => {
    const html = render({ ...base, cardArt: img('/api/media/file/arte.webp', 1080, 1350) }, { variant: 'feature' })
    expect(html).toContain('arte.webp')
    expect(html).toContain('lg:w-[42%]')
  })
})
