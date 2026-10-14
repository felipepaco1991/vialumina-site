import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TripCard } from '@/components/trips/TripCard'
import { Reveal } from '@/components/ui/Reveal'
import { PILGRIMAGES } from '@/content/institutional'
import type { TripCardData } from '@/lib/trip-model'

export function FeaturedTrips({ trips, total }: { trips: TripCardData[]; total: number }) {
  const [first, ...rest] = trips
  return (
    <section aria-labelledby="destaques-titulo" className="relative bg-cream-50 pb-24">
      <div className="relative isolate overflow-hidden bg-navy-950 pt-20 pb-48 text-white sm:pt-24">
        <Image src="/assets/home/banner-meio-roteiros.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-70" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/30 to-navy-950/80" aria-hidden="true" />
        <Reveal className="container-site text-center">
          <p className="eyebrow-light mb-3">{PILGRIMAGES.eyebrow}</p>
          <h2 id="destaques-titulo" className="title-rule title-rule-center mx-auto max-w-3xl text-[2.1rem] leading-tight font-medium text-white sm:text-5xl">
            {PILGRIMAGES.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{PILGRIMAGES.intro}</p>
        </Reveal>
      </div>

      <div className="container-site -mt-36 space-y-6">
        {first ? (
          <Reveal>
            <TripCard trip={first} variant="feature" source="home-destaque" />
          </Reveal>
        ) : null}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((trip, i) => (
            <Reveal as="li" key={trip.id} delay={i * 0.08}>
              <TripCard trip={trip} source="home-destaque" />
            </Reveal>
          ))}
        </ul>
        <Reveal className="flex flex-col items-center gap-3 pt-6 text-center">
          <Link
            href="/destinos"
            className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-navy-900 px-8 font-label text-[0.95rem] font-semibold text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] transition hover:-translate-y-0.5 hover:bg-navy-800"
          >
            Ver todas as {total} peregrinações
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <p className="text-sm text-slate-500">Filtre por destino, mês de saída, cidade de embarque e acompanhante.</p>
        </Reveal>
      </div>
    </section>
  )
}
