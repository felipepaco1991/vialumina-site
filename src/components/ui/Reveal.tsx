import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
  id?: string
}

/**
 * Entrada suave ao rolar (fade + deslocamento vertical), sem JavaScript por elemento:
 * um único IntersectionObserver (RevealObserver, no layout) adiciona a classe "is-visible".
 * Sem JS ou com prefers-reduced-motion, o conteúdo aparece imediatamente (ver globals.css).
 */
export function Reveal({ children, delay = 0, className, as = 'div', id }: Props) {
  const Tag = as as ElementType
  return (
    <Tag id={id} data-reveal="" className={cn(className)} style={delay ? ({ '--reveal-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  )
}
