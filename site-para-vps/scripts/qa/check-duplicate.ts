/** Verifica a duplicação de um roteiro (base para nova saída) e remove a cópia. */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'trips', where: { slug: { equals: 'europa-sagrada' } }, limit: 1 })
const copy = await payload.duplicate({ collection: 'trips', id: docs[0].id, context: { disableRevalidate: true } })
console.log('cópia:', copy.id, copy.title, copy.slug, copy.status, 'dias:', copy.itinerary?.length)
await payload.delete({ collection: 'trips', id: copy.id, context: { disableRevalidate: true } })
process.exit(0)
