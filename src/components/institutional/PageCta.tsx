import { Compass } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { FINAL_CTA } from '@/content/institutional'

/** Chamada final compacta usada nas páginas institucionais. */
export function PageCta({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section className="bg-cream-50 pb-24">
      <div className="container-site">
        <Reveal className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-[linear-gradient(135deg,#0a2e5c,#0f4c81)] px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl text-[2rem] leading-tight font-medium text-white sm:text-[2.6rem]">{FINAL_CTA.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{FINAL_CTA.text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/destinos" variant="gold" icon={<Compass className="size-5" aria-hidden="true" />}>
              Explorar peregrinações
            </ButtonLink>
            <ButtonLink href={whatsappHref} variant="whatsapp" icon={<WhatsAppIcon className="size-5" />} data-track="whatsapp_click" data-track-label="cta-institucional">
              Falar pelo WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
