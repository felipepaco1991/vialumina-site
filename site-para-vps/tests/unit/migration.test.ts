import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEGACY_REDIRECTS } from '@/lib/legacy-redirects'
import { migratedTrips as trips } from '../fixtures/trips'

/** Tabela do briefing (§7): datas, embarque, acompanhante e URL original de cada roteiro. */
const BRIEFING = [
  ['portugal-e-franca', '2027-10-05', '2027-10-16', 'Brasília', 'Padre Donizete', 'https://vialuminaviagens.com.br/elementor-pagina-899/'],
  ['sao-paulo-aparecida-cancao-nova', '2027-07-11', '2027-07-17', 'Recife', 'Padre Moisés Coelho', 'https://vialuminaviagens.com.br/elementor-pagina-942/'],
  ['mexico-guadalupe-cancun-2027', '2027-04-10', '2027-04-23', 'São Paulo/Guarulhos', 'Padre Fábio Fernandes', 'https://vialuminaviagens.com.br/mexicoguadalupe-e-cancun/'],
  ['rio-de-janeiro-aparecida', '2027-06-16', '2027-06-22', 'Recife', 'Adriana', 'https://vialuminaviagens.com.br/rio-de-janeiro-e-aparecida/'],
  ['portugal-italia-vaticano', '2027-09-21', '2027-10-02', 'Fortaleza', 'Padre Assis Jordão', 'https://vialuminaviagens.com.br/portugal-italia-e-vaticano/'],
  ['santuarios-marianos-brasilia', '2027-10-05', '2027-10-17', 'Brasília', 'Padre João Carlos', 'https://vialuminaviagens.com.br/santuarios-marianos/'],
  ['santuarios-marianos-londrina', '2027-10-15', '2027-10-27', 'Londrina', 'Padre Paulo Sérgio', 'https://vialuminaviagens.com.br/santuarios-marianos-2/'],
  ['aparecida-agosto-2027', '2027-08-10', '2027-08-16', 'Recife', 'Padre Marcelo Silva', 'https://vialuminaviagens.com.br/elementor-pagina-1071/'],
  ['europa-sagrada', '2027-09-15', '2027-10-01', 'Brasília', 'Padre Marcos Fernando', 'https://vialuminaviagens.com.br/europa-sagrada/'],
  ['santuarios-italianos', '2027-11-08', '2027-11-19', 'Recife', 'Padre Thiago Bispo', 'https://vialuminaviagens.com.br/santuarios-italianos-2/'],
  ['aparecida-carlos-2027', '2027-05-13', '2027-05-19', 'Recife', 'Padre Carlos Eduardo', 'https://vialuminaviagens.com.br/aparecida-do-norte-carlos/'],
  ['santuarios-marianos-tito', '2027-10-13', '2027-10-28', 'Aracaju', 'Padre Tito Simão', 'https://vialuminaviagens.com.br/santuarios-marianos-tito/'],
  ['mexico-guadalupe-cancun-2028', '2028-03-15', '2028-03-27', 'Recife', 'Frei José Adriano, O.Carm.', 'https://vialuminaviagens.com.br/mexico-guadalupe-e-cancun/'],
  ['egito-terra-santa', '2028-01-10', '2028-01-25', 'São Paulo/Guarulhos', 'Padre Paulo Júnior', 'https://vialuminaviagens.com.br/egito-e-terra-santa/'],
] as const

describe('roteiros migrados × briefing', () => {
  it('contém exatamente os 14 roteiros, com slugs únicos', () => {
    expect(trips).toHaveLength(14)
    expect(new Set(trips.map((t) => t.slug)).size).toBe(14)
    expect(trips.map((t) => t.slug)).toEqual(BRIEFING.map((b) => b[0]))
  })

  it.each(BRIEFING)('%s confere com o briefing', (slug, start, end, departure, guide, legacyUrl) => {
    const t = trips.find((x) => x.slug === slug)!
    expect(t.startDate).toBe(start)
    expect(t.endDate).toBe(end)
    expect(t.departureCity).toBe(departure)
    expect(t.guides[0].name).toBe(guide)
    expect(t.legacyUrl).toBe(legacyUrl)
  })

  it('preserva a função de cada acompanhante', () => {
    expect(trips.find((t) => t.slug === 'rio-de-janeiro-aparecida')!.guides[0].role).toBe('Formadora')
    expect(trips.find((t) => t.slug === 'egito-terra-santa')!.guides.map((g) => `${g.name}: ${g.role}`)).toEqual([
      'Padre Paulo Júnior: Direção espiritual',
      'Dinéia: Formação e acompanhamento',
    ])
  })
})

describe('conteúdo integral', () => {
  const full = JSON.parse(fs.readFileSync(path.resolve('migration/data/trips.json'), 'utf8')) as Array<{
    slug: string
    days: number
    itinerary: { day: number; paragraphs: string[] }[]
    included: { items: string[] }
    notIncluded: { items: string[] }
    observations: { paragraphs: unknown[] }
    pdf: string | null
    featuredImage: string
    gallery: { items: { image: string }[] }
    guides: { photo: string | null }[]
  }>

  it.each(full.map((t) => [t.slug, t] as const))('%s tem programação dia a dia completa', (_slug, t) => {
    expect(t.itinerary).toHaveLength(t.days)
    t.itinerary.forEach((d, i) => {
      expect(d.day).toBe(i + 1)
      expect(d.paragraphs.join('').length).toBeGreaterThan(20)
    })
    expect(t.included.items.length).toBeGreaterThan(3)
    expect(t.notIncluded.items.length).toBeGreaterThan(3)
    expect(t.observations.paragraphs.length).toBeGreaterThan(0)
  })

  it('todos os arquivos referenciados existem localmente', () => {
    for (const t of full) {
      const files = [t.featuredImage, t.pdf, ...t.gallery.items.map((g) => g.image), ...t.guides.map((g) => g.photo)].filter(Boolean) as string[]
      for (const f of files) expect(fs.existsSync(path.join('public', f)), `${t.slug}: ${f}`).toBe(true)
    }
  })
})

describe('manifesto de mídia', () => {
  const manifest = JSON.parse(fs.readFileSync(path.resolve('migration/asset-manifest.json'), 'utf8')) as {
    files: { path: string; sha256: string; originalUrl: string; optimized?: { path: string } }[]
    failures: unknown[]
  }
  it('registra a origem de cada arquivo e não tem falhas', () => {
    expect(manifest.failures).toEqual([])
    for (const f of manifest.files) expect(f.originalUrl).toMatch(/^https:\/\/vialuminaviagens\.com\.br\/wp-content\//)
  })
  it('arquivos íntegros e sem duplicatas binárias', () => {
    const hashes = new Set<string>()
    for (const f of manifest.files) {
      const buf = fs.readFileSync(path.join('public', f.path))
      expect(crypto.createHash('sha256').update(buf).digest('hex')).toBe(f.sha256)
      expect(hashes.has(f.sha256)).toBe(false)
      hashes.add(f.sha256)
      if (f.optimized) expect(fs.existsSync(path.join('public', f.optimized.path))).toBe(true)
    }
  })
})

describe('redirecionamentos das URLs antigas', () => {
  it.each(BRIEFING)('%s ← URL original', (slug, _s, _e, _d, _g, legacyUrl) => {
    const source = new URL(legacyUrl).pathname.replace(/\/$/, '')
    expect(LEGACY_REDIRECTS.find((r) => r.source === source)?.destination).toBe(`/destinos/${slug}`)
  })
})
