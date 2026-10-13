import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'

let payload: Payload

describe('CMS (Payload + PostgreSQL)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('tem os 14 roteiros publicados e as viagens pendentes como rascunho', async () => {
    const published = await payload.count({ collection: 'trips', where: { status: { equals: 'publicado' } } })
    const drafts = await payload.find({ collection: 'trips', where: { status: { equals: 'rascunho' } }, limit: 50, depth: 0 })
    expect(published.totalDocs).toBe(14)
    expect(drafts.docs.length).toBeGreaterThanOrEqual(7)
    expect(drafts.docs.every((d) => d.slug?.startsWith('pendente-'))).toBe(true)
  })

  it('leitura pública não expõe rascunhos', async () => {
    const res = await payload.find({ collection: 'trips', overrideAccess: false, limit: 100, depth: 0 })
    expect(res.docs.length).toBe(14)
    expect(res.docs.some((d) => d.status === 'rascunho')).toBe(false)
  })

  it('solicitações de contato não são legíveis nem criáveis sem login', async () => {
    await expect(payload.find({ collection: 'inquiries', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({ collection: 'inquiries', overrideAccess: false, data: { name: 'x', email: 'x@x.com', message: 'teste de acesso', consent: true } }),
    ).rejects.toThrow()
  })

  it('usuários não são listáveis publicamente', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('cada roteiro publicado tem botão com destino válido e programação completa', async () => {
    const { docs } = await payload.find({ collection: 'trips', where: { status: { equals: 'publicado' } }, limit: 100, depth: 1 })
    for (const t of docs) {
      expect(t.slug).toMatch(/^[a-z0-9-]+$/)
      if (t.linkTarget === 'legacy') expect(t.legacyUrl).toMatch(/^https:\/\/vialuminaviagens\.com\.br\/[a-z0-9-]+\/$/)
      expect(t.itinerary?.length).toBe(t.days)
      expect(t.featuredImage).toBeTruthy()
      expect(t.guides?.length).toBeGreaterThan(0)
      expect(typeof t.pdf === 'object' && t.pdf?.url).toBeTruthy()
    }
  })

  it('valores migrados permanecem ocultos até aprovação comercial', async () => {
    const { docs } = await payload.find({ collection: 'trips', where: { status: { equals: 'publicado' } }, limit: 100, depth: 0 })
    expect(docs.every((t) => t.pricing?.showPrices === false)).toBe(true)
    expect(docs.every((t) => (t.pricing?.totalBrl ?? 0) > 0)).toBe(true)
  })
})
