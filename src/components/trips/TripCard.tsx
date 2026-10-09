import { ArrowUpRight, CalendarDays, Clock3, PlaneTakeoff, UserRound } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/cn'
import { formatBrl, formatDateRange, periodBadge } from '@/lib/format'
import { STATUS_BADGE } from '@/lib/taxonomy'
import type { TripCardData } from '@/lib/trip-model'

type Props = {
  trip: TripCardData
  variant?: 'default' | 'feature'
  priority?: boolean
  sizes?: string
  className?: string
  /** Origem do clique para analytics. */
  source?: string
}

export function durationLabel(days: number | null, nights: number | null) {
  if (!days) return null
  return `${days} dias${nights ? ` · ${nights} noites` : ''}`
}

/** Card de peregrinação. O link "Conheça o roteiro completo" cobre todo o card. */
export function TripCard({ trip, variant = 'default', priority, sizes, className, source = 'catalogo' }: Props) {
  const feature = variant === 'feature'
  const badge = STATUS_BADGE[trip.status]
  const when = formatDateRange(trip.startDate, trip.endDate)
  const duration = durationLabel(trip.days, trip.nights)
  const period = periodBadge(trip.startDate, trip.endDate)

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-soft ring-1 ring-navy-900/5 transition duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 focus-within:shadow-lift',
        feature && 'lg:flex-row',
        className,
      )}
    >
      <div className={cn('relative overflow-hidden bg-navy-900', feature ? 'aspect-[4/3] lg:aspect-auto lg:w-[56%] lg:shrink-0' : 'aspect-[4/3]')}>
        {trip.image ? (
          <Image
            src={trip.image.url}
            alt={trip.image.alt}
            fill
            loading={priority ? 'eager' : undefined}
            sizes={sizes ?? (feature ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw')}
            className="object-cover transition duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
            style={{ objectPosition: `${trip.image.focalX}% ${trip.image.focalY}%` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {period ? (
            <span className="rounded-full bg-gold-500 px-3 py-1 font-label text-xs font-bold tracking-wider text-navy-950">{period}</span>
          ) : null}
          {badge ? (
            <span className="rounded-full bg-white/95 px-3 py-1 font-label text-xs font-bold tracking-wider text-navy-900 uppercase">{badge}</span>
          ) : null}
        </div>
        {trip.departureCity ? (
          <p className="absolute bottom-4 left-4 flex items-center gap-1.5 font-label text-xs font-semibold tracking-wide text-white">
            <PlaneTakeoff className="size-4" aria-hidden="true" /> Saída de {trip.departureCity}
          </p>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col p-6', feature && 'lg:p-9')}>
        {trip.countries.length ? <p className="eyebrow mb-2">{trip.countries.join(' · ')}</p> : null}
        <h3 className={cn('leading-tight font-medium text-navy-900', feature ? 'text-[1.75rem] lg:text-[2.25rem]' : 'text-[1.5rem]')}>{trip.title}</h3>
        {trip.cities.length ? (
          <p className="mt-2 line-clamp-2 font-label text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
            {trip.cities.join(' | ')}
          </p>
        ) : null}
        {feature && trip.description ? <p className="mt-4 line-clamp-3 text-slate-700">{trip.description}</p> : null}

        <dl className="mt-5 space-y-2.5 text-[0.95rem] text-slate-700">
          <div className="flex gap-2.5">
            <dt className="shrink-0">
              <CalendarDays className="mt-0.5 size-[18px] text-gold-500" aria-hidden="true" />
              <span className="sr-only">Data da viagem</span>
            </dt>
            <dd>{when}</dd>
          </div>
          {duration ? (
            <div className="flex gap-2.5">
              <dt className="shrink-0">
              <Clock3 className="mt-0.5 size-[18px] text-gold-500" aria-hidden="true" />
              <span className="sr-only">Duração</span>
            </dt>
              <dd>{duration}</dd>
            </div>
          ) : null}
          {trip.guides.length ? (
            <div className="flex gap-2.5">
              <dt className="shrink-0">
              <UserRound className="mt-0.5 size-[18px] text-gold-500" aria-hidden="true" />
              <span className="sr-only">Acompanhamento espiritual</span>
            </dt>
              <dd>
                {trip.guides.map((g) => (
                  <span key={g.name} className="block">
                    <span className="text-slate-500">{g.role}:</span> <span className="font-semibold text-navy-900">{g.name}</span>
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>

        {trip.price?.totalBrl ? (
          <p className="mt-5 border-t border-navy-900/10 pt-4 text-sm text-slate-500">
            {trip.price.installmentsCount && trip.price.installmentValueBrl ? (
              <>
                <span className="font-display text-2xl text-navy-900">
                  {trip.price.installmentsCount}x de {formatBrl(trip.price.installmentValueBrl)}
                </span>
                <br />
              </>
            ) : null}
            Valor total {formatBrl(trip.price.totalBrl)}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <a
            href={trip.href}
            aria-label={`Conheça o roteiro completo: ${trip.title}${trip.startDate ? `, ${when}` : ''}`}
            data-track="trip_card_click"
            data-track-label={source}
            data-track-trip={trip.slug}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-navy-700 px-5 font-label text-sm font-semibold text-white transition duration-300 group-hover:bg-navy-900 after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-500"
          >
            Conheça o roteiro completo
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}
