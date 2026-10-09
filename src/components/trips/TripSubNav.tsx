'use client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { WhatsAppIcon } from '@/components/ui/Icons'

type Section = { id: string; label: string }

/** Navegação fixa entre as seções do roteiro, com destaque da seção visível. */
export function TripSubNav({ sections, whatsappHref, tripSlug }: { sections: Section[]; whatsappHref: string; tripSlug: string }) {
  const [active, setActive] = useState(sections[0]?.id)
  const [visible, setVisible] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => Boolean(e))
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActive(top.target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    els.forEach((e) => io.observe(e))
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [sections])

  // Mantém o item ativo visível na faixa rolável (celular).
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  return (
    <nav
      aria-label="Seções do roteiro"
      className={cn(
        'fixed inset-x-0 top-[4.5rem] z-40 border-b border-navy-900/10 bg-white/95 backdrop-blur-md transition duration-500 lg:top-20',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
      )}
    >
      <div className="container-site flex items-center gap-4">
        <ul ref={listRef} className="scrollbar-none flex flex-1 gap-1 overflow-x-auto py-2">
          {sections.map((s) => (
            <li key={s.id} data-id={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                tabIndex={visible ? 0 : -1}
                className={cn(
                  'block rounded-full px-4 py-2 font-label text-[0.8rem] font-semibold whitespace-nowrap transition-colors',
                  active === s.id ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-900/5',
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          tabIndex={visible ? 0 : -1}
          data-track="whatsapp_click"
          data-track-label="subnav-roteiro"
          data-track-trip={tripSlug}
          className="hidden min-h-10 shrink-0 items-center gap-2 rounded-full bg-whatsapp px-4 font-label text-[0.8rem] font-semibold text-white hover:bg-whatsapp-dark md:inline-flex"
        >
          <WhatsAppIcon className="size-4" /> Quero saber mais
        </a>
      </div>
    </nav>
  )
}
