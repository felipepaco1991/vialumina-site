import type { Metadata } from 'next'
import Image from 'next/image'
import { PageCta } from '@/components/institutional/PageCta'
import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { ARBO, HISTORY, PILLARS, VALUES } from '@/content/institutional'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Nossa História',
  description:
    'A Via Lumina Viagens nasceu de uma trajetória de mais de quatro décadas no turismo. Conheça a história do fundador Arnaldo Franken, o significado de Via Lumina — Caminho de Luz — e nossa missão.',
  alternates: { canonical: '/nossa-historia' },
}

/** Capítulos da narrativa — somente fatos publicados no site original. */
const CHAPTERS = [
  { kicker: 'Mais de quatro décadas', title: 'Uma trajetória construída no turismo', text: [HISTORY.paragraphs[0]] },
  { kicker: 'O fundador', title: 'Arnaldo Franken', text: [HISTORY.paragraphs[1]] },
  { kicker: 'Via Lumina', title: 'Caminho de Luz', text: [PILLARS[0].text] },
  { kicker: 'Grupo Arbo', title: 'Parte de um grupo com tradição', text: ARBO.paragraphs },
]

export default async function NossaHistoriaPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)
  return (
    <>
      <PageHero
        image={{ src: '/assets/destinos/portugal-e-franca/galeria-01-santuario-de-fatima.webp', alt: 'Vista aérea do Santuário de Fátima, em Portugal' }}
        eyebrow={HISTORY.eyebrow}
        title={HISTORY.title}
        intro="Uma história de dedicação ao turismo religioso que hoje se renova no caminho da Via Lumina."
        crumbs={[{ label: 'Nossa História', href: '/nossa-historia' }]}
      />

      <section aria-label="Nossa trajetória" className="relative isolate overflow-hidden bg-cream-50 py-20 sm:py-28">
        <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} className="absolute top-20 -right-40 -z-10 w-[460px] opacity-[0.1]" aria-hidden="true" />
        <div className="container-site max-w-4xl!">
          <ol className="relative space-y-16 before:absolute before:top-2 before:bottom-2 before:left-[0.6rem] before:w-px before:bg-gradient-to-b before:from-gold-450 before:to-gold-450/10 sm:space-y-20">
            {CHAPTERS.map((c, i) => (
              <Reveal as="li" key={c.title} className="relative pl-12 sm:pl-16">
                <span className="absolute top-1.5 left-0 size-5 rounded-full border-4 border-gold-450 bg-cream-50 shadow-[0_0_0_6px_var(--color-cream-50)]" aria-hidden="true" />
                <p className="eyebrow">
                  <span className="text-slate-500">{String(i + 1).padStart(2, '0')} · </span>
                  {c.kicker}
                </p>
                <h2 className="mt-3 text-[2rem] leading-tight font-medium sm:text-[2.6rem]">{c.title}</h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-700">
                  {c.text.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                {c.kicker === 'Grupo Arbo' ? (
                  <div className="mt-6 inline-flex items-center gap-4 rounded-full bg-navy-900 py-2.5 pr-6 pl-3">
                    <span className="rounded-full bg-gold-500 px-3 py-1 font-label text-sm font-bold text-navy-950">{ARBO.badge.value}</span>
                    <Image src="/assets/logos/grupo-arbo.webp" alt="Grupo Arbo" width={110} height={35} className="h-7 w-auto" />
                  </div>
                ) : null}
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-20 rounded-[var(--radius-panel)] bg-white p-10 text-center shadow-soft ring-1 ring-navy-900/5 sm:p-14">
            <p className="mx-auto max-w-2xl font-display text-[1.75rem] leading-snug text-navy-900 sm:text-[2.2rem]">
              {HISTORY.closing.before} <em className="text-gold-700">{HISTORY.closing.highlight}</em> {HISTORY.closing.after}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="missao-titulo" className="bg-navy-900 py-20 text-white sm:py-28">
        <div className="container-site">
          <Reveal className="text-center">
            <p className="eyebrow-light">Missão, visão e valores</p>
            <h2 id="missao-titulo" className="title-rule title-rule-center mt-3 text-[2rem] font-medium text-white sm:text-5xl">
              O que nos guia
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-white/10 md:grid-cols-2">
            {PILLARS.slice(1).map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="bg-navy-900 p-10 sm:p-12">
                <h3 className="font-label text-sm font-bold tracking-[0.18em] text-gold-200 uppercase">{p.title}</h3>
                <p className="mt-4 font-display text-[1.45rem] leading-snug text-white">{p.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <h3 className="text-center font-label text-sm font-bold tracking-[0.18em] text-gold-200 uppercase">{VALUES.eyebrow}</h3>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {VALUES.items.map((v) => (
                <li key={v.title} className="rounded-full border border-white/20 px-5 py-2.5" title={v.text}>
                  <span className="font-display text-xl text-white">{v.title}</span>
                  <span className="sr-only">: {v.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <div className="h-24 bg-cream-50" aria-hidden="true" />
      <PageCta whatsappHref={wa} />
    </>
  )
}
