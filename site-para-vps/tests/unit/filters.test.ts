import { describe, expect, it } from 'vitest'
import { EMPTY_FILTERS, activeFilterCount, applyFilters, buildFacets, parseFilters, relevance, serializeFilters, type FilterState } from '@/lib/filters'
import { cardFixtures as trips } from '../fixtures/trips'

const f = (patch: Partial<FilterState>): FilterState => ({ ...EMPTY_FILTERS, ...patch })
const slugs = (s: FilterState) => applyFilters(trips, s).map((t) => t.slug)

describe('busca', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(slugs(f({ q: 'fatima' }))).toEqual(slugs(f({ q: 'FÁTIMA' })))
    expect(slugs(f({ q: 'fatima' }))).toContain('portugal-e-franca')
  })
  it('encontra por sacerdote', () => {
    expect(slugs(f({ q: 'padre tito' }))).toEqual(['santuarios-marianos-tito'])
    expect(slugs(f({ q: 'frei jose' }))).toEqual(['mexico-guadalupe-cancun-2028'])
  })
  it('encontra por cidade e santuário', () => {
    expect(slugs(f({ q: 'medjugorje' }))).toEqual(['santuarios-marianos-londrina'])
    expect(slugs(f({ q: 'cancao nova' })).length).toBeGreaterThanOrEqual(1)
    expect(slugs(f({ q: 'jerusalem' }))).toEqual(['egito-terra-santa'])
  })
  it('exige todos os termos', () => {
    expect(slugs(f({ q: 'fatima medjugorje' }))).toEqual(['santuarios-marianos-londrina'])
    expect(slugs(f({ q: 'cancun lourdes' }))).toEqual([])
  })
  it('pontua o título acima da descrição', () => {
    const egito = trips.find((t) => t.slug === 'egito-terra-santa')!
    expect(relevance(egito, 'egito')).toBeGreaterThan(relevance(egito, 'cristianismo') || 0)
  })
})

describe('filtros combinados', () => {
  it('região Brasil retorna somente roteiros nacionais', () => {
    const r = applyFilters(trips, f({ regiao: ['brasil'] }))
    expect(r.length).toBe(4)
    expect(r.every((t) => t.countries.includes('Brasil'))).toBe(true)
  })
  it('combina região + cidade de embarque (E)', () => {
    expect(slugs(f({ regiao: ['europa'], embarque: ['brasilia'] })).sort()).toEqual(['europa-sagrada', 'portugal-e-franca', 'santuarios-marianos-brasilia'])
  })
  it('valores do mesmo filtro funcionam como OU', () => {
    expect(slugs(f({ embarque: ['londrina', 'aracaju'] })).sort()).toEqual(['santuarios-marianos-londrina', 'santuarios-marianos-tito'])
  })
  it('filtra por mês/ano de saída', () => {
    expect(slugs(f({ mes: ['2028-01'] }))).toEqual(['egito-terra-santa'])
    expect(slugs(f({ mes: ['2027-10'] })).length).toBe(4)
  })
  it('filtra por faixa de duração calculada pelas datas', () => {
    const r = applyFilters(trips, f({ duracao: ['ate-7'] }))
    expect(r.every((t) => (t.days ?? 0) <= 7)).toBe(true)
    expect(r.length).toBe(4)
  })
  it('filtra por acompanhante preservando a função', () => {
    expect(slugs(f({ acompanhante: ['dineia'] }))).toEqual(['egito-terra-santa'])
    const facets = buildFacets(trips, EMPTY_FILTERS)
    expect(facets.acompanhante.find((o) => o.value === 'adriana')?.label).toBe('Adriana · Formadora')
  })
  it('sem resultados quando os critérios não se cruzam', () => {
    expect(slugs(f({ regiao: ['brasil'], pais: ['mexico'] }))).toEqual([])
  })
})

describe('ordenação', () => {
  it('por data de saída', () => {
    const dates = applyFilters(trips, EMPTY_FILTERS).map((t) => t.startDate!)
    expect(dates).toEqual([...dates].sort())
  })
  it('por duração', () => {
    const days = applyFilters(trips, f({ ordem: 'duracao' })).map((t) => t.days!)
    expect(days).toEqual([...days].sort((a, b) => a - b))
  })
})

describe('facetas', () => {
  it('derivam dos roteiros cadastrados', () => {
    const facets = buildFacets(trips, EMPTY_FILTERS)
    expect(facets.embarque.map((o) => o.label).sort()).toEqual(['Aracaju', 'Brasília', 'Fortaleza', 'Londrina', 'Recife', 'São Paulo/Guarulhos'])
    expect(facets.regiao.reduce((n, o) => n + o.count, 0)).toBe(14)
    // Nenhum preço aprovado na migração → filtro de preço indisponível.
    expect(facets.priceAvailable).toBe(false)
  })
  it('contagem considera os demais filtros ativos', () => {
    const facets = buildFacets(trips, f({ regiao: ['brasil'] }))
    expect(facets.embarque.find((o) => o.value === 'recife')?.count).toBe(4)
    expect(facets.embarque.find((o) => o.value === 'brasilia')?.count).toBe(0)
    // A própria faceta ignora sua seleção (permite trocar de região).
    expect(facets.regiao.find((o) => o.value === 'europa')?.count).toBe(7)
  })
})

describe('URL', () => {
  it('serializa e restaura o estado (busca compartilhável)', () => {
    const state = f({ q: 'fátima', regiao: ['europa'], embarque: ['brasilia', 'recife'], ordem: 'duracao' })
    const qs = serializeFilters(state)
    expect(parseFilters(new URLSearchParams(qs))).toEqual(state)
  })
  it('aceita objeto de searchParams do Next', () => {
    expect(parseFilters({ pais: ['portugal', 'franca'], q: 'lourdes' })).toMatchObject({ pais: ['portugal', 'franca'], q: 'lourdes', ordem: 'relevancia' })
  })
  it('ignora valores inválidos de ordenação', () => {
    expect(parseFilters(new URLSearchParams('ordem=xyz')).ordem).toBe('data')
  })
  it('conta filtros ativos', () => {
    expect(activeFilterCount(f({ q: 'x', pais: ['a', 'b'] }))).toBe(3)
    expect(serializeFilters(EMPTY_FILTERS)).toBe('')
  })
})
