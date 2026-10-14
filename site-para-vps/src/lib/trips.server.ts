import 'server-only'
import { cache } from 'react'
import { getPayloadClient } from './payload'
import { LISTED_STATUS, PUBLIC_STATUS } from './taxonomy'
import { toCard, toDetail, type TripCardData } from './trip-model'

/** Roteiros exibidos no catálogo (publicado, sob consulta, esgotado). */
export const getListedTrips = cache(async (): Promise<TripCardData[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'trips',
    where: { status: { in: LISTED_STATUS } },
    depth: 2,
    limit: 200,
    sort: ['sortOrder', 'startDate'],
    overrideAccess: false,
  })
  return docs.map(toCard)
})

/** Página de um roteiro (inclui encerrados; nunca rascunhos). */
export const getTripBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'trips',
    where: { and: [{ slug: { equals: slug } }, { status: { in: PUBLIC_STATUS } }] },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return docs[0] ? toDetail(docs[0]) : null
})

export const getPublicTripSlugs = async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'trips',
    where: { status: { in: PUBLIC_STATUS } },
    depth: 0,
    limit: 500,
    select: { slug: true, updatedAt: true },
    overrideAccess: false,
  })
  return docs.map((d) => ({ slug: d.slug!, updatedAt: d.updatedAt }))
}

const byDate = (a: TripCardData, b: TripCardData) => (a.startDate ?? '9999').localeCompare(b.startDate ?? '9999')

/** Seleção da homepage: destaques primeiro, depois as próximas saídas. */
export async function getFeaturedTrips(limit = 6) {
  const trips = await getListedTrips()
  const featured = trips.filter((t) => t.featured).sort(byDate)
  const rest = trips.filter((t) => !t.featured).sort(byDate)
  return [...featured, ...rest].slice(0, limit)
}

/** Roteiros relacionados: mesmos países, depois mesma região, depois as próximas saídas. */
export async function getRelatedTrips(trip: { id: number; countries: string[]; regions: string[] }, limit = 3) {
  const trips = (await getListedTrips()).filter((t) => t.id !== trip.id)
  const score = (t: TripCardData) =>
    t.countries.filter((c) => trip.countries.includes(c)).length * 3 + t.regions.filter((r) => trip.regions.includes(r)).length
  return trips.sort((a, b) => score(b) - score(a) || byDate(a, b)).slice(0, limit)
}
