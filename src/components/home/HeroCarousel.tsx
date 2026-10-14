'use client'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Tempo de cada banner da home (4 s). */
export const HERO_SLIDE_MS = 4000

/**
 * `light`: fundo claro (cabeçalho branco e rodapé do carrossel com texto escuro enquanto o slide está ativo).
 * `purple`: banner do Crescer (cabeçalho em roxo, igual ao fundo da arte).
 */
export type HeroSlide = { id: string; label: string; node: ReactNode; tone?: 'light' | 'dark' | 'purple' }

/**
 * Carrossel da Hero: troca automática e contínua a cada {@link HERO_SLIDE_MS}.
 * Só para pelo botão "Pausar" (WCAG 2.2.2), com a aba em segundo plano, ou desde o início
 * para quem pediu menos movimento ao sistema. Mouse e foco não interrompem a rotação.
 * Os slides ficam sobrepostos (mesma célula da grade), então a altura é a do maior.
 * Os controles "grudam" na parte visível da tela (sticky): no celular o hero é mais alto que a
 * tela e a barra de endereço do Safari cobriria o fim da seção.
 */
export function HeroCarousel({ slides, footer }: { slides: HeroSlide[]; footer?: ReactNode }) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  // null = ainda não escolheu: segue a preferência do sistema (movimento reduzido → começa pausado).
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
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
  const running = count > 1 && !paused && !hidden

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), HERO_SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [running, index, count])

  const tone = slides[index]?.tone ?? 'dark'
  useEffect(() => {
    // O cabeçalho (outro componente) lê este atributo para trocar de aparência sobre slides claros.
    const root = document.documentElement
    root.dataset.heroTone = tone
    return () => {
      delete root.dataset.heroTone
    }
  }, [tone])

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  return (
    <section
      // overflow-clip (e não hidden): hidden criaria um contêiner de rolagem e quebraria o sticky dos controles.
      className="group/hero relative isolate overflow-clip bg-navy-950 text-white"
      data-tone={tone}
      aria-roledescription="carrossel"
      aria-label="Destaques da Via Lumina"
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
        <div className="sticky bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-10 h-0 sm:bottom-[5.25rem]">
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2">
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
        </div>
      ) : null}
    </section>
  )
}
