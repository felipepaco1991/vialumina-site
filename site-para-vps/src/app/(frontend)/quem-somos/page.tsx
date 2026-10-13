import type { Metadata } from 'next'
import Image from 'next/image'
import { Differentials } from '@/components/home/Differentials'
import { ValuesSection } from '@/components/home/ValuesSection'
import { PageCta } from '@/components/institutional/PageCta'
import { PartnershipInvite } from '@/components/institutional/SignupInvites'
import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { ABOUT, ARBO, PILLARS } from '@/content/institutional'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Quem Somos',
  description:
    'A Via Lumina Viagens é uma operadora especializada em turismo religioso, parte do Grupo Arbo, com mais de 40 anos de história no turismo. Conheça nossa forma de cuidar de cada peregrino.',
  alternates: { canonical: '/quem-somos' },
}

export default async function QuemSomosPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)
  return (
    <>
      <PageHero
        image={{ src: '/assets/institucional/paisagem-sagrada.webp', alt: 'Vista da Cidade Antiga de Jerusalém a partir do Monte das Oliveiras', position: 'center 40%' }}
        eyebrow="Quem somos"
        title={ABOUT.title}
        intro={ABOUT.paragraphs[0]}
        crumbs={[{ label: 'Quem Somos', href: '/quem-somos' }]}
      />

      <section aria-labelledby="proposta-titulo" className="overflow-hidden bg-white py-20 sm:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-3">Turismo religioso</p>
            <h2 id="proposta-titulo" className="title-rule text-[2rem] leading-tight font-medium sm:text-[2.6rem]">
              Cada roteiro, um encontro com Deus
            </h2>
            <div className="mt-7 space-y-4 text-lg leading-relaxed text-slate-700">
              {ABOUT.paragraphs.slice(1, 2).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{PILLARS[0].text}</p>
            </div>
            <blockquote className="mt-9 border-l-[3px] border-gold-500 pl-6 font-display text-[1.5rem] leading-snug text-navy-900 italic">{ABOUT.paragraphs[2]}</blockquote>
          </Reveal>
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -right-6 -bottom-6 size-44 rounded-full bg-gold-100" aria-hidden="true" />
            <Image
              src="/assets/institucional/quem-somos.webp"
              alt="Peregrina fotografa a Basílica de São Pedro, no Vaticano — selo de mais de 40 anos de experiência"
              width={1080}
              height={1080}
              sizes="(min-width: 1024px) 500px, 90vw"
              className="relative h-auto w-full"
            />
          </Reveal>
        </div>
      </section>

      <Differentials />

      <section aria-labelledby="arbo-titulo" className="bg-cream-50 pb-24">
        <div className="container-site">
          <Reveal className="grid overflow-hidden rounded-[var(--radius-panel)] bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_40%,#0d3568_70%,#071f42_100%)] text-white shadow-deep lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col justify-center gap-6 border-b border-white/10 p-10 sm:p-14 lg:border-r lg:border-b-0">
              <span className="font-label text-xs font-bold tracking-[0.2em] text-white/60 uppercase">{ARBO.kicker}</span>
              <Image src="/assets/logos/grupo-arbo.webp" alt="Grupo Arbo" width={260} height={82} className="h-auto w-56" />
              <p>
                <span className="font-display text-6xl text-gold-200">{ARBO.badge.value}</span>
                <span className="ml-3 font-label text-sm font-semibold tracking-wider text-white/70 uppercase">{ARBO.badge.label}</span>
              </p>
            </div>
            <div className="p-10 sm:p-14">
              <h2 id="arbo-titulo" className="text-[1.9rem] leading-tight font-medium text-white sm:text-[2.3rem]">
                A força de um grupo com tradição no turismo
              </h2>
              {ARBO.paragraphs.map((p) => (
                <p key={p} className="mt-5 text-lg leading-relaxed text-white/80">
                  {p}
                </p>
              ))}
              {settings.grupoArboUrl ? (
                <a href={settings.grupoArboUrl} target="_blank" rel="noopener" className="mt-8 inline-flex font-label text-sm font-semibold text-gold-200 underline decoration-gold-300/60 underline-offset-6 hover:text-white">
                  Conheça o Grupo Arbo<span className="sr-only"> (abre em nova aba)</span>
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <ValuesSection />
      <div className="h-24 bg-cream-50" aria-hidden="true" />
      <PartnershipInvite />
      <PageCta whatsappHref={wa} />
    </>
  )
}
