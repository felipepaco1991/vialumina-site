'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Observador único que revela os elementos [data-reveal] ao entrarem na tela. */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    const observe = () => document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el))
    observe()
    // Conteúdo inserido depois (ex.: navegação no cliente, listas filtradas).
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
  return null
}
