import { BellRing, Handshake } from 'lucide-react'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

/** Homepage: convite discreto para receber novidades das peregrinações. */
export function NewsletterInvite() {
  return (
    <section aria-labelledby="novidades-titulo" className="bg-cream-50 pb-4">
      <div className="container-site">
        <Reveal className="relative isolate flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[var(--radius-panel)] bg-white px-8 py-10 text-center shadow-soft ring-1 ring-navy-900/5 sm:flex-row sm:px-12 sm:text-left">
          <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} aria-hidden="true" className="pointer-events-none absolute -top-16 -left-20 -z-10 w-[220px] opacity-[0.08] select-none" />
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              <BellRing className="size-6" aria-hidden="true" strokeWidth={1.7} />
            </span>
            <div>
              <h2 id="novidades-titulo" className="font-display text-[1.6rem] leading-snug text-navy-900">
                Receba novidades das próximas peregrinações
              </h2>
              <p className="mt-1.5 max-w-xl text-slate-700">Conte quais destinos lhe interessam e a Via Lumina compartilha roteiros e informações relevantes para você.</p>
            </div>
          </div>
          <ButtonLink href="/cadastro/peregrinos?origem=home" variant="primary" className="shrink-0">
            Quero receber informações
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}

/** Páginas institucionais: convite a padres e agências para conhecerem as possibilidades de parceria. */
export function PartnershipInvite() {
  return (
    <section aria-labelledby="parcerias-titulo" className="bg-cream-50 pb-24">
      <div className="container-site">
        <Reveal className="grid gap-8 rounded-[var(--radius-panel)] bg-white p-8 shadow-soft ring-1 ring-navy-900/5 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">Parcerias</p>
            <h2 id="parcerias-titulo" className="title-rule text-[1.9rem] leading-tight font-medium sm:text-[2.3rem]">
              Caminhe ao lado da Via Lumina
            </h2>
            <p className="mt-6 max-w-xl text-lg text-slate-700">Padres e agências de turismo interessados em peregrinações podem se cadastrar para conhecer as possibilidades de parceria e conversar com a nossa equipe.</p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/cadastro/padres?origem=institucional" variant="primary" icon={<Handshake className="size-5" aria-hidden="true" />}>
              Para padres
            </ButtonLink>
            <ButtonLink href="/cadastro/agencias?origem=institucional" variant="outline">
              Para agências
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
