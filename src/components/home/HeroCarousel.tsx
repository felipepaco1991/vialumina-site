'use client'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Tempo de cada banner da home (2 s, conforme combinado com a equipe). */
export const HERO_SLIDE_MS = 2000

export type HeroSlide = { id: string; label: string; node: ReactNode }

/**
 * Carrossel da Hero: troca automática a cada {@link HERO_SLIDE_MS}.
 * Pausa com o mouse/foco sobre o banner, com a aba em segundo plano, pelo botão
 * "Pausar" (WCAG 2.2.2) e não inicia sozinho para quem pediu menos movimento.
 * Os slides ficam sobrepostos (mesma célula da grade), então a altura é a do maior.
 */
export function HeroCarousel({ slides, footer }: { slides: HeroSlide[]; footer?: ReactNode }) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  // null = ainda não escolheu: segue a preferência do sistema (movimento reduzido → começa pausado).
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    const onVisibility = () => setHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      mq.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const paused = userPaused ?? reduced
  const running = count > 1 && !paused && !hovered && !focused && !hidden

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), HERO_SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [running, index, count])

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  return (
    <section
      className="relative isolate overflow-hidden bg-navy-950 text-white"
      aria-roledescription="carrossel"
      aria-label="Destaques da Via Lumina"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <div className="grid min-h-[100svh]" aria-live={running ? 'off' : 'polite'}>
        {slides.map((slide, i) => {
          const active = i === index
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}: ${slide.label}`}
              aria-hidden={active ? undefined : true}
              inert={!active}
              className={cn(
                'relative col-start-1 row-start-1 flex min-w-0 transition-opacity duration-700 ease-out',
                active ? 'z-[1] opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              {slide.node}
            </div>
          )
        })}
      </div>

      {footer}

      {count > 1 ? (
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 sm:bottom-[5.25rem]">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-navy-950/45 text-white backdrop-blur transition hover:bg-navy-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <ul className="flex items-center gap-1 rounded-full bg-navy-950/45 px-2 backdrop-blur">
            {slides.map((slide, i) => (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir para o banner ${i + 1}: ${slide.label}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="group inline-flex size-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all duration-300',
                      i === index ? 'w-6 bg-gold-300' : 'w-2 bg-white/60 group-hover:bg-white',
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-navy-950/45 text-white backdrop-blur transition hover:bg-navy-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Próximo banner"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused(!paused)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-navy-950/45 text-white backdrop-blur transition hover:bg-navy-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={
              paused
                ? 'Iniciar troca automática dos banners'
                : 'Pausar troca automática dos banners'
            }
          >
            {paused ? (
              <Play className="size-4" aria-hidden="true" />
            ) : (
              <Pause className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      ) : null}
    </section>
  )
}
