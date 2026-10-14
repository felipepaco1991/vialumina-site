import { Cross } from 'lucide-react'
import Image from 'next/image'
import type { HeroDirector } from '@/content/hero-diretores'

/** Estrela de quatro pontas (brilho). Posição em % dentro da figura; `delay` desencontra o cintilar. */
const SPARKLES = [
  { left: '8%', top: '10%', size: 22, delay: '0s' },
  { left: '84%', top: '6%', size: 30, delay: '0.9s' },
  { left: '-6%', top: '36%', size: 14, delay: '1.7s' },
  { left: '97%', top: '30%', size: 18, delay: '0.4s' },
  { left: '22%', top: '-4%', size: 12, delay: '2.2s' },
  { left: '70%', top: '24%', size: 11, delay: '1.2s' },
  { left: '2%', top: '60%', size: 16, delay: '2.6s' },
] as const

function Sparkle({ left, top, size, delay }: (typeof SPARKLES)[number]) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className="absolute animate-[twinkle_3.2s_ease-in-out_infinite] text-gold-200 drop-shadow-[0_0_6px_rgb(242_213_138/0.9)]"
      style={{ left, top, animationDelay: delay }}
    >
      <path
        fill="currentColor"
        d="M12 0c.6 7 5 11.4 12 12-7 .6-11.4 5-12 12-.6-7-5-11.4-12-12C7 11.4 11.4 7 12 0Z"
      />
    </svg>
  )
}

/**
 * Direção espiritual em destaque no banner: recorte da pessoa sobre uma aura dourada (raios, brilho e
 * estrelas), com a faixa "Direção espiritual · Nome" na base para que ela não fique flutuando.
 * No celular fica abaixo do texto; em telas largas ocupa a altura do banner, à direita.
 */
export function HeroDirectorFigure({
  director,
  name,
  role,
}: {
  director: HeroDirector
  name: string
  role: string
}) {
  const { photo, parish } = director
  return (
    <div className="relative mx-auto mt-2 h-[30rem] w-full max-w-sm lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-20 lg:bottom-[4.5rem] lg:mt-0 lg:h-auto lg:max-w-none">
      <div className="relative mx-auto h-full w-full lg:max-w-[1360px] lg:px-8">
        <figure className="absolute right-1/2 bottom-0 h-full w-[min(100%,20rem)] translate-x-1/2 lg:right-8 lg:w-auto lg:translate-x-0">
          {/* Aura: raios e brilho dourado centrados na cabeça */}
          <div
            className="absolute top-[17%] left-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 lg:w-[210%]"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-conic-gradient(from -4deg at 50% 50%, rgb(255 226 150 / 0.26) 0deg 2deg, transparent 2deg 10deg)',
                maskImage: 'radial-gradient(circle, #000 0%, rgb(0 0 0 / 0.5) 22%, transparent 52%)',
                WebkitMaskImage:
                  'radial-gradient(circle, #000 0%, rgb(0 0 0 / 0.5) 22%, transparent 52%)',
              }}
            />
            <div
              className="absolute inset-[22%]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgb(255 236 180 / 0.95) 0%, rgb(242 195 90 / 0.55) 18%, rgb(226 176 74 / 0.22) 42%, transparent 68%)',
              }}
            />
          </div>

          {/* Chão de luz sob a figura */}
          <div
            className="absolute inset-x-[-25%] bottom-[-6%] h-[26%]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 50% 100%, rgb(242 195 90 / 0.5) 0%, rgb(226 176 74 / 0.18) 45%, transparent 72%)',
            }}
            aria-hidden="true"
          />

          <div className="absolute inset-0" aria-hidden="true">
            {SPARKLES.map((s) => (
              <Sparkle key={s.left + s.top} {...s} />
            ))}
          </div>

          {/* O filtro fica no invólucro: a máscara de baixo corta só a figura, e o contorno dourado acompanha a silhueta. */}
          <div
            className="relative h-full"
            style={{
              aspectRatio: `${photo.width} / ${photo.height}`,
              filter:
                'drop-shadow(0 0 1.5px rgb(255 232 175 / 0.95)) drop-shadow(0 0 20px rgb(226 176 74 / 0.55)) brightness(1.1) contrast(1.04)',
            }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 460px, 320px"
              className="object-contain object-bottom"
              style={{
                maskImage: 'linear-gradient(to bottom, #000 0%, #000 74%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 74%, transparent 100%)',
              }}
            />
          </div>

          <figcaption className="absolute inset-x-[-12%] bottom-[1%] flex flex-col items-center text-center">
            <span className="flex w-full items-center justify-center gap-3 text-gold-300" aria-hidden="true">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-300" />
              <Cross className="size-4" strokeWidth={2.2} />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-300" />
            </span>
            <span className="mt-2 font-label text-[0.7rem] font-semibold tracking-[0.32em] text-gold-200 uppercase sm:text-xs">
              {role}
            </span>
            <span className="mt-1 font-display text-[1.7rem] leading-tight text-white drop-shadow-[0_2px_10px_rgb(4_26_54/0.9)] sm:text-3xl">
              {name}
            </span>
            {parish ? (
              <span className="mt-1 font-label text-[0.65rem] font-medium tracking-[0.2em] text-white/80 uppercase">
                {parish}
              </span>
            ) : null}
            <span className="mt-3 h-px w-3/5 bg-gradient-to-r from-transparent via-gold-300/80 to-transparent" aria-hidden="true" />
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
