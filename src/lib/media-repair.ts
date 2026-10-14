/**
 * Reparo de arquivos ausentes no Cloudflare R2.
 *
 * Os registros de mídia migrados antes do R2 apontam para objetos (`media/<arquivo>.webp`)
 * que nunca foram enviados ao bucket. Aqui o arquivo certo é localizado no repositório
 * (migration/asset-manifest.json -> public/assets) e reenviado com o mesmo nome que o banco espera.
 *
 * Regras: só ADICIONA objetos ausentes (nunca sobrescreve) e não toca no banco.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export type ManifestFile = {
  path: string
  originalUrl: string
  duplicateUrls?: string[]
  optimized?: { path: string } | null
}

type SizeRecord = { filename?: string | null; width?: number | null; height?: number | null }

/** Campos do registro de mídia/documento usados no reparo. */
export type RepairDoc = {
  filename?: string | null
  prefix?: string | null
  originalUrl?: string | null
  sizes?: Record<string, SizeRecord | null | undefined> | null
}

/** Como o Payload gera as imagens (espelha a coleção Media). */
export type ImageSpec = {
  /** Largura máxima do arquivo principal. */
  maxWidth: number
  quality: number
  sizeQuality: Record<string, number>
}

export type ObjectStore = {
  exists(key: string): Promise<boolean>
  put(key: string, body: Buffer, contentType: string): Promise<void>
}

export type RepairStats = {
  checked: number
  present: number
  uploaded: number
  /** Registros sem arquivo-fonte localizável no repositório. */
  noSource: string[]
  failed: { key: string; error: string }[]
}

export const emptyStats = (): RepairStats => ({ checked: 0, present: 0, uploaded: 0, noSource: [], failed: [] })

type Planned = { key: string; size?: { name: string; width: number | null; height: number | null } }

/** Objetos que o banco espera encontrar no bucket para este registro. */
export function planObjects(doc: RepairDoc, defaultPrefix: string, withSizes: boolean): Planned[] {
  if (!doc.filename) return []
  const prefix = doc.prefix || defaultPrefix
  const key = (name: string) => path.posix.join(prefix, name)
  const out: Planned[] = [{ key: key(doc.filename) }]
  if (withSizes) {
    for (const [name, rec] of Object.entries(doc.sizes ?? {})) {
      if (rec?.filename) out.push({ key: key(rec.filename), size: { name, width: rec.width ?? null, height: rec.height ?? null } })
    }
  }
  return out
}

/** Índice URL de origem -> caminho em public/ (inclui as URLs duplicadas do manifesto). */
export function buildSourceIndex(files: ManifestFile[]) {
  const index = new Map<string, ManifestFile>()
  for (const f of files) {
    index.set(f.originalUrl, f)
    for (const dup of f.duplicateUrls ?? []) if (!index.has(dup)) index.set(dup, f)
  }
  return index
}

/** Caminhos candidatos (relativos a public/) para o arquivo-fonte de um registro. */
export function sourceCandidates(originalUrl: string | null | undefined, index: Map<string, ManifestFile>): string[] {
  if (!originalUrl) return []
  const hit = index.get(originalUrl)
  if (hit) return [hit.path, ...(hit.optimized?.path ? [hit.optimized.path] : [])]
  // O seed grava o próprio caminho público quando o arquivo não consta no manifesto.
  return originalUrl.startsWith('/') ? [originalUrl] : []
}

async function readFirst(publicDir: string, candidates: string[]) {
  const root = path.resolve(publicDir)
  for (const rel of candidates) {
    const abs = path.resolve(root, '.' + path.posix.normalize('/' + rel))
    if (!abs.startsWith(root + path.sep)) continue
    try {
      return await fs.readFile(abs)
    } catch {
      // tenta o próximo candidato
    }
  }
  return null
}

type RepairOptions = {
  store: ObjectStore
  publicDir: string
  index: Map<string, ManifestFile>
  stats: RepairStats
  dryRun?: boolean
}

/** Repara um registro de imagem (arquivo principal + miniaturas geradas pelo Payload). */
export async function repairImageDoc(doc: RepairDoc, defaultPrefix: string, spec: ImageSpec, opts: RepairOptions) {
  await repairDoc(doc, defaultPrefix, true, opts, async (source, planned) => {
    const base = sharp(source, { failOn: 'none' }).rotate()
    if (!planned.size) return { body: await base.resize({ width: spec.maxWidth, withoutEnlargement: true }).webp({ quality: spec.quality }).toBuffer(), contentType: 'image/webp' }
    const { name, width, height } = planned.size
    const resized = width && height ? base.resize({ width, height, fit: 'fill' }) : base.resize({ width: width ?? undefined })
    return { body: await resized.webp({ quality: spec.sizeQuality[name] ?? spec.quality }).toBuffer(), contentType: 'image/webp' }
  })
}

/** Repara um registro de arquivo (PDF): reenvia os bytes originais sem transformação. */
export async function repairFileDoc(doc: RepairDoc, defaultPrefix: string, contentType: string, opts: RepairOptions) {
  await repairDoc(doc, defaultPrefix, false, opts, async (source) => ({ body: source, contentType }))
}

async function repairDoc(
  doc: RepairDoc,
  defaultPrefix: string,
  withSizes: boolean,
  { store, publicDir, index, stats, dryRun }: RepairOptions,
  build: (source: Buffer, planned: Planned) => Promise<{ body: Buffer; contentType: string }>,
) {
  const missing: Planned[] = []
  for (const planned of planObjects(doc, defaultPrefix, withSizes)) {
    stats.checked++
    try {
      if (await store.exists(planned.key)) stats.present++
      else missing.push(planned)
    } catch (err) {
      stats.failed.push({ key: planned.key, error: err instanceof Error ? err.message : String(err) })
    }
  }
  if (missing.length === 0) return

  const source = await readFirst(publicDir, sourceCandidates(doc.originalUrl, index))
  if (!source) {
    stats.noSource.push(`${doc.filename} (origem: ${doc.originalUrl ?? 'não informada'})`)
    return
  }
  for (const planned of missing) {
    try {
      if (!dryRun) {
        const { body, contentType } = await build(source, planned)
        await store.put(planned.key, body, contentType)
      }
      stats.uploaded++
    } catch (err) {
      stats.failed.push({ key: planned.key, error: err instanceof Error ? err.message : String(err) })
    }
  }
}
