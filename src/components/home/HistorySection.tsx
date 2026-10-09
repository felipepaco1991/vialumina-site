import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { HISTORY, PILLARS } from '@/content/institutional'

export function HistorySection() {
  return (
    <section aria-labelledby="historia-titulo" className="relative isolate overflow-hidden bg-cream-100 py-24 sm:py-28">
      <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} className="absolute top-0 -left-40 -z-10 w-[420px] opacity-[0.12]" aria-hidden="true" />
      <div className="container-site grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-3">{HISTORY.eyebrow}</p>
          <h2 id="historia-titulo" className="title-rule text-[2.1rem] leading-[1.1] font-medium sm:text-5xl">
            {HISTORY.title}
          </h2>
          <div className="mt-7 space-y-4 text-lg leading-relaxed text-slate-700">
            {HISTORY.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-9 font-display text-[1.7rem] leading-snug text-navy-900 sm:text-[2rem]">
            {HISTORY.closing.before} <em className="text-gold-700">{HISTORY.closing.highlight}</em> {HISTORY.closing.after}
          </p>
          <ButtonLink href="/nossa-historia" variant="outline" className="mt-10" iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}>
            Conheça nossa história
          </ButtonLink>
        </Reveal>
        <ol className="space-y-px self-center overflow-hidden rounded-[var(--radius-panel)] bg-navy-900/10">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1} className="flex gap-6 bg-white p-7 sm:p-9">
              <span className="font-display text-4xl leading-none text-gold-500" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-label text-sm font-bold tracking-[0.18em] text-navy-900 uppercase">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-700">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
