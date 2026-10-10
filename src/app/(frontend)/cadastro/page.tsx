import { Building2, Church, Compass } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollReveal } from '@/components/cadastro/motion'
import { TONES } from '@/components/cadastro/tone'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { AGENCY_PAGE, HUB, PILGRIM_PAGE, PRIEST_PAGE } from '@/content/cadastro'

export const metadata: Metadata = {
  title: HUB.meta.title,
  description: HUB.meta.description,
  alternates: { canonical: HUB.path },
}

const CARDS = [
  { page: PILGRIM_PAGE, tone: 'peregrinos', icon: Compass, title: 'Sou cliente (peregrino)', text: 'Quero me cadastrar como cliente e receber informações sobre as próximas peregrinações.', cta: 'Cadastre-se como cliente' },
  { page: PRIEST_PAGE, tone: 'padres', icon: Church, title: 'Sou padre', text: 'Quero conhecer as possibilidades de parceria e organizar peregrinações com minha comunidade.', cta: 'Conhecer a parceria' },
  { page: AGENCY_PAGE, tone: 'agencias', icon: Building2, title: 'Tenho uma agência', text: 'Quero conhecer as oportunidades de colaboração com a Via Lumina.', cta: 'Cadastrar minha agência' },
] as const

export default function CadastroHubPage() {
  return (
    <section className="bg-cream-50 pt-32 pb-24 sm:pt-40">
      <div className="container-site">
        <Breadcrumbs items={[{ label: HUB.crumb, href: HUB.path }]} tone="dark" className="mb-8" />
        <p className="eyebrow mb-3">Via Lumina Viagens</p>
        <h1 className="title-rule max-w-3xl text-[2.4rem] leading-[1.08] font-medium sm:text-5xl">{HUB.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-700">{HUB.text}</p>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <ScrollReveal as="li" key={c.page.path} delay={i * 0.08} className="group relative flex flex-col rounded-[var(--radius-card)] bg-white p-8 shadow-soft ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift">
              <span className={`mb-6 inline-flex size-14 items-center justify-center rounded-full ${TONES[c.tone].chip}`}>
                <c.icon className="size-7" aria-hidden="true" strokeWidth={1.6} />
              </span>
              <h2 className="font-display text-2xl text-navy-900">{c.title}</h2>
              <p className="mt-3 flex-1 text-slate-700">{c.text}</p>
              <Link href={`${c.page.path}?origem=hub`} className="mt-7 inline-flex font-label text-sm font-bold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-6 after:absolute after:inset-0 hover:text-gold-700">
                {c.cta}
              </Link>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
