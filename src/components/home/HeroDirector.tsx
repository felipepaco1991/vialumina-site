import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { HeroDirector } from '@/content/hero-diretores'

const GOLD = 'text-gold-300'

/** Cruz latina dourada que abre a faixa de nome. */
function CrossMark() {
  return (
    <svg viewBox="0 0 24 24" className={`size-[1.15rem] ${GOLD}`} aria-hidden="true">
      <path fill="currentColor" d="M10.6 1h2.8v6.2H19v2.8h-5.6V23h-2.8V10H5V7.2h5.6V1Z" />
    </svg>
  )
}

/** Flor-de-lis simplificada que fecha a faixa de nome. */
function FleurMark() {
  return (
    <svg viewBox="0 0 24 24" className={`size-[1.1rem] ${GOLD}`} aria-hidden="true">
      <g fill="currentColor">
        <path d="M12 1.5c2.6 3.2 2.6 7.3 0 11.2-2.6-3.9-2.6-8 0-11.2Z" />
        <path d="M3.5 6c4.2-.4 6.6 2.6 6.4 7.3C6.700 12.600 3.100 10.200 3.500 6Z" />
        <path d="M20.500 6c-4.200-.4-6.600 2.600-6.400 7.300 3.200-.7 6.800-3.100 6.400-7.300Z" />
        <path d="M6.500 14.500h11v2h-11z" />
        <path d="M12 16.500c0 2.300-1 4.200-3.200 5.500 2.200 0 3.200-.5 3.200-1.200 0 .7 1 1.200 3.200 1.200-2.200-1.300-3.200-3.200-3.200-5.500Z" />
      </g>
    </svg>
  )
}

const RULE = 'h-px w-[clamp(1.5rem,6svh,3.5rem)] from-transparent to-gold-300/90'

/** Quanto a largura (em vw) pode crescer em telas mais baixas que 16:9: acompanha a altura (svh). */
const WIDE = 16 / 9

/**
 * Direção espiritual em destaque no banner, como nas artes de referência: recorte da pessoa à direita,
 * com a faixa "Direção espiritual · Nome" sobre o tronco para que ela não fique flutuando.
 * No celular fica abaixo do texto (faixa de nome logo abaixo); em telas largas a posição, o tamanho e a
 * faixa de nome seguem `director.placement` e `director.nameplate`, em % do banner.
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
  const { photo, parish, placement, nameplate, mobileCrop = 1 } = director
  const vars = {
    '--hero-w': `min(${placement.width}vw, ${(placement.width * WIDE).toFixed(1)}svh)`,
    '--hero-top': `${placement.top}%`,
    '--hero-right': `${placement.right}%`,
    '--hero-ar': `${photo.width} / ${photo.height}`,
    '--hero-ar-m': `${photo.width} / ${Math.round(photo.height * mobileCrop)}`,
    '--np-x': `${nameplate.x}%`,
    '--np-bottom': `${nameplate.bottom}%`,
  } as CSSProperties
  return (
    <div
      style={vars}
      // Celular: ocupa o que sobra da altura do slide (figura + faixa de nome); desktop: camada absoluta.
      className="relative mx-auto flex w-full min-h-[8rem] flex-1 flex-col items-center max-lg:min-h-0 lg:pointer-events-none lg:absolute lg:inset-0 lg:mx-0 lg:block lg:w-auto"
    >
      <figure className="relative flex min-h-0 w-full flex-1 flex-col items-center lg:static lg:block">
        <div className="relative aspect-[var(--hero-ar-m)] min-h-0 max-w-full flex-1 overflow-hidden lg:absolute lg:top-[var(--hero-top)] lg:right-[var(--hero-right)] lg:aspect-[var(--hero-ar)] lg:w-[var(--hero-w)] lg:flex-none lg:overflow-visible">
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 336px"
            // No celular a figura termina numa transparência acima da faixa de nome; no desktop sai pelo pé do banner.
            className="object-cover object-top max-lg:[mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)]"
          />
        </div>
        {/* Sombra atrás da faixa de nome (só em telas largas, onde ela fica sobre a veste), como na arte. */}
        <div
          className="pointer-events-none absolute hidden lg:bottom-0 lg:left-[var(--np-x)] lg:block lg:h-[42%] lg:w-[54vw] lg:-translate-x-1/2"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 50% 100% at 50% 100%, rgb(3 12 28 / 0.92) 0%, rgb(3 12 28 / 0.7) 45%, transparent 100%)',
          }}
          aria-hidden="true"
        />
        <figcaption className="relative z-[1] -mt-9 flex w-full shrink-0 flex-col max-lg:w-screen items-center text-center max-lg:bg-[linear-gradient(to_bottom,transparent_0%,rgb(3_12_28/0.8)_32%,rgb(3_12_28/0.85)_72%,transparent_100%)] max-lg:pt-7 max-lg:pb-3 [text-shadow:0_2px_14px_rgb(0_0_0/0.65)] lg:absolute lg:inset-x-auto lg:bottom-[max(5.25rem,var(--np-bottom))] lg:left-[var(--np-x)] lg:mt-0 lg:w-[36vw] lg:-translate-x-1/2">
          <CrossMark />
          <span className="mt-[0.35em] flex items-center gap-3">
            <span className={`${RULE} bg-gradient-to-r`} aria-hidden="true" />
            <span className="font-label text-[0.68rem] font-medium tracking-[0.24em] whitespace-nowrap text-gold-300 uppercase lg:text-[clamp(0.7rem,2.1svh,1.2rem)] lg:tracking-[0.3em]">
              {role}
            </span>
            <span className={`${RULE} bg-gradient-to-l`} aria-hidden="true" />
          </span>
          <span className="mt-1 font-display text-[clamp(1.35rem,3.6svh,1.6rem)] leading-[1.1] font-normal tracking-[-0.01em] whitespace-nowrap text-white lg:text-[clamp(1.5rem,3.7svh,2.45rem)]">
            {name}
          </span>
          {parish?.length ? (
            <span className="mt-[0.5em] flex flex-col font-label text-[clamp(0.6rem,1.45svh,0.8rem)] font-medium tracking-[0.2em] text-white/85 uppercase">
              {parish.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ) : null}
          <span className="mt-2 flex items-center gap-3 lg:mt-3" aria-hidden="true">
            <span className={`${RULE} bg-gradient-to-r`} />
            <FleurMark />
            <span className={`${RULE} bg-gradient-to-l`} />
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
