import { BedDouble, Briefcase, Building2, Compass, Cross, Headset, HeartHandshake, Landmark, Map, MapPinned, Route, ShieldCheck, Store, UserRoundCheck, UsersRound, CalendarCheck2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Benefit, Step } from '@/content/cadastro'
import { SAFETY } from '@/content/institutional'
import { cn } from '@/lib/cn'
import { HoverCard, ScrollReveal } from './motion'

const ICONS = {
  planning: Map,
  care: HeartHandshake,
  destinations: Landmark,
  experience: ShieldCheck,
  routes: Route,
  logistics: Compass,
  support: Headset,
  agency: Building2,
  portfolio: Store,
  consultant: Briefcase,
} as const

/** Texto institucional da seção "Mais do que uma viagem". */
export function AboutBlock({ id, eyebrow, title, paragraphs, tone = 'white' }: { id: string; eyebrow: string; title: string; paragraphs: string[]; tone?: 'white' | 'cream' }) {
  return (
    <section aria-labelledby={id} className={cn('py-20 sm:py-28', tone === 'white' ? 'bg-white' : 'bg-cream-50')}>
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <ScrollReveal>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 id={id} className="title-rule text-[2rem] leading-[1.12] font-medium sm:text-[2.6rem]">
            {title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="space-y-6 text-lg leading-[1.75] text-slate-700">
          {paragraphs.map((p, i) => (
            <p key={p} className={i === 0 ? 'border-l-4 border-gold-450 pl-6 font-display text-[1.4rem] leading-snug text-navy-800 sm:text-[1.55rem]' : undefined}>
              {p}
            </p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/** Grade de cards de benefícios. */
export function BenefitCards({ id, eyebrow, title, items, tone = 'cream', columns = 4 }: { id: string; eyebrow: string; title: string; items: Benefit[]; tone?: 'white' | 'cream'; columns?: 3 | 4 }) {
  return (
    <section aria-labelledby={id} className={cn('py-20 sm:py-24', tone === 'white' ? 'bg-white' : 'bg-cream-100')}>
      <div className="container-site">
        <ScrollReveal>
          <SectionHeading id={id} eyebrow={eyebrow} title={title} align="center" className="max-w-3xl" />
        </ScrollReveal>
        <ul className={cn('mt-14 grid gap-5 sm:grid-cols-2', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {items.map((b) => {
            const Icon = ICONS[b.icon]
            return (
              <HoverCard key={b.title} className="group rounded-[var(--radius-card)] bg-white p-7 shadow-soft ring-1 ring-navy-900/5 transition-shadow duration-500 hover:shadow-lift">
                <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-gold-100 text-gold-700 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-[22px]" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-[1.3rem] leading-snug text-navy-900">{b.title}</h3>
                <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">{b.text}</p>
              </HoverCard>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Linha do tempo em etapas numeradas. */
export function Timeline({ id, eyebrow, title, items }: { id: string; eyebrow: string; title: string; items: Step[] }) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="container-site">
        <ScrollReveal>
          <SectionHeading id={id} eyebrow={eyebrow} title={title} align="center" className="max-w-3xl" />
        </ScrollReveal>
        <ol className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="absolute top-7 right-[16.7%] left-[16.7%] hidden h-px bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 lg:block" aria-hidden="true" />
          {items.map((s, i) => (
            <ScrollReveal as="li" key={s.n} delay={i * 0.12} className="relative text-center lg:px-4">
              <span className="relative mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-navy-900 font-label text-sm font-bold tracking-wider text-gold-200 shadow-soft ring-8 ring-white">{s.n}</span>
              <h3 className="font-display text-[1.4rem] leading-snug text-navy-900">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-sm text-[0.98rem] leading-relaxed text-slate-700">{s.text}</p>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

const CARE_ICONS = { planejamento: CalendarCheck2, guia: Cross, suporte: UsersRound, hospedagem: BedDouble, logistica: MapPinned, experiencia: UserRoundCheck } as const
const CARE_KEYS = { planejamento: 'planejamento', guia: 'guia', suporte: 'suporte', hospedagem: 'hospedagem', logistica: 'logistica', experiencia: null } as const

/** "Por que viajar com a Via Lumina": reutiliza os benefícios já publicados no site (SAFETY), sem novas garantias. */
export function CareList({ id, eyebrow, title, keys }: { id: string; eyebrow: string; title: string; keys: readonly (keyof typeof CARE_ICONS)[] }) {
  const items = keys.map((k) => {
    const src = CARE_KEYS[k] ? SAFETY.items.find((i) => i.key === CARE_KEYS[k]) : null
    return k === 'experiencia'
      ? { key: k, title: 'Experiência no turismo religioso', text: 'A Via Lumina faz parte de um grupo com mais de 40 anos de história no turismo.' }
      : { key: k, title: src!.title, text: src!.text }
  })
  return (
    <section aria-labelledby={id} className="bg-cream-100 py-20 sm:py-24">
      <div className="container-site">
        <ScrollReveal>
          <SectionHeading id={id} eyebrow={eyebrow} title={title} align="center" className="max-w-3xl" />
        </ScrollReveal>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-navy-900/10 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = CARE_ICONS[item.key]
            return (
              <ScrollReveal as="li" key={item.key} delay={i * 0.05} className="group bg-white p-7 transition-colors duration-500 hover:bg-cream-50 sm:p-8">
                <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-gold-100 text-gold-700 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-[22px]" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-[1.3rem] leading-snug text-navy-900">{item.title}</h3>
                <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">{item.text}</p>
              </ScrollReveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Cards de destinos com fotografias do acervo original (links reais para o catálogo). */
export function DestinationCards({ id, eyebrow, title, items }: { id: string; eyebrow: string; title: string; items: { title: string; text: string; image: string; alt: string; href: string }[] }) {
  return (
    <section aria-labelledby={id} className="bg-white py-20 sm:py-28">
      <div className="container-site">
        <ScrollReveal>
          <SectionHeading id={id} eyebrow={eyebrow} title={title} align="center" className="max-w-3xl" />
        </ScrollReveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((d, i) => (
            <HoverCard key={d.title} className={cn('group relative overflow-hidden rounded-[var(--radius-card)] bg-navy-900 shadow-soft', i < 3 ? 'lg:col-span-2' : 'lg:col-span-3')}>
              <Link href={d.href} data-track="click_destinos" data-track-label={`card-${i + 1}`} className={cn('relative block aspect-[4/3.4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:aspect-[5/4.4]', i < 3 ? 'lg:aspect-[4/5]' : 'lg:aspect-[16/10]')}>
                <Image src={d.image} alt={d.alt} fill sizes={i < 3 ? '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw' : '(min-width: 1024px) 580px, (min-width: 640px) 50vw, 92vw'} className="object-cover transition duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-[1.45rem] leading-snug text-white">{d.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/80">{d.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-label text-xs font-bold tracking-wider text-gold-200 uppercase underline decoration-gold-300/50 underline-offset-4">Ver roteiros</span>
                </div>
              </Link>
            </HoverCard>
          ))}
        </ul>
      </div>
    </section>
  )
}

