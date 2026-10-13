import { Reveal } from '@/components/ui/Reveal'
import { VALUES } from '@/content/institutional'

/** Valores em composição editorial (linhas tipográficas), sem repetição de cards. */
export function ValuesSection() {
  return (
    <section aria-labelledby="valores-titulo" className="relative isolate overflow-hidden bg-navy-900 py-24 text-white sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgb(0_115_182/0.35),transparent_45%),radial-gradient(circle_at_10%_90%,rgb(201_146_42/0.18),transparent_40%)]" aria-hidden="true" />
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow-light mb-3">{VALUES.eyebrow}</p>
          <h2 id="valores-titulo" className="title-rule text-[2.1rem] leading-tight font-medium text-white sm:text-5xl">
            O que nos move
          </h2>
        </Reveal>
        <ul className="border-b border-white/15">
          {VALUES.items.map((v, i) => (
            <Reveal
              as="li"
              key={v.title}
              delay={i * 0.06}
              className="group grid gap-2 border-t border-white/15 py-7 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-baseline sm:gap-10"
            >
              <p className="flex items-baseline gap-4 font-display text-[2rem] leading-none text-gold-200 transition-colors duration-500 group-hover:text-white sm:text-[2.3rem]">
                <span className="font-label text-xs font-bold tracking-widest text-white/40" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {v.title}
              </p>
              <p className="text-lg leading-relaxed text-white/80">{v.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
