import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import {
  buildSourceIndex,
  emptyStats,
  planObjects,
  repairFileDoc,
  repairImageDoc,
  sourceCandidates,
  type ImageSpec,
  type ManifestFile,
  type ObjectStore,
} from '@/lib/media-repair'

const root = process.cwd()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'migration/asset-manifest.json'), 'utf8')) as { files: ManifestFile[] }
const index = buildSourceIndex(manifest.files)
const spec: ImageSpec = { maxWidth: 2560, quality: 85, sizeQuality: { thumb: 78, card: 80, large: 82 } }

const art = manifest.files.find((f) => f.path === '/assets/destinos/portugal-e-franca/arte-divulgacao.jpg')!
const pdf = manifest.files.find((f) => f.path === '/assets/pdfs/portugal-e-franca.pdf')!

function fakeStore(initial: string[] = []) {
  const objects = new Map<string, { body: Buffer; contentType: string }>()
  const existing = new Set(initial)
  const store: ObjectStore = {
    exists: async (key) => existing.has(key) || objects.has(key),
    put: async (key, body, contentType) => void objects.set(key, { body, contentType }),
  }
  return { store, objects }
}
const opts = (store: ObjectStore, extra: Record<string, unknown> = {}) => ({ store, publicDir: path.join(root, 'public'), index, stats: emptyStats(), ...extra })

const doc = {
  filename: 'arte-divulgacao.webp',
  prefix: null,
  originalUrl: art.originalUrl,
  sizes: {
    thumb: { filename: 'arte-divulgacao-480x600.webp', width: 480, height: 600 },
    card: { filename: 'arte-divulgacao-960x1200.webp', width: 960, height: 1200 },
    large: { filename: null, width: null, height: null },
  },
}

describe('reparo de mídia no R2', () => {
  it('planeja o arquivo principal e as miniaturas existentes, com o prefixo da coleção', () => {
    expect(planObjects(doc, 'media', true).map((p) => p.key)).toEqual([
      'media/arte-divulgacao.webp',
      'media/arte-divulgacao-480x600.webp',
      'media/arte-divulgacao-960x1200.webp',
    ])
    expect(planObjects({ ...doc, prefix: 'outro' }, 'media', false).map((p) => p.key)).toEqual(['outro/arte-divulgacao.webp'])
    expect(planObjects({ filename: null }, 'media', true)).toEqual([])
  })

  it('resolve o arquivo-fonte pelo manifesto, inclusive URLs duplicadas, e pelo caminho público', () => {
    expect(sourceCandidates(art.originalUrl, index)[0]).toBe(art.path)
    const withDup = manifest.files.find((f) => (f.duplicateUrls ?? []).length > 0)
    if (withDup) expect(sourceCandidates(withDup.duplicateUrls![0], index)[0]).toBe(withDup.path)
    expect(sourceCandidates('/assets/x/y.jpg', index)).toEqual(['/assets/x/y.jpg'])
    expect(sourceCandidates('https://exemplo.com/a.jpg', index)).toEqual([])
    expect(sourceCandidates(null, index)).toEqual([])
  })

  it('envia as imagens ausentes em WebP, com as dimensões que o banco registra', async () => {
    const { store, objects } = fakeStore()
    const o = opts(store)
    await repairImageDoc(doc, 'media', spec, o)
    expect([...objects.keys()].sort()).toEqual(['media/arte-divulgacao-480x600.webp', 'media/arte-divulgacao-960x1200.webp', 'media/arte-divulgacao.webp'])
    expect(o.stats).toMatchObject({ checked: 3, present: 0, uploaded: 3, noSource: [], failed: [] })
    for (const [key, obj] of objects) {
      expect(obj.contentType).toBe('image/webp')
      const meta = await sharp(obj.body).metadata()
      expect(meta.format).toBe('webp')
      if (key.endsWith('480x600.webp')) expect([meta.width, meta.height]).toEqual([480, 600])
      if (key.endsWith('960x1200.webp')) expect([meta.width, meta.height]).toEqual([960, 1200])
      if (key === 'media/arte-divulgacao.webp') expect(meta.width).toBeLessThanOrEqual(2560)
    }
  })

  it('é idempotente: não reenvia nem sobrescreve objetos que já existem', async () => {
    const { store, objects } = fakeStore(['media/arte-divulgacao.webp'])
    const o = opts(store)
    await repairImageDoc(doc, 'media', spec, o)
    expect([...objects.keys()]).not.toContain('media/arte-divulgacao.webp')
    expect(o.stats).toMatchObject({ checked: 3, present: 1, uploaded: 2 })

    const again = opts(store, { stats: emptyStats() })
    await repairImageDoc(doc, 'media', spec, again)
    expect(again.stats).toMatchObject({ checked: 3, present: 3, uploaded: 0 })
  })

  it('registra, sem enviar nada, os registros sem arquivo-fonte', async () => {
    const { store, objects } = fakeStore()
    const o = opts(store)
    await repairImageDoc({ filename: 'upload-manual.webp', originalUrl: null, sizes: null }, 'media', spec, o)
    expect(objects.size).toBe(0)
    expect(o.stats.noSource).toHaveLength(1)
    expect(o.stats.noSource[0]).toContain('upload-manual.webp')
  })

  it('não lê arquivos fora de public/', async () => {
    const { store, objects } = fakeStore()
    const o = opts(store)
    await repairImageDoc({ filename: 'x.webp', originalUrl: '/../package.json' }, 'media', spec, o)
    expect(objects.size).toBe(0)
    expect(o.stats.noSource).toHaveLength(1)
  })

  it('reenvia PDFs byte a byte, como application/pdf', async () => {
    const { store, objects } = fakeStore()
    const o = opts(store)
    await repairFileDoc({ filename: 'portugal-e-franca.pdf', originalUrl: pdf.originalUrl }, 'documents', 'application/pdf', o)
    const sent = objects.get('documents/portugal-e-franca.pdf')!
    expect(sent.contentType).toBe('application/pdf')
    expect(sent.body.equals(fs.readFileSync(path.join(root, 'public', pdf.path)))).toBe(true)
  })

  it('simulação não envia nada', async () => {
    const { store, objects } = fakeStore()
    const o = opts(store, { dryRun: true })
    await repairImageDoc(doc, 'media', spec, o)
    expect(objects.size).toBe(0)
    expect(o.stats.uploaded).toBe(3)
  })

  it('erro de verificação ou envio é contabilizado e não interrompe os demais', async () => {
    const { store, objects } = fakeStore()
    const flaky: ObjectStore = {
      exists: store.exists,
      put: async (key, body, ct) => {
        if (key.includes('480x600')) throw new Error('falha simulada')
        return store.put(key, body, ct)
      },
    }
    const o = opts(flaky)
    await repairImageDoc(doc, 'media', spec, o)
    expect(o.stats.failed).toEqual([{ key: 'media/arte-divulgacao-480x600.webp', error: 'falha simulada' }])
    expect(objects.size).toBe(2)
  })
})
