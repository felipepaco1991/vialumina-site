import { existsSync } from 'fs'
import Image from 'next/image'
import path from 'path'
import { ArrowDown } from 'lucide-react'
import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs'
import { LANDING_IMAGES, type LandingImageKey } from '@/content/cadastro-images'
import { HeroMotion, HeroMotionItem } from './motion'

/** Usa a imagem de IA quando o arquivo existe em public/; caso contrário, a fotografia do acervo. */
function resolveImage(key: LandingImageKey) {
  const spec = LANDING_IMAGES[key]
  const aiExists = existsSync(path.join(process.cwd(), 'public', spec.ai.src))
  return aiExists ? { ...spec.ai, position: 'center', isAi: true } : { ...spec.fallback, position: spec.fallback.position ?? 'center', isAi: false }
}

type Props = {
  imageKey: LandingImageKey
  eyebrow: string
  title: string
  text: string
  cta: string
  crumbs: Crumb[]
  trust?: string[]
}

/** Hero em duas colunas (texto + fotografia). Fundo no azul institucional, compatível com o cabeçalho transparente. */
export function LandingHero({ imageKey, eyebrow, title, text, cta, crumbs, trust }: Props) {
  const img = resolveImage(imageKey)
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_50%,#0d3568_80%,#071f42_100%)] text-white">
      <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} aria-hidden="true" className="pointer-events-none absolute -top-10 right-[38%] -z-10 hidden w-[320px] opacity-[0.07] select-none lg:block" />
      <div className="container-site grid items-center gap-10 pt-28 pb-14 sm:pt-32 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-36 lg:pb-24">
        <HeroMotion className="order-2 lg:order-1">
          <Breadcrumbs items={crumbs} className="mb-6" />
          <HeroMotionItem>
            <p className="eyebrow-light mb-4">{eyebrow}</p>
          </HeroMotionItem>
          <HeroMotionItem>
            <h1 className="text-[2.35rem] leading-[1.06] font-medium text-white sm:text-5xl lg:text-[3.4rem]">{title}</h1>
          </HeroMotionItem>
          <HeroMotionItem>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{text}</p>
          </HeroMotionItem>
          <HeroMotionItem>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#cadastro"
                className="group/btn inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gold-500 px-8 font-label text-[0.9375rem] font-semibold tracking-wide text-navy-950 shadow-[0_12px_30px_rgb(201_146_42/0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-300"
              >
                {cta}
                <ArrowDown className="size-5 transition-transform group-hover/btn:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </HeroMotionItem>
          {trust?.length ? (
            <HeroMotionItem>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-label text-xs font-semibold tracking-wide text-white/70">
                {trust.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-gold-300" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </HeroMotionItem>
          ) : null}
        </HeroMotion>

        <HeroMotion className="order-1 lg:order-2" delay={0.15}>
          <figure className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -right-4 -bottom-4 size-full rounded-[var(--radius-panel)] border-2 border-gold-500/60" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] shadow-deep ring-1 ring-white/15 lg:aspect-[5/4]">
              <Image src={img.src} alt={img.alt} fill preload sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" style={{ objectPosition: img.position }} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent" aria-hidden="true" />
            </div>
            {img.isAi ? <figcaption className="mt-3 text-xs text-white/60">Imagem ilustrativa criada por inteligência artificial.</figcaption> : null}
          </figure>
        </HeroMotion>
      </div>
    </section>
  )
}
