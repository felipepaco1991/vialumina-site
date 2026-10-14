import { ArrowDown, Compass, HandHeart, Headset } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { HERO } from '@/content/institutional'

export function HomeHero({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950 text-white" aria-labelledby="hero-titulo">
      <Image
        src="/assets/home/hero-banner-topo.webp"
        alt="Muralhas da Cidade Antiga de Jerusalém ao entardecer, com os raios dourados da Via Lumina"
        fill
        preload
        sizes="100vw"
        className="-z-10 scale-[1.04] animate-[hero-zoom_14s_ease-out_both] object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(4_26_54/0.15)_0%,rgb(4_26_54/0.55)_70%),linear-gradient(180deg,rgb(4_26_54/0.35)_0%,transparent_30%,rgb(4_26_54/0.7)_100%)]" aria-hidden="true" />

      <div className="container-site pt-28 pb-36 text-center sm:pb-40">
        <p className="animate-fade-up font-display text-2xl font-normal text-white/90 italic sm:text-3xl">{HERO.kicker}</p>
        <h1 id="hero-titulo" className="mt-2 animate-[rise_0.9s_var(--ease-out-soft)_both] text-[3.1rem] leading-[0.98] font-medium text-white [animation-delay:120ms] sm:text-7xl lg:text-[6.5rem]">
          {HERO.title}
        </h1>
        <div className="mx-auto my-7 h-[3px] w-24 origin-center animate-[rule-grow_1s_var(--ease-out-soft)_0.35s_both] rounded-full bg-gold-300" aria-hidden="true" />
        <p className="mx-auto max-w-2xl animate-fade-up font-display text-xl text-gold-200 [animation-delay:260ms] sm:text-2xl">{HERO.tagline}</p>
        <p className="mx-auto mt-3 max-w-xl animate-fade-up text-lg text-white/85 [animation-delay:320ms]">{HERO.text}</p>
        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:420ms] sm:flex-row">
          <ButtonLink href={whatsappHref} variant="whatsapp" size="lg" icon={<WhatsAppIcon className="size-5" />} data-track="whatsapp_click" data-track-label="hero">
            Falar pelo WhatsApp
          </ButtonLink>
          <ButtonLink href="/destinos" variant="ghost-light" size="lg" icon={<Compass className="size-5" aria-hidden="true" />}>
            Explorar peregrinações
          </ButtonLink>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 hidden border-t border-white/15 bg-navy-950/35 backdrop-blur-md sm:block">
        <ul className="container-site flex items-center justify-center gap-10 py-5 font-label text-sm font-semibold tracking-wide text-white/90">
          <li className="flex items-center gap-2.5">
            <HandHeart className="size-5 text-gold-300" aria-hidden="true" /> {HERO.badges[0]}
          </li>
          <li className="flex items-center gap-2.5">
            <Headset className="size-5 text-gold-300" aria-hidden="true" /> {HERO.badges[1]}
          </li>
        </ul>
      </div>
      <a href="#diferenciais" className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 animate-bounce rounded-full p-2 text-white/70 hover:text-white sm:block" aria-label="Rolar para o conteúdo">
        <ArrowDown className="size-5" />
      </a>
    </section>
  )
}
