/**
 * Gera versões WebP otimizadas ao lado dos originais em public/assets
 * (os originais não são alterados) e registra no manifesto.
 * Apenas redimensiona (largura máxima) e recomprime — sem filtros ou cortes.
 *
 * Uso: node scripts/migration/optimize-assets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../..')
const manifestPath = path.join(ROOT, 'migration/asset-manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

const MAX_WIDTH = 2400
let saved = 0
for (const f of manifest.files) {
  if (!/\.(jpe?g|png)$/i.test(f.path)) continue
  const src = path.join(ROOT, 'public', f.path)
  const out = src.replace(/\.(jpe?g|png)$/i, '.webp')
  const img = sharp(src, { failOn: 'none' })
  const meta = await img.metadata()
  const info = await img
    .rotate()
    .resize({ width: Math.min(meta.width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toFile(out)
  f.width = meta.width
  f.height = meta.height
  f.optimized = { path: f.path.replace(/\.(jpe?g|png)$/i, '.webp'), bytes: info.size, width: info.width, height: info.height }
  saved += f.bytes - info.size
  console.log(`${(f.bytes / 1024).toFixed(0).padStart(6)} KB → ${(info.size / 1024).toFixed(0).padStart(5)} KB  ${f.optimized.path}`)
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`\nEconomia total: ${(saved / 1e6).toFixed(1)} MB`)
