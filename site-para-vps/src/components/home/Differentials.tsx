import { BedDouble, CalendarCheck2, Cross, Headset, Route, UsersRound } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SAFETY } from '@/content/institutional'

const ICONS = { guia: Cross, suporte: Headset, hospedagem: BedDouble, logistica: Route, grupos: UsersRound, planejamento: CalendarCheck2 } as const

/** Diferenciais / "Segurança e cuidado" — painel que sobrepõe a borda do hero. */
export function Differentials() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="relative z-10 -mt-px bg-cream-50 pt-20 pb-24 sm:pt-24">
      <div className="container-site">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-3">{SAFETY.eyebrow}</p>
            <h2 id="diferenciais-titulo" className="title-rule text-[2rem] leading-tight font-medium sm:text-[2.6rem]">
              {SAFETY.title}
            </h2>
          </div>
          <p className="max-w-md text-lg text-slate-700">Cada peregrinação é acompanhada de perto, do planejamento ao retorno.</p>
        </Reveal>
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-navy-900/10 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
          {SAFETY.items.map((item, i) => {
            const Icon = ICONS[item.key as keyof typeof ICONS]
            return (
              <Reveal as="li" key={item.key} delay={i * 0.06} className="group bg-white p-7 transition-colors duration-500 hover:bg-cream-100 sm:p-8">
                <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-gold-100 text-gold-700 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="size-[22px]" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-[1.35rem] leading-snug text-navy-900">{item.title}</h3>
                <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">{item.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
