import { ArrowRight, Compass } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { ScrollReveal } from './motion'

/** Faixa discreta para quem prefere conversar antes de preencher o formulário. */
export function WhatsAppStrip({ href, text }: { href: string; text: string }) {
  return (
    <section className="bg-white py-14">
      <div className="container-site">
        <ScrollReveal className="flex flex-col items-center justify-between gap-6 rounded-[var(--radius-panel)] bg-cream-100 px-8 py-8 text-center sm:flex-row sm:text-left">
          <p className="max-w-xl font-display text-[1.35rem] leading-snug text-navy-900">{text}</p>
          <ButtonLink href={href} variant="whatsapp" icon={<WhatsAppIcon className="size-5" />} data-track="click_whatsapp" data-track-label="lp-faixa">
            Falar pelo WhatsApp
          </ButtonLink>
        </ScrollReveal>
      </div>
    </section>
  )
}

/** Chamada final da página de peregrinos, levando ao catálogo de destinos. */
export function FinalCtaDestinations({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <section aria-labelledby="chamada-final" className="bg-cream-50 py-20 sm:py-24">
      <div className="container-site">
        <ScrollReveal className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-[linear-gradient(135deg,#0a2e5c,#0f4c81)] px-8 py-16 text-center text-white sm:px-16">
          <h2 id="chamada-final" className="mx-auto max-w-3xl text-[2rem] leading-tight font-medium text-white sm:text-[2.8rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{text}</p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/destinos" variant="gold" size="lg" icon={<Compass className="size-5" aria-hidden="true" />} iconAfter={<ArrowRight className="size-5" aria-hidden="true" />} data-track="click_destinos" data-track-label="chamada-final-peregrinos">
              {cta}
            </ButtonLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
