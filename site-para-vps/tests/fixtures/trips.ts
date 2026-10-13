import fs from 'node:fs'
import path from 'node:path'
import type { TripCardData } from '@/lib/trip-model'
import { normalizeText } from '@/lib/format'

type MigratedTrip = {
  slug: string
  title: string
  subtitle: string
  description: string
  regions: string[]
  countries: string[]
  cities: string[]
  sanctuaries: string[]
  departureCity: string
  startDate: string
  endDate: string
  days: number
  nights: number
  guides: { name: string; role: string }[]
  legacyUrl: string
  featured: boolean
  sortOrder: number
}

export const migratedTrips: MigratedTrip[] = JSON.parse(fs.readFileSync(path.resolve('migration/data/trips.json'), 'utf8'))

/** Converte os dados migrados no modelo de card usado pelo catálogo. */
export const cardFixtures: TripCardData[] = migratedTrips.map((t, i) => ({
  id: i + 1,
  slug: t.slug,
  title: t.title,
  subtitle: t.subtitle,
  description: t.description,
  href: t.legacyUrl,
  external: true,
  image: null,
  regions: t.regions,
  countries: t.countries,
  cities: t.cities,
  sanctuaries: t.sanctuaries,
  departureCity: t.departureCity,
  startDate: t.startDate,
  endDate: t.endDate,
  days: t.days,
  nights: t.nights,
  guides: t.guides.map((g) => ({ name: g.name, role: g.role })),
  status: 'publicado',
  featured: t.featured,
  sortOrder: t.sortOrder,
  price: null,
  searchText: normalizeText([t.title, t.subtitle, t.description, ...t.countries, ...t.cities, ...t.sanctuaries, t.departureCity, ...t.guides.map((g) => g.name)].join(' ')),
}))
