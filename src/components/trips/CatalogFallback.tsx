import type { TripCardData } from '@/lib/trip-model'
import { TripCard } from './TripCard'

/** Versão estática do catálogo (sem filtros), exibida até o componente interativo assumir. */
export function CatalogFallback({ trips }: { trips: TripCardData[] }) {
  const sorted = [...trips].sort((a, b) => (a.startDate ?? '9999').localeCompare(b.startDate ?? '9999'))
  return (
    <div className="grid gap-10 xl:grid-cols-[290px_1fr] xl:gap-12">
      <div className="hidden h-[640px] animate-pulse rounded-[var(--radius-card)] bg-white shadow-soft ring-1 ring-navy-900/5 xl:block" aria-hidden="true" />
      <div className="min-w-0">
        <div className="border-b border-navy-900/10 pb-5">
          <h2 className="font-display text-2xl text-navy-900">{trips.length} peregrinações encontradas</h2>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {sorted.map((trip, i) => (
            <li key={trip.id}>
              <TripCard trip={trip} priority={i < 2} sizes="(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
