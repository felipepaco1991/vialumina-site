'use client'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import type { ItineraryDay } from '@/lib/trip-model'

/**
 * Programação completa, dia a dia, com <details>/<summary> nativos:
 * cada dia expande individualmente, o texto integral permanece no HTML
 * (busca, impressão, leitores de tela) e "Expandir/Recolher todos" controla o conjunto.
 */
export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(days.slice(0, 2).map((d) => d.day)))
  const allOpen = open.size === days.length

  const setDay = (day: number, isOpen: boolean) =>
    setOpen((prev) => {
      if (prev.has(day) === isOpen) return prev
      const next = new Set(prev)
      if (isOpen) next.add(day)
      else next.delete(day)
      return next
    })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{days.length} dias de programação · selecione um dia para ver os detalhes</p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(days.map((d) => d.day)))}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-900/15 bg-white px-5 font-label text-sm font-semibold text-navy-900 shadow-soft transition hover:border-navy-900"
        >
          {allOpen ? <ChevronsDownUp className="size-4" aria-hidden="true" /> : <ChevronsUpDown className="size-4" aria-hidden="true" />}
          {allOpen ? 'Recolher todos' : 'Expandir todos'}
        </button>
      </div>

      <ol className="relative space-y-3 before:absolute before:top-6 before:bottom-6 before:left-[1.4rem] before:w-px before:bg-gradient-to-b before:from-gold-450 before:via-gold-450/50 before:to-gold-450/10 sm:before:left-[1.65rem]">
        {days.map((d) => {
          const isOpen = open.has(d.day)
          return (
            <li key={d.day} className="relative pl-14 sm:pl-16">
              <span
                aria-hidden="true"
                className={`absolute top-3.5 left-0 flex size-[2.8rem] flex-col items-center justify-center rounded-full border-[3px] border-gold-450 font-label shadow-[0_0_0_5px_var(--color-cream-50)] transition-colors duration-300 sm:size-[3.3rem] ${isOpen ? 'bg-navy-900 text-white' : 'bg-white text-navy-900'}`}
              >
                <span className="text-[0.55rem] leading-none font-bold tracking-widest uppercase opacity-70">Dia</span>
                <span className="text-base leading-none font-bold sm:text-lg">{d.day}</span>
              </span>
              <details
                open={isOpen}
                onToggle={(e) => setDay(d.day, (e.currentTarget as HTMLDetailsElement).open)}
                className={`itinerary-day overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5 transition-shadow duration-300 ${isOpen ? 'shadow-lift' : 'shadow-soft'}`}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">
                    <span className="block font-label text-xs font-bold tracking-[0.16em] text-gold-700 uppercase">
                      Dia {d.day}
                      {d.dateLabel ? ` · ${d.dateLabel}` : ''}
                    </span>
                    <span className="mt-1 block text-[1.05rem] leading-snug font-bold tracking-wide text-navy-900 sm:text-lg">{d.route}</span>
                  </span>
                  <ChevronDown className={`size-5 shrink-0 text-navy-900/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </summary>
                <div className="prose-trip border-t border-navy-900/5 px-5 pt-4 pb-6 text-[1.02rem] leading-relaxed text-slate-700 sm:px-6">
                  {d.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
