'use client'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Animações das landing pages com Motion. Todas respeitam prefers-reduced-motion (MotionConfig reducedMotion="user":
 * deslocamentos e escalas são desativados; só transições de opacidade permanecem) e nunca atrasam o preenchimento.
 * LazyMotion + `m` mantêm o pacote pequeno.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada do hero: somente deslocamento (o texto nasce visível, bom para LCP e sem JS). */
export function HeroMotion({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div className={className} initial="hidden" animate="show" transition={{ staggerChildren: 0.09, delayChildren: delay }}>
      {children}
    </m.div>
  )
}
export function HeroMotionItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={{ hidden: { y: 18 }, show: { y: 0, transition: { duration: 0.8, ease } } }}>
      {children}
    </m.div>
  )
}

/** Revelação progressiva ao rolar. Sem JS o conteúdo permanece visível (ver estilo noscript na página). */
export function ScrollReveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'article' | 'section' }) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      data-m-reveal=""
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </Tag>
  )
}

/** Cartão com elevação ao passar o mouse ou receber foco. */
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.li className={className} whileHover={{ y: -6 }} transition={{ duration: 0.35, ease }} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} data-m-reveal="">
      {children}
    </m.li>
  )
}

export { AnimatePresence, m }
