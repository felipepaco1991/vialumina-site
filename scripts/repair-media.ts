/**
 * Hostinger: reenvia ao Cloudflare R2 os arquivos de mídia/PDF que o banco referencia e o bucket não tem.
 * Roda a cada build (npm run repair:media), logo depois do seed:if-empty e antes do next build.
 *
 * - Idempotente: objeto já existente nunca é sobrescrito; sem nada faltando, não envia nada.
 * - Não altera o banco (somente leitura) nem apaga objetos.
 * - REPAIR_MEDIA_DRY_RUN=1 apenas lista o que seria enviado.
 */
import fs from 'node:fs'
import path from 'node:path'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import config from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '../src/collections/Media'
import {
  buildSourceIndex,
  emptyStats,
  repairFileDoc,
  repairImageDoc,
  type ImageSpec,
  type ManifestFile,
  type ObjectStore,
  type RepairDoc,
} from '../src/lib/media-repair'

const root = process.cwd()
const logger = (message: string) => process.stdout.write(`[repair-media] ${message}\n`)

const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  logger('R2 não configurado neste ambiente; nada a reparar.')
  process.exit(0)
}

const dryRun = process.env.REPAIR_MEDIA_DRY_RUN === '1'
const client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

const store: ObjectStore = {
  async exists(key) {
    try {
      await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }))
      return true
    } catch (err) {
      const e = err as { name?: string; $metadata?: { httpStatusCode?: number } }
      if (e.name === 'NotFound' || e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) return false
      throw err
    }
  },
  async put(key, body, contentType) {
    await client.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }))
  },
}

// Mesmos parâmetros da coleção Media, para o arquivo reenviado ser equivalente ao do upload original.
const upload = typeof Media.upload === 'object' ? Media.upload : null
const qualityOf = (formatOptions: unknown, fallback: number) =>
  ((formatOptions as { options?: { quality?: number } } | undefined)?.options?.quality ?? fallback)
const spec: ImageSpec = {
  maxWidth: upload?.resizeOptions?.width ?? 2560,
  quality: qualityOf(upload?.formatOptions, 85),
  sizeQuality: Object.fromEntries((upload?.imageSizes ?? []).map((s) => [s.name, qualityOf(s.formatOptions, 80)])),
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'migration/asset-manifest.json'), 'utf8')) as { files: ManifestFile[] }
const opts = { store, publicDir: path.join(root, 'public'), index: buildSourceIndex(manifest.files), stats: emptyStats(), dryRun }

const payload = await getPayload({ config })

async function forEachDoc(collection: 'media' | 'documents', fn: (doc: RepairDoc) => Promise<void>) {
  for (let page = 1; ; page++) {
    const res = await payload.find({ collection, page, limit: 100, depth: 0, overrideAccess: true, pagination: true })
    for (const doc of res.docs) await fn(doc as RepairDoc)
    if (!res.hasNextPage) break
  }
}

// Prefixos iguais aos de payload.config.ts (s3Storage -> collections).
await forEachDoc('media', (doc) => repairImageDoc(doc, 'media', spec, opts))
await forEachDoc('documents', (doc) => repairFileDoc(doc, 'documents', 'application/pdf', opts))

const { checked, present, uploaded, noSource, failed } = opts.stats
logger(`${checked} objetos verificados, ${present} já estavam no R2, ${uploaded} ${dryRun ? 'seriam enviados (simulação)' : 'enviados'}.`)
for (const item of noSource) logger(`AVISO sem arquivo-fonte no repositório: ${item}`)
for (const item of failed) logger(`ERRO ${item.key}: ${item.error}`)
process.exit(failed.length > 0 ? 1 : 0)
