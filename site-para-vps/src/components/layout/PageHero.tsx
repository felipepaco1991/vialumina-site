import Image from 'next/image'
import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { cn } from '@/lib/cn'

type Props = {
  image: { src: string; alt: string; position?: string }
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  crumbs: Crumb[]
  children?: ReactNode
  size?: 'md' | 'lg'
}

/** Cabeçalho das páginas internas: fotografia original com véu azul para legibilidade. */
export function PageHero({ image, eyebrow, title, intro, crumbs, children, size = 'md' }: Props) {
  return (
    <section className={cn('relative isolate flex items-end overflow-hidden bg-navy-950 text-white', size === 'lg' ? 'min-h-[min(88svh,760px)]' : 'min-h-[min(70svh,560px)]')}>
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="-z-10 animate-[fade-up_1.2s_var(--ease-out-soft)_both] object-cover" style={{ objectPosition: image.position ?? 'center' }} />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_26_54/0.55)_0%,rgb(4_26_54/0.25)_35%,rgb(4_26_54/0.85)_100%),linear-gradient(90deg,rgb(4_26_54/0.55)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-site pt-32 pb-14 sm:pb-20">
        <Breadcrumbs items={crumbs} className="mb-6 animate-fade-up" />
        {eyebrow ? <p className="eyebrow-light mb-4 animate-fade-up [animation-delay:80ms]">{eyebrow}</p> : null}
        <h1 className="max-w-4xl animate-[rise_0.9s_var(--ease-out-soft)_both] text-[2.6rem] leading-[1.04] font-medium text-white [animation-delay:140ms] sm:text-6xl lg:text-7xl">{title}</h1>
        {intro ? <div className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/85 [animation-delay:220ms] sm:text-xl">{intro}</div> : null}
        {children ? <div className="mt-8 animate-fade-up [animation-delay:300ms]">{children}</div> : null}
      </div>
    </section>
  )
}
