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
import type { CSSProperties } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { HERO } from '@/content/institutional'
import { HERO_DIRECTORS } from '@/content/hero-diretores'
import { CRESCER, TRIVVA_SIGNUP_URL } from '@/content/promocoes'
import { formatDateRange } from '@/lib/format'
import type { TripCardData } from '@/lib/trip-model'
import { durationLabel } from '@/components/trips/TripCard'
import { HeroCarousel, type HeroSlide } from './HeroCarousel'
import { HeroDirectorFigure } from './HeroDirector'

/** Quantas peregrinações entram no carrossel (além da apresentação e dos banners de parceiros). */
export const HERO_TRIPS = 3

function BrandSlide({ whatsappHref }: { whatsappHref: string }) {
  return (
    <div className="relative isolate flex w-full items-start lg:items-center">
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
  // Direção espiritual em destaque (só roteiros cadastrados em HERO_DIRECTORS e com o guia no CMS).
  const directorArt = HERO_DIRECTORS[trip.slug]
  const guide = trip.guides.find((g) => /dire[cç][aã]o espiritual/i.test(g.role)) ?? trip.guides[0]
  const director = directorArt && guide ? { art: directorArt, name: guide.name, role: guide.role } : null
  return (
    <div className="relative isolate flex w-full items-start lg:items-center">
      {director ? (
        <Image
          src={director.art.background.src}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
          style={{ objectPosition: director.art.background.position ?? 'center' }}
          aria-hidden="true"
        />
      ) : photo ? (
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
      {director ? (
        <>
          {/* Celular: texto e figura em coluna, véu uniforme para manter o texto legível. */}
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_26_54/0.82)_0%,rgb(4_26_54/0.62)_45%,rgb(4_26_54/0.35)_100%)] lg:hidden"
            aria-hidden="true"
          />
          {/* Telas largas: azul-marinho à esquerda (texto) abrindo para a luz dourada da foto, como na arte. */}
          <div
            className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(6_28_60/0.88)_0%,rgb(6_28_60/0.76)_28%,rgb(6_28_60/0.4)_50%,transparent_72%),linear-gradient(180deg,rgb(4_26_54/0.45)_0%,transparent_18%,transparent_72%,rgb(4_26_54/0.45)_100%)] lg:block"
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(4_26_54/0.92)_0%,rgb(4_26_54/0.7)_55%,rgb(4_26_54/0.45)_100%),linear-gradient(180deg,rgb(4_26_54/0.45)_0%,transparent_35%,rgb(4_26_54/0.75)_100%)]"
          aria-hidden="true"
        />
      )}
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
            <ButtonLink href="/destinos" variant="ghost-light" size="lg" className="max-sm:hidden">
              Ver todas as peregrinações
            </ButtonLink>
          </div>
        </div>
        {director ? (
          <HeroDirectorFigure director={director.art} name={director.name} role={director.role} />
        ) : trip.cardArt ? (
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

/** Banner claro da parceria com a Trivva: fundo em degradê lilás/turquesa, headline com o logotipo e a colagem de serviços. */
function TrivvaSlide() {
  const btn =
    'bg-[#f26a1b] text-white shadow-[0_14px_32px_rgb(242_106_27/0.3)] hover:bg-[#dc5a10] focus-visible:outline-[#f26a1b]'
  return (
    <div className="relative isolate flex w-full items-center bg-white">
      <Image
        src="/assets/promocoes/trivva-fundo.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
        aria-hidden="true"
      />
      <div className="container-site pt-28 pb-40 sm:pb-48">
        <div className="lg:max-w-[min(50%,40rem)]">
          <p className="font-label text-xs font-bold tracking-[0.2em] text-[#5b1fc4] uppercase">
            Parceria Via Lumina + Trivva
          </p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.1] font-medium text-[#1c1a38] sm:text-5xl lg:text-[3.1rem]">
            Inscreva-se em sua peregrinação e garanta também com a nossa parceira{' '}
            <Image
              src="/assets/promocoes/trivva-logo.webp"
              alt="Trivva"
              width={984}
              height={282}
              className="inline-block h-[0.82em] w-auto align-baseline"
            />{' '}
            a sua viagem de férias.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-[#55536e]">
            Cadastre-se pelo link da Via Lumina e conheça o clube de turismo da Trivva.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={TRIVVA_SIGNUP_URL}
              size="lg"
              className={btn}
              iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
              data-track="promo_click"
              data-track-label="hero-trivva-inscricao"
            >
              Inscrever-se na Trivva
            </ButtonLink>
            <ButtonLink
              href="/promocoes/trivva"
              variant="outline"
              size="lg"
              className="border-[#5b1fc4]/40 bg-white/60 text-[#1c1a38] hover:border-[#5b1fc4]"
              data-track="promo_click"
              data-track-label="hero-trivva-saiba-mais"
            >
              Saiba mais sobre a parceria
            </ButtonLink>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-md lg:pointer-events-none lg:absolute lg:top-[48%] lg:right-[2%] lg:mt-0 lg:w-[min(47vw,84svh)] lg:max-w-none lg:-translate-y-1/2">
          <Image
            src="/assets/promocoes/trivva-colagem.webp"
            alt="Hotel, aéreo, passeios, locação de veículos, cruzeiros, shows e experiências: os serviços do clube de turismo Trivva"
            width={1322}
            height={1037}
            sizes="(min-width: 1024px) 47vw, 448px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}

/** Data e local do 30º Crescer, em destaque (como na arte do encontro). */
function CrescerDate({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-label leading-[0.95] font-extrabold text-[#fbbf24]">
        <span className="text-[length:var(--cr-digit)]">5</span>
        <span className="mx-[0.15em] align-baseline text-[length:var(--cr-a)] text-white">a</span>
        <span className="text-[length:var(--cr-digit)]">9</span>
      </p>
      <p className="mt-[0.5em] font-label text-[length:var(--cr-small)] leading-[1.2] font-bold tracking-[0.1em] text-white uppercase">
        de fevereiro
        <br />
        de 2027
      </p>
      <div className="my-[1em] ml-auto h-px w-[72%] bg-[#fbbf24]/80" aria-hidden="true" />
      <p className="font-label text-[length:var(--cr-place)] leading-[1.1] font-extrabold tracking-[0.04em] text-white uppercase">
        Campina
        <br />
        Grande <span className="text-[#fbbf24]">– PB</span>
      </p>
    </div>
  )
}

/**
 * Banner do 30º Crescer, recriado em camadas (fundo roxo com vitrais, logotipo, Sagrada Família, data
 * e passarinho/coração) com a barra de informações embaixo. Em telas largas a composição é um "palco"
 * proporcional (medidas em cqw) e se reduz em telas mais baixas para caber com os controles.
 */
function CrescerSlide() {
  return (
    <div className="relative isolate flex w-full flex-col justify-start bg-[#28055f] pt-[4.5rem] pb-32 lg:pt-20">
      <Image
        src="/assets/promocoes/crescer-fundo.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
        aria-hidden="true"
      />

      {/* Telas largas: palco proporcional 1672 × 685 */}
      <div
        className="relative mx-auto hidden aspect-[1672/685] w-[min(100%,calc((100svh-20.5rem)*2.44))] overflow-hidden [container-type:inline-size] lg:block"
        style={
          {
            '--cr-digit': '7.9cqw',
            '--cr-a': '3.1cqw',
            '--cr-small': '1.7cqw',
            '--cr-place': '1.95cqw',
          } as CSSProperties
        }
      >
        <Image
          src="/assets/promocoes/crescer-logo.webp"
          alt="30 anos do Crescer — Encontro Nacional da Família Católica"
          width={519}
          height={341}
          sizes="30vw"
          className="absolute top-[20%] left-[10.5%] h-auto w-[29.5%]"
        />
        <div className="absolute top-[69.5%] left-[10.3%] w-[31%]">
          <div className="mb-[1.5cqw] h-px w-[88%] bg-[#fbbf24]/70" aria-hidden="true" />
          <p className="font-label text-[1.3cqw] font-bold tracking-[0.09em] whitespace-nowrap text-white uppercase">
            <span className="text-[#fbbf24]">Ame sua família,</span> encontre a paz.
          </p>
        </div>
        <Image
          src="/assets/promocoes/crescer-familia.webp"
          alt="Sagrada Família: Maria, José e o Menino Jesus"
          width={1122}
          height={1402}
          sizes="32vw"
          className="absolute bottom-0 left-[39.8%] h-auto w-[31.8%]"
        />
        <CrescerDate className="absolute top-[25.5%] right-[12.2%] text-right" />
        <Image
          src="/assets/promocoes/crescer-passaro.webp"
          alt=""
          width={406}
          height={258}
          sizes="10vw"
          className="absolute top-[80%] left-[3.3%] h-auto w-[9.7%]"
          aria-hidden="true"
        />
        <Image
          src="/assets/promocoes/crescer-coracao.webp"
          alt=""
          width={324}
          height={266}
          sizes="8vw"
          className="absolute top-[80%] right-[4.9%] h-auto w-[7.9%]"
          aria-hidden="true"
        />
      </div>

      {/* Celular: composição em coluna */}
      <div className="container-site flex flex-col items-center pt-6 text-center lg:hidden">
        <Image
          src="/assets/promocoes/crescer-logo.webp"
          alt="30 anos do Crescer — Encontro Nacional da Família Católica"
          width={519}
          height={341}
          sizes="80vw"
          className="h-auto w-[min(78%,20rem)]"
        />
        <p className="mt-4 font-label text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase">
          <span className="text-[#fbbf24]">Ame sua família,</span> encontre a paz.
        </p>
        <div className="mt-6 flex w-full items-center justify-center gap-6">
          <Image
            src="/assets/promocoes/crescer-familia.webp"
            alt="Sagrada Família: Maria, José e o Menino Jesus"
            width={1122}
            height={1402}
            sizes="50vw"
            className="h-auto w-[min(58%,13rem)]"
          />
          <CrescerDate
            className="text-left [--cr-a:1.5rem] [--cr-digit:3.6rem] [--cr-place:0.92rem] [--cr-small:0.9rem]"
          />
        </div>
      </div>

      {/* Barra de informações (como no rodapé da arte) */}
      <div className="container-site mt-5 lg:mt-3">
        <div className="mx-auto flex flex-col items-center justify-between gap-5 border-t border-white/20 pt-5 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-display text-2xl leading-tight font-semibold text-white sm:text-3xl lg:text-[1.45rem] xl:text-[1.6rem]">
              {CRESCER.name} — {CRESCER.fullName}
            </h2>
            <p className="mt-1 text-base text-white/85 sm:text-lg">
              {CRESCER.dates} · {CRESCER.place}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={CRESCER.signupUrl}
              variant="gold"
              size="lg"
              className="bg-[#fbbf24] hover:bg-[#fcd34d]"
              iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
              data-track="promo_click"
              data-track-label="hero-crescer-inscricao"
            >
              Inscreva-se grátis
            </ButtonLink>
            <ButtonLink
              href="/promocoes/crescer"
              variant="ghost-light"
              size="lg"
              className="border-white/30 bg-[#3a0a86]/70"
              data-track="promo_click"
              data-track-label="hero-crescer-saiba-mais"
            >
              Saiba mais
            </ButtonLink>
          </div>
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
    tone: 'light',
    node: <TrivvaSlide />,
  }
  const crescer: HeroSlide = {
    id: 'promo-crescer',
    label: `${CRESCER.name}: ${CRESCER.fullName}`,
    tone: 'purple',
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
        <div className="absolute inset-x-0 bottom-0 z-[5] hidden border-t border-white/15 bg-navy-950/35 backdrop-blur-md transition-colors duration-500 group-data-[tone=light]/hero:border-navy-900/10 group-data-[tone=light]/hero:bg-white/70 sm:block">
          <ul className="container-site flex items-center justify-center gap-10 py-5 font-label text-sm font-semibold tracking-wide text-white/90 transition-colors duration-500 group-data-[tone=light]/hero:text-navy-900">
            <li className="flex items-center gap-2.5">
              <HandHeart className="size-5 text-gold-300 group-data-[tone=light]/hero:text-gold-700" aria-hidden="true" /> {HERO.badges[0]}
            </li>
            <li className="flex items-center gap-2.5">
              <Headset className="size-5 text-gold-300 group-data-[tone=light]/hero:text-gold-700" aria-hidden="true" /> {HERO.badges[1]}
            </li>
          </ul>
        </div>
      }
    />
  )
}
