/**
 * Importacao inicial automatizada da Hostinger.
 * So executa o seed se faltam roteiros do acervo original.
 * Reexecutar o seed em todo deploy sobrescreveria ajustes feitos no painel.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const root = process.cwd()
const trips = JSON.parse(fs.readFileSync(path.join(root, 'migration/data/trips.json'), 'utf8')) as {slug:string}[]
const pending = JSON.parse(fs.readFileSync(path.join(root, 'migration/data/pending-trips.json'), 'utf8')) as {key:string}[]
const expected = [...trips.map((t) => t.slug), ...pending.map((p) => 'pendente-' + p.key)]

const payload = await getPayload({config})
const {docs} = await payload.find({
  collection: 'trips',
  limit: 500,
  depth: 0,
  select: {slug:true},
  overrideAccess: true,
})
const existing = new Set(docs.map((doc) => doc.slug))
const missing = expected.filter((slug) => !existing.has(slug))

if (missing.length === 0) {
  payload.logger.info('Hostinger bootstrap: todos os roteiros ja cadastrados; seed ignorado.')
  process.exit(0)
}

if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD sao obrigatorios na primeira importacao.')
}
payload.logger.info('Hostinger bootstrap: ' + missing.length + ' roteiros ausentes; iniciando seed.')

await import('./index')
