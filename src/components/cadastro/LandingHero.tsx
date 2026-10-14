import { existsSync } from 'fs'
import Image from 'next/image'
import path from 'path'
import { ArrowDown, BadgeCheck, Building2, Church, Compass, UsersRound } from 'lucide-react'
import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs'
import { LANDING_IMAGES, type LandingImageKey } from '@/content/cadastro-images'
import { HeroMotion, HeroMotionItem } from './motion'

/** Usa a imagem de IA quando o arquivo existe em public/; caso contrário, a fotografia do acervo. */
function resolveImage(key: LandingImageKey) {
  const spec = LANDING_IMAGES[key]
  const aiExists = existsSync(path.join(process.cwd(), 'public', spec.ai.src))
  return aiExists ? { ...spec.ai, position: 'center', isAi: true } : { ...spec.fallback, position: spec.fallback.position ?? 'center', isAi: false }
}

type Variant = 'padres' | 'agencias' | 'formadores' | 'peregrinos'

/** Selo que diz, de relance, a quem se destina o cadastro. */
const AUDIENCE = {
  padres: { label: 'Cadastro para padres', Icon: Church },
  agencias: { label: 'Cadastro para agências', Icon: Building2 },
  formadores: { label: 'Cadastro para formadores', Icon: UsersRound },
  peregrinos: { label: 'Cadastro de clientes · Peregrinos', Icon: Compass },
} as const

type Props = {
  variant: Variant
  imageKey: LandingImageKey
  eyebrow: string
  title: string
  text: string
  cta: string
  crumbs: Crumb[]
  trust?: string[]
}

const NAVY = 'bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_50%,#0d3568_80%,#071f42_100%)]'
const RAYS = '/assets/logos/raios-via-lumina.webp'

function Badge({ variant, className = '' }: { variant: Variant; className?: string }) {
  const { label, Icon } = AUDIENCE[variant]
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-navy-950/40 px-3.5 py-1.5 font-label text-[0.7rem] font-bold tracking-[0.14em] text-white uppercase sm:px-4 sm:py-2 sm:text-xs ${className}`}>
      <Icon className="size-4 text-gold-300" aria-hidden="true" />
      {label}
    </p>
  )
}

function CtaButton({ cta }: { cta: string }) {
  return (
    <a
      href="#cadastro"
      className="group/btn inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gold-500 px-8 font-label text-[0.9375rem] font-semibold tracking-wide text-navy-950 shadow-[0_12px_30px_rgb(201_146_42/0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-300"
    >
      {cta}
      <ArrowDown className="size-5 transition-transform group-hover/btn:translate-y-0.5" aria-hidden="true" />
    </a>
  )
}

function AiCaption({ show, className = '' }: { show: boolean; className?: string }) {
  return show ? <p className={`text-xs text-white/60 ${className}`}>Imagem ilustrativa criada por inteligência artificial.</p> : null
}

/**
 * Hero das landing pages de cadastro. Mesmo conteúdo e mesma paleta (azul, branco e dourado da marca),
 * com composições diferentes para que cada público reconheça a sua página de relance:
 *  - padres: arco (janela de igreja) com moldura dourada;
 *  - agencias e formadores: fotografia em faixa lateral e barra branca de credenciais;
 *  - peregrinos: fotografia de fundo, texto centralizado (a porta principal do site).
 */
export function LandingHero({ variant, imageKey, eyebrow, title, text, cta, crumbs, trust }: Props) {
  const img = resolveImage(imageKey)
  const eyebrowEl = <p className="eyebrow-light mb-4 hidden sm:block">{eyebrow}</p>

  if (variant === 'peregrinos') {
    return (
      <section className="relative isolate flex min-h-[78svh] items-center overflow-hidden bg-navy-950 text-white">
        <Image src={img.src} alt={img.alt} fill preload sizes="100vw" className="-z-10 object-cover" style={{ objectPosition: img.position }} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_26_54/0.55)_0%,rgb(4_26_54/0.2)_40%,rgb(4_26_54/0.7)_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(4_26_54/0.35)_0%,rgb(4_26_54/0.1)_75%)]" aria-hidden="true" />
        <div className="container-site pt-28 pb-14 sm:pt-32 sm:pb-20">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <HeroMotion className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <HeroMotionItem>
              <Badge variant={variant} className="mb-5" />
            </HeroMotionItem>
            <HeroMotionItem>
              <h1 className="text-[2.35rem] leading-[1.06] font-medium text-white sm:text-5xl lg:text-[3.8rem]">{title}</h1>
            </HeroMotionItem>
            <HeroMotionItem>
              <div className="mx-auto my-6 h-[3px] w-24 rounded-full bg-gold-300" aria-hidden="true" />
            </HeroMotionItem>
            <HeroMotionItem>
              <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">{text}</p>
            </HeroMotionItem>
            <HeroMotionItem>
              <div className="mt-8">
                <CtaButton cta={cta} />
              </div>
            </HeroMotionItem>
            {trust?.length ? (
              <HeroMotionItem>
                <ul className="mt-8 flex flex-wrap justify-center gap-3 font-label text-xs font-semibold tracking-wide text-navy-900">
                  {trust.map((t) => (
                    <li key={t} className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2">
                      <span className="size-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </HeroMotionItem>
            ) : null}
          </HeroMotion>
          <AiCaption show={img.isAi} className="mt-8 text-center" />
        </div>
      </section>
    )
  }

  if (variant === 'agencias' || variant === 'formadores') {
    return (
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <div className={`relative lg:min-h-[640px] ${NAVY}`}>
          {/* Fotografia: faixa no topo no celular; coluna sangrada à direita no desktop. */}
          <div className="relative h-60 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%]">
            <Image src={img.src} alt={img.alt} fill preload sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" style={{ objectPosition: img.position }} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/15 lg:to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-950/70 to-transparent" aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 hidden w-1 bg-gold-500 lg:block" aria-hidden="true" />
          </div>
          <div className="container-site relative grid lg:min-h-[640px] lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <HeroMotion className="pt-8 pb-14 lg:py-36 lg:pr-10">
              <Breadcrumbs items={crumbs} className="mb-6" />
              <HeroMotionItem>
                <Badge variant={variant} className="mb-5" />
              </HeroMotionItem>
              <HeroMotionItem>{eyebrowEl}</HeroMotionItem>
              <HeroMotionItem>
                <h1 className="text-[2.35rem] leading-[1.06] font-medium text-white sm:text-5xl lg:text-[3.2rem]">{title}</h1>
              </HeroMotionItem>
              <HeroMotionItem>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{text}</p>
              </HeroMotionItem>
              <HeroMotionItem>
                <div className="mt-8">
                  <CtaButton cta={cta} />
                </div>
              </HeroMotionItem>
              <AiCaption show={img.isAi} className="mt-6" />
            </HeroMotion>
          </div>
        </div>
        {trust?.length ? (
          <div className="relative border-t-4 border-gold-500 bg-white">
            <ul className="container-site flex flex-col gap-x-10 gap-y-2 py-5 font-label text-sm font-semibold text-navy-900 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <BadgeCheck className="size-5 shrink-0 text-gold-500" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    )
  }

  // padres: arco com moldura dourada sobre o azul institucional
  return (
    <section className={`relative isolate overflow-hidden text-white ${NAVY}`}>
      <Image src={RAYS} alt="" width={636} height={1280} aria-hidden="true" className="pointer-events-none absolute -top-10 right-[38%] -z-10 hidden w-[320px] opacity-[0.07] select-none lg:block" />
      <div className="pointer-events-none absolute top-1/2 right-[6%] -z-10 hidden size-[560px] -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl lg:block" aria-hidden="true" />
      <div className="container-site grid items-center gap-10 pt-28 pb-14 sm:pt-32 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-36 lg:pb-24">
        <HeroMotion className="order-2 lg:order-1">
          <Breadcrumbs items={crumbs} className="mb-6" />
          <HeroMotionItem>
            <Badge variant={variant} className="mb-4 sm:mb-5" />
          </HeroMotionItem>
          <HeroMotionItem>{eyebrowEl}</HeroMotionItem>
          <HeroMotionItem>
            <h1 className="text-[2.35rem] leading-[1.06] font-medium text-white sm:text-5xl lg:text-[3.4rem]">{title}</h1>
          </HeroMotionItem>
          <HeroMotionItem>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{text}</p>
          </HeroMotionItem>
          <HeroMotionItem>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CtaButton cta={cta} />
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
          <figure className="relative mx-auto w-full max-w-[210px] sm:max-w-[400px] lg:max-w-[440px]">
            <div className="rounded-t-[999px] rounded-b-[28px] border-2 border-gold-500/80 p-2.5 shadow-deep">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[20px] ring-1 ring-white/15">
                <Image src={img.src} alt={img.alt} fill preload sizes="(min-width: 1024px) 440px, 80vw" className="object-cover" style={{ objectPosition: img.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </div>
            {img.isAi ? <figcaption className="mt-3 text-center text-xs text-white/60">Imagem ilustrativa criada por inteligência artificial.</figcaption> : null}
          </figure>
        </HeroMotion>
      </div>
    </section>
  )
}
