import type { Metadata } from 'next'
import { CalendarDays, CalendarRange, ExternalLink, HeartHandshake, MapPin } from 'lucide-react'
import Image from 'next/image'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { CRESCER } from '@/content/promocoes'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

const PATH = '/promocoes/crescer'
const description = `${CRESCER.name} — ${CRESCER.fullName}: ${CRESCER.dates}, em ${CRESCER.place}. ${CRESCER.tagline} Inscrição gratuita no site oficial.`

export const metadata: Metadata = {
  title: `${CRESCER.name} — ${CRESCER.fullName}`,
  description,
  alternates: { canonical: PATH },
  openGraph: {
    title: `${CRESCER.name} | Via Lumina Viagens`,
    description,
    url: PATH,
    type: 'website',
    images: [
      { url: CRESCER.banner.src, width: CRESCER.banner.width, height: CRESCER.banner.height },
    ],
  },
}

const LINKS = [
  {
    label: 'Programação',
    text: 'Veja a agenda e as atrações do encontro.',
    href: CRESCER.programUrl,
  },
  {
    label: 'Caravanas',
    text: 'Informações sobre caravanas para o evento.',
    href: CRESCER.caravansUrl,
  },
  {
    label: 'Hospedagens',
    text: 'Opções de hospedagem em Campina Grande.',
    href: CRESCER.lodgingUrl,
  },
]

export default async function CrescerPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(
    settings.whatsapp,
    `Olá! Tenho interesse no ${CRESCER.name} (${CRESCER.place}, ${CRESCER.dates}). Podem me ajudar?`,
  )
  return (
    <>
      <LandingMeta
        event="view_promo_crescer"
        path={PATH}
        name={`${CRESCER.name} — ${CRESCER.fullName}`}
        description={description}
      />
      <section
        className="relative isolate overflow-hidden pt-28 text-white"
        style={{ backgroundColor: CRESCER.banner.color }}
      >
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: 'Promoções', href: '/promocoes' },
              { label: CRESCER.name, href: PATH },
            ]}
            className="mb-6"
          />
          <p className="eyebrow-light mb-3">Evento católico em {CRESCER.place}</p>
          <h1 className="max-w-4xl text-[2.4rem] leading-[1.05] font-medium text-white sm:text-6xl">
            {CRESCER.name} — {CRESCER.fullName}
          </h1>
        </div>
        <Image
          src={CRESCER.banner.src}
          alt={CRESCER.bannerAlt}
          width={CRESCER.banner.width}
          height={CRESCER.banner.height}
          preload
          sizes="100vw"
          className="mt-8 h-auto w-full"
        />
      </section>

      <section aria-labelledby="sobre-crescer" className="bg-white py-20 sm:py-24">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-3">{CRESCER.tagline}</p>
            <h2
              id="sobre-crescer"
              className="title-rule text-[2rem] leading-tight font-medium sm:text-[2.6rem]"
            >
              30 anos de fé, evangelização e família
            </h2>
            <div className="mt-7 space-y-4 text-lg leading-relaxed text-slate-700">
              <p>
                O {CRESCER.name} marca três décadas dedicadas à fé, à evangelização e à valorização
                da família católica. O encontro é realizado em {CRESCER.place} e organizado pela{' '}
                {CRESCER.organizer}.
              </p>
              <p>A inscrição é gratuita e feita diretamente no site oficial do evento.</p>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={CRESCER.signupUrl}
                variant="gold"
                size="lg"
                iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
                data-track="promo_click"
                data-track-label="crescer-pagina-inscricao"
              >
                Inscreva-se grátis
              </ButtonLink>
              <ButtonLink
                href={CRESCER.siteUrl}
                variant="outline"
                size="lg"
                iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
                data-track="promo_click"
                data-track-label="crescer-site-oficial"
              >
                Site oficial do evento
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-[var(--radius-panel)] bg-cream-50 p-8 ring-1 ring-navy-900/5 sm:p-10"
          >
            <h3 className="text-[1.5rem] font-medium text-navy-900">Informações do evento</h3>
            <dl className="mt-6 space-y-5 text-slate-700">
              <div className="flex gap-3">
                <dt className="shrink-0">
                  <CalendarDays className="mt-0.5 size-5 text-gold-500" aria-hidden="true" />
                  <span className="sr-only">Datas</span>
                </dt>
                <dd className="text-lg font-semibold text-navy-900">{CRESCER.dates}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0">
                  <MapPin className="mt-0.5 size-5 text-gold-500" aria-hidden="true" />
                  <span className="sr-only">Local</span>
                </dt>
                <dd className="text-lg font-semibold text-navy-900">{CRESCER.place}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0">
                  <HeartHandshake className="mt-0.5 size-5 text-gold-500" aria-hidden="true" />
                  <span className="sr-only">Organização</span>
                </dt>
                <dd>{CRESCER.organizer}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0">
                  <CalendarRange className="mt-0.5 size-5 text-gold-500" aria-hidden="true" />
                  <span className="sr-only">Inscrição</span>
                </dt>
                <dd>Inscrição gratuita</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="links-crescer" className="bg-cream-50 py-20 sm:py-24">
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-3">Antes de ir</p>
            <h2
              id="links-crescer"
              className="title-rule text-[2rem] leading-tight font-medium sm:text-[2.4rem]"
            >
              Planeje sua participação
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {LINKS.map((l, i) => (
              <Reveal as="li" key={l.label} delay={i * 0.08}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  data-track="promo_click"
                  data-track-label={`crescer-${l.label.toLowerCase()}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-soft ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <h3 className="flex items-center justify-between gap-3 text-[1.4rem] font-medium text-navy-900">
                    {l.label}
                    <ExternalLink className="size-5 text-gold-500" aria-hidden="true" />
                  </h3>
                  <p className="mt-3 text-slate-700">{l.text}</p>
                  <span className="mt-5 font-label text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4">
                    Abrir no site oficial
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-50 pb-24">
        <div className="container-site">
          <Reveal>
            <div
              className="relative isolate overflow-hidden rounded-[var(--radius-panel)] px-8 py-14 text-center text-white sm:px-16"
              style={{ backgroundColor: CRESCER.banner.color }}
            >
              <h2 className="mx-auto max-w-2xl text-[2rem] leading-tight font-medium text-white sm:text-[2.4rem]">
                Tem dúvidas? Fale com a Via Lumina
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                Nossa equipe está pronta para conversar com você pelo WhatsApp.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink
                  href={wa}
                  variant="whatsapp"
                  icon={<WhatsAppIcon className="size-5" />}
                  data-track="whatsapp_click"
                  data-track-label="promo-crescer"
                >
                  Falar pelo WhatsApp
                </ButtonLink>
                <ButtonLink href="/destinos" variant="ghost-light">
                  Explorar peregrinações
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
