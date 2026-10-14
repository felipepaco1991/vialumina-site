import { BedDouble, CalendarDays, CircleCheck, CircleX, FileDown, Info, Luggage, Mail, MessageSquareText, PlaneTakeoff, Route, UserRound } from 'lucide-react'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ARBO } from '@/content/institutional'
import { cn } from '@/lib/cn'
import { formatBrl, formatDateRange, formatForeign, formatShortDate } from '@/lib/format'
import type { TripDetailData } from '@/lib/trip-model'

type WithTrip = { trip: TripDetailData }

// --- Hero ------------------------------------------------------------------------

export function TripHero({ trip, whatsappHref }: WithTrip & { whatsappHref: string }) {
  const img = trip.image
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {img ? (
        <Image
          src={img.url}
          alt={img.alt}
          fill
          preload
          sizes="100vw"
          className="-z-10 animate-[hero-zoom_14s_ease-out_both] object-cover"
          style={{ objectPosition: `${img.focalX}% ${img.focalY}%` }}
        />
      ) : null}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_22_43/0.55)_0%,rgb(4_22_43/0.2)_38%,rgb(4_22_43/0.88)_100%),linear-gradient(90deg,rgb(4_22_43/0.6)_0%,rgb(4_22_43/0.15)_60%,transparent_100%)]"
        aria-hidden="true"
      />
      <div className="container-site flex min-h-[min(92svh,820px)] flex-col justify-end pt-32 pb-14 sm:pb-20">
        <Breadcrumbs items={[{ label: 'Destinos', href: '/destinos' }, { label: trip.title, href: trip.internalHref }]} className="mb-8 animate-fade-up" />
        <div className="mb-6 flex animate-fade-up flex-wrap gap-2 [animation-delay:60ms]">
          {trip.periodTag ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-1.5 font-label text-xs font-bold tracking-wider text-navy-950 uppercase">
              <CalendarDays className="size-4" aria-hidden="true" /> {trip.periodTag}
            </span>
          ) : null}
          {trip.departureTag ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 font-label text-xs font-bold tracking-wider text-navy-900 uppercase">
              <PlaneTakeoff className="size-4" aria-hidden="true" /> {trip.departureTag}
            </span>
          ) : null}
        </div>
        <h1 className="max-w-5xl animate-[rise_0.9s_var(--ease-out-soft)_both] text-[2.75rem] leading-[0.98] font-medium text-white [animation-delay:120ms] [text-shadow:0_10px_35px_rgb(0_0_0/0.18)] sm:text-7xl lg:text-[6rem]">
          {trip.title}
        </h1>
        {trip.subtitle ? (
          <p className="mt-5 max-w-4xl animate-fade-up font-label text-[0.8rem] font-semibold tracking-[0.18em] text-gold-200 uppercase [animation-delay:180ms] sm:text-sm">
            {trip.subtitle}
          </p>
        ) : null}
        <div className="mt-6 h-[3px] w-24 origin-left animate-[rule-grow_1s_var(--ease-out-soft)_0.3s_both] rounded-full bg-gold-450" aria-hidden="true" />

        <div className="mt-8 grid animate-fade-up gap-8 [animation-delay:260ms] lg:grid-cols-[1.3fr_1fr] lg:items-end">
          {trip.description ? <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">{trip.description}</p> : <span />}
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={whatsappHref}
                variant="whatsapp"
                size="lg"
                icon={<WhatsAppIcon className="size-5" />}
                data-track="whatsapp_click"
                data-track-label="hero-roteiro"
                data-track-trip={trip.slug}
              >
                Quero saber mais!
              </ButtonLink>
              <ButtonLink href="#programacao" variant="ghost-light" size="lg" icon={<Route className="size-5" aria-hidden="true" />}>
                Ver programação
              </ButtonLink>
            </div>
            {trip.limitedNote ? (
              <p className="max-w-sm rounded-r-xl border-l-[3px] border-gold-450 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/90 backdrop-blur-sm">{trip.limitedNote}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Ficha da viagem -------------------------------------------------------------

export function TripFacts({ trip }: WithTrip) {
  const facts = [
    {
      icon: CalendarDays,
      label: 'Período',
      value: formatDateRange(trip.startDate, trip.endDate),
      extra: [trip.days ? `${trip.days} dias` : null, trip.nights ? `${trip.nights} noites` : null].filter(Boolean).join(' · '),
    },
    { icon: PlaneTakeoff, label: 'Embarque', value: trip.departureAirport ?? trip.departureCity, extra: null },
    { icon: BedDouble, label: 'Acomodação', value: trip.accommodation, extra: null },
    { icon: Luggage, label: 'Bagagem', value: trip.baggage, extra: null },
    ...trip.guides.map((g) => ({ icon: UserRound, label: g.role, value: g.name, extra: null })),
  ].filter((f) => f.value)

  const cols = facts.length <= 4 ? { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }[Math.max(2, facts.length) as 2 | 3 | 4] : 'lg:grid-cols-3'

  return (
    <section id="resumo" aria-label="Resumo da viagem" className="relative z-10 scroll-mt-36 bg-cream-50">
      <div className="container-site">
        <Reveal>
          <dl className={cn('-mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-navy-900/[0.07] shadow-deep ring-1 ring-navy-900/5 sm:grid-cols-2 lg:-mt-14', cols)}>
            {facts.map((f, i) => (
              <div
                key={`${f.label}-${f.value}`}
                className={cn(
                  'bg-white py-6 pr-6 pl-20',
                  // Última célula ocupa o espaço restante da linha (sem lacunas na grade).
                  i === facts.length - 1 && facts.length % 2 === 1 && 'sm:col-span-2 lg:col-span-1',
                  i === facts.length - 1 && facts.length > 4 && { 1: 'lg:col-span-3', 2: 'lg:col-span-2', 0: '' }[facts.length % 3],
                )}
              >
                <dt className="relative font-label text-xs font-bold tracking-[0.16em] text-slate-500 uppercase">
                  <span className="absolute top-0 -left-14 inline-flex size-10 items-center justify-center rounded-full bg-gold-100 text-gold-700" aria-hidden="true">
                    <f.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  {f.label}
                </dt>
                <dd className="mt-1.5 leading-snug font-semibold text-navy-900">{f.value}</dd>
                {f.extra ? <dd className="mt-0.5 text-sm text-slate-500">{f.extra}</dd> : null}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

// --- Direção espiritual ------------------------------------------------------------

export function GuideFeature({ trip }: WithTrip) {
  const { guideProfiles: people, guidance } = trip
  if (!people.length && !guidance.heading) return null
  const dual = people.length > 1
  return (
    <section id="acompanhamento" aria-labelledby="acompanhamento-titulo" className="scroll-mt-36 bg-cream-50 py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="grid overflow-hidden rounded-[var(--radius-panel)] bg-white shadow-deep ring-1 ring-navy-900/5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className={cn('grid bg-[linear-gradient(160deg,#143f72,#0a2e5c)]', dual && 'grid-cols-2')}>
            {people.map((p) => (
              <figure key={p.name} className={cn('relative min-h-0 overflow-hidden lg:aspect-auto lg:min-h-[520px]', dual ? 'aspect-[3/4]' : 'aspect-[3/4] sm:aspect-[4/3]')}>
                {p.photo ? (
                  <Image
                    src={p.photo.url}
                    alt={p.photo.alt}
                    fill
                    sizes={dual ? '(min-width: 1024px) 250px, 50vw' : '(min-width: 1024px) 480px, 100vw'}
                    className="object-cover object-top"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute inset-x-5 bottom-5 text-white">
                  <span className="block font-label text-xs font-bold tracking-[0.18em] text-gold-200 uppercase">{p.role}</span>
                  <strong className={cn('mt-1 block font-display leading-tight font-semibold', dual ? 'text-xl sm:text-2xl' : 'text-[1.9rem]')}>{p.name}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <SectionHeading
              id="acompanhamento-titulo"
              eyebrow={guidance.eyebrow || 'Peregrinação guiada'}
              title={guidance.heading || 'Direção espiritual durante toda a jornada'}
              intro={guidance.lead}
            />
            {guidance.points.length ? (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {guidance.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[0.98rem] leading-relaxed text-slate-700">
                    <span className="mt-2 size-2 shrink-0 rotate-45 bg-gold-450" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
            {people.some((p) => p.bio) ? (
              <div className="mt-8 space-y-3 border-t border-navy-900/10 pt-6 text-slate-700">
                {people.filter((p) => p.bio).map((p) => (
                  <p key={p.name}>
                    <strong className="text-navy-900">{p.name}:</strong> {p.bio}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// --- Destaques -------------------------------------------------------------------------

export function Highlights({ trip }: WithTrip) {
  const h = trip.highlights
  if (!h.cards.length) return null
  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="scroll-mt-36 bg-white py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionHeading id="destaques-titulo" eyebrow="Destaques do itinerário" title={h.heading || 'Caminhos da fé católica'} intro={h.intro} align="center" />
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {h.cards.map((c, i) => (
            <Reveal
              as="li"
              key={c.title}
              delay={i * 0.07}
              className="group rounded-[var(--radius-card)] border-t-[3px] border-transparent bg-cream-50 p-7 ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:border-gold-450 hover:bg-white hover:shadow-lift"
            >
              {c.place ? <p className="eyebrow">{c.place}</p> : null}
              <h3 className="mt-2.5 text-[1.4rem] leading-snug font-medium">{c.title}</h3>
              {c.text ? <p className="mt-3 text-[0.97rem] leading-relaxed text-slate-700">{c.text}</p> : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// --- Pacote: incluído / não incluído ---------------------------------------------

const sentence = (s: string) => s.replace(/:$/, '').toLowerCase().replace(/^./, (c) => c.toUpperCase())

export function PackageDetails({ trip }: WithTrip) {
  const p = trip.packageSummary
  return (
    <section id="pacote" aria-labelledby="pacote-titulo" className="scroll-mt-36 bg-cream-50 py-20 sm:py-24">
      <div className="container-site">
        {p.heading ? (
          <Reveal className="mb-10 grid gap-6 rounded-[22px] bg-[linear-gradient(135deg,#0a2e5c,#0f4c81)] p-8 text-white sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <h2 id="pacote-titulo" className="text-[1.8rem] leading-tight font-medium text-white sm:text-[2rem]">
                {p.heading}
              </h2>
              {p.text ? <p className="mt-3 leading-relaxed text-white/80">{p.text}</p> : null}
            </div>
            {p.tags.length ? (
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-label text-xs font-semibold tracking-wide">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ) : (
          <h2 id="pacote-titulo" className="sr-only">
            O pacote
          </h2>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-card)] border-t-4 border-navy-900 bg-white p-8 shadow-soft sm:p-10">
            <h3 className="font-display text-2xl text-navy-900">{sentence(trip.included.title)}</h3>
            <ul className="mt-6 space-y-3.5">
              {trip.included.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-slate-700">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-whatsapp" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[var(--radius-card)] border-t-4 border-alert bg-white p-8 shadow-soft sm:p-10">
            <h3 className="font-display text-2xl text-navy-900">{sentence(trip.notIncluded.title)}</h3>
            <ul className="mt-6 space-y-3.5">
              {trip.notIncluded.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-slate-700">
                  <CircleX className="mt-0.5 size-5 shrink-0 text-alert" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// --- Valores e observações -----------------------------------------------------------

export function PricingAndTerms({ trip, whatsappHref }: WithTrip & { whatsappHref: string }) {
  const price = trip.price
  return (
    <section id="valores" aria-labelledby="valores-titulo" className="scroll-mt-36 bg-white py-20 sm:py-24">
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal>
          <SectionHeading id="valores-titulo" eyebrow="Investimento" title="Valores e condições" />
          {price?.totalBrl ? (
            <div className="relative mt-8 overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(160deg,#041a36,#0a2e5c_55%,#0d3568)] p-8 text-white shadow-deep sm:p-10">
              <p className="absolute top-6 -right-10 w-44 rotate-[34deg] bg-gold-200 py-1 text-center font-label text-[0.55rem] font-bold tracking-[0.14em] text-navy-950 uppercase">
                Condição informada
              </p>
              {price.installmentsCount && price.installmentValueBrl ? (
                <>
                  <p className="font-label text-sm font-semibold tracking-wide text-gold-200">{price.installmentsCount}x de</p>
                  <p className="font-display text-5xl leading-none sm:text-6xl">{formatBrl(price.installmentValueBrl)}</p>
                  {price.extraInstallments ? <p className="mt-2 text-white/80">{price.extraInstallments}</p> : null}
                  {price.entryText ? <p className="mt-3 text-white/80">{price.entryText}</p> : null}
                  <hr className="my-6 border-white/15" />
                </>
              ) : null}
              <p className="font-label text-xs font-bold tracking-[0.16em] text-white/60 uppercase">Valor total</p>
              <p className="mt-1 font-display text-3xl">{formatBrl(price.totalBrl)}</p>
              {price.currency !== 'BRL' && price.totalOriginalCurrency ? (
                <p className="mt-1 font-label text-lg font-semibold text-gold-200">{formatForeign(price.totalOriginalCurrency, price.currency)}</p>
              ) : null}
              {price.exchangeRate && price.exchangeRateDate ? (
                <p className="mt-4 text-sm text-white/60">
                  Câmbio de referência: {price.currency} 1,00 = {formatBrl(price.exchangeRate)} em {formatShortDate(price.exchangeRateDate)}
                </p>
              ) : null}
              {price.conditions.length ? (
                <div className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/75">
                  {price.conditions.map((c) => (
                    <p key={c}>{c}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--radius-card)] bg-cream-100 p-8 ring-1 ring-gold-450/30 sm:p-10">
              <Info className="size-7 text-gold-700" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl text-navy-900">Consulte as condições atuais</h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Valores, câmbio de referência e formas de pagamento são confirmados pela nossa equipe no momento do atendimento, conforme a disponibilidade de vagas.
              </p>
              <ButtonLink
                href={whatsappHref}
                variant="whatsapp"
                className="mt-6"
                icon={<WhatsAppIcon className="size-5" />}
                data-track="whatsapp_click"
                data-track-label="valores-roteiro"
                data-track-trip={trip.slug}
              >
                Consultar valores
              </ButtonLink>
            </div>
          )}
        </Reveal>

        {trip.observations.paragraphs.length ? (
          <Reveal delay={0.08} className="rounded-[var(--radius-card)] bg-cream-50 p-8 ring-1 ring-navy-900/5 sm:p-10 lg:mt-[7.5rem]">
            <h3 className="font-label text-sm font-bold tracking-[0.16em] text-navy-900 uppercase">{trip.observations.heading.replace(/:$/, '')}</h3>
            <div className="mt-5 space-y-4 text-[0.97rem] leading-relaxed text-slate-700">
              {trip.observations.paragraphs.map((p) =>
                p.emphasis ? (
                  <p key={p.text} className="rounded-xl bg-white p-4 text-sm text-navy-900 italic ring-1 ring-gold-450/30">
                    {p.text}
                  </p>
                ) : (
                  // Cláusulas separadas por " | " no original viram parágrafos, sem alteração de texto.
                  p.text.split(/\s+\|\s+/).map((part) => <p key={part}>{part}</p>)
                ),
              )}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

// --- Grupo Arbo -------------------------------------------------------------------------

export function ArboBand() {
  return (
    <section aria-label="Grupo Arbo" className="bg-white pb-20 sm:pb-24">
      <div className="container-site">
        <Reveal className="grid overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_40%,#0d3568_70%,#071f42_100%)] text-white shadow-deep md:grid-cols-[300px_1fr]">
          <div className="flex flex-col items-center justify-center gap-5 border-b border-white/10 p-10 md:border-r md:border-b-0">
            <span className="font-label text-xs font-bold tracking-[0.2em] text-white/60 uppercase">{ARBO.kicker}</span>
            <Image src="/assets/logos/grupo-arbo.webp" alt="Grupo Arbo" width={200} height={63} className="h-auto w-44" />
            <p className="text-center">
              <span className="block font-display text-5xl text-gold-200">{ARBO.badge.value}</span>
              <span className="font-label text-xs font-semibold tracking-wider text-white/70 uppercase">{ARBO.badge.label}</span>
            </p>
          </div>
          <div className="p-10 sm:p-12">
            <h2 className="font-display text-[1.8rem] leading-tight text-white">{ARBO.title}</h2>
            {ARBO.paragraphs.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-white/80">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// --- Conversão ----------------------------------------------------------------------

export function TripCta({ trip, whatsappHref, contactHref }: WithTrip & { whatsappHref: string; contactHref: string }) {
  return (
    <section id="contato-roteiro" aria-labelledby="cta-roteiro-titulo" className="relative isolate scroll-mt-36 overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
      <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} className="absolute -top-20 -right-28 -z-10 w-[360px] opacity-10" aria-hidden="true" />
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          {trip.finalCta.kicker ? <p className="eyebrow-light mb-4">{trip.finalCta.kicker}</p> : null}
          <h2 id="cta-roteiro-titulo" className="text-[2.2rem] leading-[1.08] font-medium text-white sm:text-5xl">
            {trip.finalCta.heading}
          </h2>
          {trip.finalCta.text ? <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{trip.finalCta.text}</p> : null}
          {trip.contact ? (
            <p className="mt-5 text-white/80">
              Contato desta peregrinação: <strong className="text-white">{trip.contact.name}</strong>
            </p>
          ) : null}
          <div className="mt-9 flex flex-col flex-wrap gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappHref}
              variant="whatsapp"
              size="lg"
              icon={<WhatsAppIcon className="size-5" />}
              data-track="whatsapp_click"
              data-track-label="cta-roteiro"
              data-track-trip={trip.slug}
            >
              Falar pelo WhatsApp
            </ButtonLink>
            <ButtonLink
              href={contactHref}
              variant="ghost-light"
              size="lg"
              icon={<MessageSquareText className="size-5" aria-hidden="true" />}
              data-track="info_request"
              data-track-label="cta-roteiro"
              data-track-trip={trip.slug}
            >
              Solicitar informações
            </ButtonLink>
            {trip.contact?.email ? (
              <ButtonLink href={`mailto:${trip.contact.email}?subject=${encodeURIComponent(trip.title)}`} variant="ghost-light" size="lg" icon={<Mail className="size-5" aria-hidden="true" />}>
                Enviar e-mail
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>
        {trip.pdf ? (
          <Reveal delay={0.1}>
            <a
              href={trip.pdf.url}
              download
              target="_blank"
              rel="noopener"
              data-track="pdf_download"
              data-track-trip={trip.slug}
              className="group flex items-center gap-5 rounded-[var(--radius-card)] border border-white/15 bg-white/[0.06] p-4 pr-6 backdrop-blur transition hover:border-gold-300 hover:bg-white/10"
            >
              {trip.cardArt ? (
                <span className="relative block aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl shadow-deep">
                  <Image src={trip.cardArt.url} alt="" fill sizes="112px" className="object-cover transition duration-700 group-hover:scale-105" />
                </span>
              ) : null}
              <span>
                <span className="flex items-center gap-2 font-label text-xs font-bold tracking-[0.16em] text-gold-200 uppercase">
                  <FileDown className="size-4" aria-hidden="true" /> Roteiro em PDF
                </span>
                <span className="mt-2 block font-display text-xl leading-snug text-white">Baixar roteiro completo</span>
                <span className="mt-1 block text-sm text-white/60">Para ler com calma e compartilhar com a família</span>
              </span>
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
