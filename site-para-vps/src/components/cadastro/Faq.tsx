'use client'
import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { FaqItem } from '@/content/cadastro'
import { AnimatePresence, m } from './motion'

/** Perguntas frequentes expansíveis (acessíveis por teclado, com altura animada). */
export function Faq({ id, title, items }: { id: string; title: string; items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()
  return (
    <section aria-labelledby={id} className="bg-cream-100 py-20 sm:py-24">
      <div className="container-site max-w-3xl">
        <SectionHeading id={id} eyebrow="Dúvidas" title={title} align="center" />
        <ul className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <li key={it.q} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-soft ring-1 ring-navy-900/5">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${base}-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-6 py-4 text-left font-display text-[1.15rem] leading-snug text-navy-900 transition-colors hover:bg-cream-50 sm:text-[1.25rem]"
                  >
                    {it.q}
                    <m.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-gold-700">
                      <ChevronDown className="size-5" aria-hidden="true" />
                    </m.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.div
                      id={`${base}-${i}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[1.02rem] leading-relaxed text-slate-700">{it.a}</p>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
