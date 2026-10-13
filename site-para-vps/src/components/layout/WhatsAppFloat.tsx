'use client'
import { cn } from '@/lib/cn'
import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/Icons'

/**
 * Botão flutuante discreto. Aparece após rolar o primeiro bloco e se recolhe
 * perto do rodapé para não cobrir conteúdo importante.
 */
export function WhatsAppFloat({ href }: { href: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 420
      setVisible(window.scrollY > 520 && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Falar com a Via Lumina pelo WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-track="whatsapp_click"
      data-track-label="flutuante"
      className={cn(
        'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_14px_35px_rgb(22_163_74/0.35)] transition duration-300 hover:bg-whatsapp-dark sm:right-6 sm:bottom-6',
        visible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-90 opacity-0',
      )}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
