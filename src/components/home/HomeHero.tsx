import {
  ArrowRight,
  CalendarDays,
  Compass,
  ExternalLink,
  HandHeart,
  Headset,
  PlaneTakeoff,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { HERO } from '@/content/institutional'
import { CRESCER, TRIVVA_SIGNUP_URL } from '@/content/promocoes'
import { formatDateRange } from '@/lib/format'
import type { TripCardData } from '@/lib/trip-model'
import { durationLabel } from '@/components/trips/TripCard'
import { HeroCarousel, type HeroSlide } from './HeroCarousel'

/** Quantas peregrinações entram no carrossel (além da apresentação e dos banners de parceiros). */
export const HERO_TRIPS = 3

function BrandSlide({ whatsappHref }: { whatsappHref: string }) {
  return (
    <div className="relative isolate flex w-full items-center">
      <Image
        src="/assets/home/hero-banner-topo.webp"
        alt="Muralhas da Cidade Antiga de Jerusalém ao entardecer, com os raios dourados da Via Lumina"
        fill
        preload
        sizes="100vw"
        className="-z-10 scale-[1.04] object-cover object-[60%_center]"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(4_26_54/0.15)_0%,rgb(4_26_54/0.55)_70%),linear-gradient(180deg,rgb(4_26_54/0.35)_0%,transparent_30%,rgb(4_26_54/0.7)_100%)]"
        aria-hidden="true"
      />
      <div className="container-site pt-28 pb-40 text-center sm:pb-48">
        <p className="animate-fade-up font-display text-2xl font-normal text-white/90 italic sm:text-3xl">
          {HERO.kicker}
        </p>
        <h1
          id="hero-titulo"
          className="mt-2 animate-[rise_0.9s_var(--ease-out-soft)_both] text-[3.1rem] leading-[0.98] font-medium text-white [animation-delay:120ms] sm:text-7xl lg:text-[6.5rem]"
        >
          {HERO.title}
        </h1>
        <div
          className="mx-auto my-7 h-[3px] w-24 origin-center animate-[rule-grow_1s_var(--ease-out-soft)_0.35s_both] rounded-full bg-gold-300"
          aria-hidden="true"
        />
        <p className="mx-auto max-w-2xl animate-fade-up font-display text-xl text-gold-200 [animation-delay:260ms] sm:text-2xl">
          {HERO.tagline}
        </p>
        <p className="mx-auto mt-3 max-w-xl animate-fade-up text-lg text-white/85 [animation-delay:320ms]">
          {HERO.text}
        </p>
        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:420ms] sm:flex-row">
          <ButtonLink
            href={whatsappHref}
            variant="whatsapp"
            size="lg"
            icon={<WhatsAppIcon className="size-5" />}
            data-track="whatsapp_click"
            data-track-label="hero"
          >
            Falar pelo WhatsApp
          </ButtonLink>
          <ButtonLink
            href="/destinos"
            variant="ghost-light"
            size="lg"
            icon={<Compass className="size-5" aria-hidden="true" />}
          >
            Explorar peregrinações
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

/** Banner de uma peregrinação: foto do roteiro com véu azul + arte de divulgação ao lado (telas largas). */
function TripSlide({ trip }: { trip: TripCardData }) {
  const when = formatDateRange(trip.startDate, trip.endDate)
  const duration = durationLabel(trip.days, trip.nights)
  const art = trip.cardArt
  const photo = trip.image ?? art
  return (
    <div className="relative isolate flex w-full items-center">
      {photo ? (
        <Image
          src={photo.url}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
          style={{
            objectPosition: trip.image ? `${trip.image.focalX}% ${trip.image.focalY}%` : 'center',
          }}
          aria-hidden="true"
        />
      ) : null}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(4_26_54/0.92)_0%,rgb(4_26_54/0.7)_55%,rgb(4_26_54/0.45)_100%),linear-gradient(180deg,rgb(4_26_54/0.45)_0%,transparent_35%,rgb(4_26_54/0.75)_100%)]"
        aria-hidden="true"
      />
      <div className="container-site grid items-center gap-10 pt-28 pb-40 sm:pb-48 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
        <div>
          <p className="eyebrow-light mb-4 inline-flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden="true" /> Peregrinação em destaque
          </p>
          {trip.countries.length ? (
            <p className="font-display text-xl text-gold-200 italic sm:text-2xl">
              {trip.countries.join(' · ')}
            </p>
          ) : null}
          <h2 className="mt-2 max-w-3xl text-[2.4rem] leading-[1.04] font-medium text-white sm:text-6xl">
            {trip.title}
          </h2>
          {trip.cities.length ? (
            <p className="mt-4 max-w-2xl font-label text-xs font-semibold tracking-[0.14em] text-white/75 uppercase sm:text-sm">
              {trip.cities.join(' | ')}
            </p>
          ) : null}
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base text-white/90 sm:text-lg">
            {when ? (
              <li className="flex items-center gap-2">
                <CalendarDays className="size-5 text-gold-300" aria-hidden="true" /> {when}
              </li>
            ) : null}
            {duration ? <li>{duration}</li> : null}
            {trip.departureCity ? (
              <li className="flex items-center gap-2">
                <PlaneTakeoff className="size-5 text-gold-300" aria-hidden="true" /> Saída de{' '}
                {trip.departureCity}
              </li>
            ) : null}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={trip.href}
              variant="gold"
              size="lg"
              iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}
              data-track="trip_card_click"
              data-track-label="hero-banner"
              data-track-trip={trip.slug}
            >
              Conheça o roteiro completo
            </ButtonLink>
            <ButtonLink href="/destinos" variant="ghost-light" size="lg">
              Ver todas as peregrinações
            </ButtonLink>
          </div>
        </div>
        {trip.cardArt ? (
          <div className="relative mx-auto hidden w-full max-w-[340px] lg:block">
            <div
              className="relative overflow-hidden rounded-[var(--radius-card)] shadow-deep ring-1 ring-white/25"
              style={{ aspectRatio: `${trip.cardArt.width} / ${trip.cardArt.height}` }}
            >
              <Image
                src={trip.cardArt.url}
                alt={trip.cardArt.alt || `Arte de divulgação: ${trip.title}`}
                fill
                sizes="340px"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TrivvaSlide() {
  return (
    <div className="relative isolate flex w-full items-center bg-[linear-gradient(135deg,#041a36_0%,#0a2e5c_55%,#0f4c81_100%)]">
      <Image
        src="/assets/logos/raios-via-lumina.webp"
        alt=""
        width={636}
        height={1280}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -right-10 -z-10 h-full w-auto max-w-none opacity-[0.12] select-none"
      />
      <div className="container-site pt-28 pb-40 sm:pb-48">
        <p className="eyebrow-light mb-4">Parceria Via Lumina + Trivva</p>
        <h2 className="max-w-4xl text-[2.2rem] leading-[1.08] font-medium text-white sm:text-5xl lg:text-6xl">
          Inscreva-se em sua peregrinação e garanta também com a nossa parceira{' '}
          <span className="text-gold-300">Trivva</span> a sua viagem de férias.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/80">
          Cadastre-se pelo link da Via Lumina e conheça o clube de turismo da Trivva.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={TRIVVA_SIGNUP_URL}
            variant="gold"
            size="lg"
            iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
            data-track="promo_click"
            data-track-label="hero-trivva-inscricao"
          >
            Inscrever-se na Trivva
          </ButtonLink>
          <ButtonLink
            href="/promocoes/trivva"
            variant="ghost-light"
            size="lg"
            data-track="promo_click"
            data-track-label="hero-trivva-saiba-mais"
          >
            Saiba mais sobre a parceria
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

function CrescerSlide() {
  return (
    <div
      className="relative isolate flex w-full flex-col justify-center pt-20"
      style={{ backgroundColor: CRESCER.banner.color }}
    >
      <Image
        src={CRESCER.banner.src}
        alt={CRESCER.bannerAlt}
        width={CRESCER.banner.width}
        height={CRESCER.banner.height}
        sizes="100vw"
        className="h-auto w-full"
      />
      <div className="container-site flex flex-col items-center justify-between gap-5 pt-6 pb-40 text-center sm:pb-48 lg:flex-row lg:text-left">
        <div>
          <h2 className="text-2xl leading-tight font-medium text-white sm:text-3xl">
            {CRESCER.name} — {CRESCER.fullName}
          </h2>
          <p className="mt-1 text-lg text-white/85">
            {CRESCER.dates} · {CRESCER.place}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={CRESCER.signupUrl}
            variant="gold"
            iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
            data-track="promo_click"
            data-track-label="hero-crescer-inscricao"
          >
            Inscreva-se grátis
          </ButtonLink>
          <ButtonLink
            href="/promocoes/crescer"
            variant="ghost-light"
            data-track="promo_click"
            data-track-label="hero-crescer-saiba-mais"
          >
            Saiba mais
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

/**
 * Hero da home em carrossel: apresentação da Via Lumina, principais roteiros e banners das parcerias
 * (Trivva e Crescer), intercalados para que as promoções apareçam logo no primeiro ciclo.
 */
export function HomeHero({
  whatsappHref,
  trips = [],
}: {
  whatsappHref: string
  trips?: TripCardData[]
}) {
  const tripSlides: HeroSlide[] = trips
    .slice(0, HERO_TRIPS)
    .map((trip) => ({
      id: `roteiro-${trip.slug}`,
      label: trip.title,
      node: <TripSlide trip={trip} />,
    }))
  const trivva: HeroSlide = {
    id: 'promo-trivva',
    label: 'Parceria Trivva: sua viagem de férias',
    node: <TrivvaSlide />,
  }
  const crescer: HeroSlide = {
    id: 'promo-crescer',
    label: `${CRESCER.name}: ${CRESCER.fullName}`,
    node: <CrescerSlide />,
  }

  const slides: HeroSlide[] = [
    {
      id: 'via-lumina',
      label: 'Via Lumina Viagens',
      node: <BrandSlide whatsappHref={whatsappHref} />,
    },
    ...(tripSlides[0] ? [tripSlides[0]] : []),
    trivva,
    ...(tripSlides[1] ? [tripSlides[1]] : []),
    crescer,
    ...tripSlides.slice(2),
  ]

  return (
    <HeroCarousel
      slides={slides}
      footer={
        <div className="absolute inset-x-0 bottom-0 z-[5] hidden border-t border-white/15 bg-navy-950/35 backdrop-blur-md sm:block">
          <ul className="container-site flex items-center justify-center gap-10 py-5 font-label text-sm font-semibold tracking-wide text-white/90">
            <li className="flex items-center gap-2.5">
              <HandHeart className="size-5 text-gold-300" aria-hidden="true" /> {HERO.badges[0]}
            </li>
            <li className="flex items-center gap-2.5">
              <Headset className="size-5 text-gold-300" aria-hidden="true" /> {HERO.badges[1]}
            </li>
          </ul>
        </div>
      }
    />
  )
}
