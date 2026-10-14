import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { TripCardData } from '@/lib/trip-model'
import { TripCard } from './TripCard'

export function RelatedTrips({ trips }: { trips: TripCardData[] }) {
  if (!trips.length) return null
  return (
    <section aria-labelledby="relacionadas-titulo" className="bg-cream-50 py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="mb-12">
          <SectionHeading id="relacionadas-titulo" eyebrow="Continue explorando" title="Outras peregrinações" />
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.08}>
              <TripCard trip={t} source="relacionadas" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
