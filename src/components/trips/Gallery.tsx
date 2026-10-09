'use client'
import { Expand } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { ImageData } from '@/lib/trip-model'

export type GalleryItem = ImageData & { place: string | null; title: string | null }

// O lightbox (Radix Dialog + Motion) só é baixado quando o visitante abre uma foto.
const GalleryLightbox = dynamic(() => import('./GalleryLightbox'), { ssr: false })

/** Galeria responsiva com ampliação em lightbox (teclado, toque e legendas acessíveis). */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)

  /** Primeira foto em destaque + duas ao lado; demais em linhas de até 3, sem lacunas. */
  const layout = (i: number, n: number) => {
    if (n === 1) return 'sm:col-span-6 aspect-[16/9]'
    if (n === 2) return 'sm:col-span-3 aspect-[4/3]'
    if (i === 0) return 'sm:col-span-4 sm:row-span-2 aspect-[4/3] sm:aspect-auto'
    if (i < 3) return 'sm:col-span-2 aspect-[4/3]'
    const j = i - 3
    const rowCount = Math.min(3, n - 3 - (j - (j % 3)))
    return { 1: 'sm:col-span-6 aspect-[16/9] sm:aspect-[21/9]', 2: 'sm:col-span-3 aspect-[4/3]', 3: 'sm:col-span-2 aspect-[4/3]' }[rowCount]
  }

  return (
    <>
      <ul className="grid auto-rows-auto gap-3 sm:grid-cols-6 sm:gap-4">
        {items.map((item, i) => (
          <li key={item.url} className={cn('relative', layout(i, items.length))}>
            <button
              type="button"
              onClick={() => {
                setDirection(0)
                setIndex(i)
              }}
              className="group relative block size-full min-h-56 overflow-hidden rounded-[var(--radius-card)] bg-navy-900 text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-500"
            >
              <span className="sr-only">
                Ampliar foto {i + 1} de {items.length}:{' '}
              </span>
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes={i === 0 && items.length > 2 ? '(min-width: 1024px) 760px, 100vw' : '(min-width: 1024px) 380px, 100vw'}
                className="object-cover transition duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-105"
                style={{ objectPosition: `${item.focalX}% ${item.focalY}%` }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 p-5">
                {item.place ? <span className="eyebrow-light block">{item.place}</span> : null}
                <span className="mt-1 block font-display text-lg leading-snug text-white sm:text-xl">{item.title ?? item.alt}</span>
              </span>
              <span className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                <Expand className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {index !== null ? (
        <GalleryLightbox
          items={items}
          index={index}
          direction={direction}
          onNavigate={(delta) => {
            setDirection(delta)
            setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length))
          }}
          onClose={() => setIndex(null)}
        />
      ) : null}
    </>
  )
}
