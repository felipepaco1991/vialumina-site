import Image from 'next/image'
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

const rule = (dir: 'l' | 'r') =>
  `h-px w-[clamp(1.5rem,6svh,3.5rem)] bg-gradient-to-${dir} from-transparent to-gold-300/90`

/**
 * Direção espiritual em destaque no banner, como na arte de referência: recorte da pessoa encostado no
 * pé do banner, com a faixa "Direção espiritual · Nome · Paróquia" sobre o tronco para que ela não
 * fique flutuando. No celular fica abaixo do texto; em telas largas ocupa 88% da altura, à direita.
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
    <div className="relative mx-auto mt-4 w-[min(100%,21rem)] lg:pointer-events-none lg:absolute lg:inset-0 lg:mx-0 lg:mt-0 lg:w-auto">
      <figure className="relative lg:absolute lg:right-[1.5%] lg:bottom-0 lg:aspect-[1280/1654] lg:h-[88%]">
        <div className="relative aspect-[1280/1654] w-full lg:absolute lg:inset-0 lg:aspect-auto">
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 660px, 336px"
            // No celular a figura termina acima da faixa de nome (que fica no fluxo); no desktop encosta no pé do banner.
            className="object-contain object-bottom max-lg:[mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)]"
          />
        </div>
        <figcaption className="relative -mx-[10%] -mt-[22%] flex flex-col items-center text-center [text-shadow:0_2px_14px_rgb(0_0_0/0.65)] lg:absolute lg:inset-x-[-6%] lg:bottom-[5.25rem] lg:mx-0 lg:mt-0">
          <CrossMark />
          <span className="mt-[0.35em] flex items-center gap-3">
            <span className={rule('r')} aria-hidden="true" />
            <span className="font-label text-[0.72rem] font-medium tracking-[0.26em] whitespace-nowrap lg:text-[clamp(0.7rem,2.1svh,1.2rem)] lg:tracking-[0.3em] text-gold-300 uppercase">
              {role}
            </span>
            <span className={rule('l')} aria-hidden="true" />
          </span>
          <span className="mt-1 font-display text-[1.6rem] leading-[1.1] whitespace-nowrap lg:text-[clamp(1.5rem,3.7svh,2.45rem)] font-normal tracking-[-0.01em] text-white">
            {name}
          </span>
          {parish?.length ? (
            <span className="mt-[0.5em] flex flex-col font-label text-[clamp(0.6rem,1.45svh,0.8rem)] font-medium tracking-[0.2em] text-white/85 uppercase">
              {parish.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ) : null}
          <span className="mt-3 flex items-center gap-3" aria-hidden="true">
            <span className={rule('r')} />
            <FleurMark />
            <span className={rule('l')} />
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
