import { ArrowRight, Compass, UsersRound } from 'lucide-react'
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

/** Convite à comunidade no WhatsApp (cadastro de clientes): é onde a equipe acompanha os peregrinos de perto. */
export function CommunityInvite({ href, title, text, cta }: { href: string; title: string; text: string; cta: string }) {
  return (
    <section aria-labelledby="comunidade-titulo" className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <ScrollReveal className="flex flex-col items-center gap-8 rounded-[var(--radius-panel)] bg-cream-100 px-8 py-10 text-center sm:px-12 lg:flex-row lg:text-left">
          <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
            <UsersRound className="size-8" aria-hidden="true" strokeWidth={1.6} />
          </span>
          <div className="flex-1">
            <h2 id="comunidade-titulo" className="font-display text-[1.7rem] leading-snug font-medium text-navy-900">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-lg text-slate-700">{text}</p>
          </div>
          <ButtonLink href={href} variant="primary" size="lg" icon={<UsersRound className="size-5" aria-hidden="true" />} data-track="click_comunidade" data-track-label="lp-peregrinos">
            {cta}
          </ButtonLink>
        </ScrollReveal>
      </div>
    </section>
  )
}
