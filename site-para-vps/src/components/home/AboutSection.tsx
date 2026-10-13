import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ABOUT, ARBO } from '@/content/institutional'

export function AboutSection() {
  return (
    <section aria-labelledby="quem-somos-titulo" className="overflow-hidden bg-white py-24 sm:py-28">
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -top-6 -left-6 size-40 rounded-full bg-gold-100" aria-hidden="true" />
          <Image
            src="/assets/institucional/quem-somos.webp"
            alt="Peregrina fotografa a Basílica de São Pedro, no Vaticano — selo de mais de 40 anos de experiência"
            width={1080}
            height={1080}
            sizes="(min-width: 1024px) 520px, 90vw"
            className="relative h-auto w-full"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">{ABOUT.eyebrow}</p>
          <h2 id="quem-somos-titulo" className="title-rule text-[2.1rem] leading-[1.1] font-medium sm:text-5xl">
            {ABOUT.title}
          </h2>
          <div className="mt-7 space-y-4 text-lg leading-relaxed text-slate-700">
            {ABOUT.paragraphs.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-[3px] border-gold-500 pl-6 font-display text-[1.45rem] leading-snug text-navy-900 italic">
            {ABOUT.paragraphs[2]}
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="/quem-somos" variant="primary" iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}>
              Conheça a Via Lumina
            </ButtonLink>
            <div className="flex items-center gap-3 rounded-full bg-navy-900 py-2 pr-5 pl-2 text-white">
              <span className="sr-only">{ARBO.kicker} Grupo Arbo</span>
              <span className="rounded-full bg-gold-500 px-3 py-1.5 font-label text-xs font-bold text-navy-950" aria-hidden="true">
                {ARBO.badge.value}
              </span>
              <span className="font-label text-xs font-semibold tracking-wider text-white/80 uppercase" aria-hidden="true">
                {ARBO.kicker}
              </span>
              <Image src="/assets/logos/grupo-arbo.webp" alt="" width={96} height={30} className="h-6 w-auto" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
