import { Compass } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { CONTACT, FINAL_CTA } from '@/content/institutional'

export function FinalCta({ whatsappHref, pdfWhatsappHref }: { whatsappHref: string; pdfWhatsappHref: string }) {
  return (
    <section aria-labelledby="cta-titulo" className="relative isolate overflow-hidden bg-navy-950 py-28 text-white sm:py-36">
      <Image src="/assets/institucional/paisagem-sagrada.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgb(4_26_54/0.92)_0%,rgb(10_46_92/0.8)_55%,rgb(10_46_92/0.55)_100%)]" aria-hidden="true" />
      <div className="container-site grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 id="cta-titulo" className="max-w-2xl text-[2.4rem] leading-[1.05] font-medium text-white sm:text-6xl">
            {FINAL_CTA.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/80">{FINAL_CTA.text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/destinos" variant="gold" size="lg" icon={<Compass className="size-5" aria-hidden="true" />}>
              Explorar peregrinações
            </ButtonLink>
            <ButtonLink href={whatsappHref} variant="whatsapp" size="lg" icon={<WhatsAppIcon className="size-5" />} data-track="whatsapp_click" data-track-label="cta-final">
              Falar pelo WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="rounded-[var(--radius-card)] border border-white/15 bg-white/8 p-7 backdrop-blur-md">
          <h3 className="font-display text-2xl text-white">{CONTACT.pdf.title}</h3>
          <p className="mt-3 text-white/75">{CONTACT.pdf.text}</p>
          <a
            href={pdfWhatsappHref}
            target="_blank"
            rel="noopener"
            data-track="info_request"
            data-track-label="pdf-whatsapp"
            className="mt-5 inline-flex items-center gap-2 font-label text-sm font-semibold text-gold-200 underline decoration-gold-300/60 underline-offset-6 hover:text-white"
          >
            <WhatsAppIcon className="size-4" /> {CONTACT.pdf.cta}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
