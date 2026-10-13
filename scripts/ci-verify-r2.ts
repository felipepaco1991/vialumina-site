/**
 * CI only. Query upload collections after running versioned migrations.
 * Confirms fields injected by S3/R2 adapter exist before any attempt to seed assets.
 * Uses a disposable PostgreSQL; never connect real Neon here.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
for (const collection of ['media', 'documents'] as const) {
  await payload.find({
    collection,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  payload.logger.info('R2 migration schema verified: ' + collection)
}
process.exit(0)
