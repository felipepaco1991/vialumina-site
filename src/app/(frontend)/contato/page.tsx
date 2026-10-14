import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PilgrimForm } from '@/components/cadastro/form/PilgrimForm'
import { ContactChoice } from '@/components/contact/ContactChoice'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapEmbed } from '@/components/contact/MapEmbed'
import { PageHero } from '@/components/layout/PageHero'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PILGRIM_PAGE } from '@/content/cadastro'
import { CONTACT } from '@/content/institutional'
import { leadWhatsapp } from '@/lib/leads/routing.server'
import { periodBadge } from '@/lib/format'
import { getSiteSettings } from '@/lib/settings.server'
import { getListedTrips } from '@/lib/trips.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Via Lumina Viagens pelo WhatsApp, telefone, e-mail ou formulário. Atendimento de segunda a sexta, das 8h às 18h.',
  alternates: { canonical: '/contato' },
}

export default async function ContatoPage({ searchParams }: PageProps<'/contato'>) {
  const [settings, trips, params] = await Promise.all([getSiteSettings(), getListedTrips(), searchParams])
  const requested = typeof params.roteiro === 'string' ? params.roteiro : undefined
  const tripOptions = [...trips]
    .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
    .map((t) => ({ slug: t.slug, label: `${t.title} — ${periodBadge(t.startDate, t.endDate) ?? ''}${t.departureCity ? ` · saída de ${t.departureCity}` : ''}` }))
  const signupWhatsapp = whatsappUrl(leadWhatsapp('PEREGRINO', settings.whatsapp), 'Olá! Gostaria de receber informações sobre as peregrinações da Via Lumina Viagens.')
  const contactForm = <ContactForm trips={tripOptions} defaultTrip={tripOptions.some((t) => t.slug === requested) ? requested : undefined} />
  const a = settings.address
  const fullAddress = a ? `${a.street}, ${a.complement} - ${a.district}, ${a.city} - ${a.state}, ${a.zip}` : ''

  const channels = [
    {
      icon: WhatsAppIcon,
      title: 'WhatsApp',
      value: settings.whatsappDisplay,
      note: settings.hours,
      href: whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined),
      track: 'whatsapp_click',
    },
    { icon: Phone, title: 'Telefone', value: settings.phoneDisplay, note: 'Central de atendimento', href: `tel:+${settings.phone}` },
    { icon: Mail, title: 'E-mail', value: settings.email, href: `mailto:${settings.email}` },
  ]

  return (
    <>
      <PageHero
        image={{ src: '/assets/destinos/rio-de-janeiro-aparecida/hero.webp', alt: 'Cristo Redentor e a Baía de Guanabara, no Rio de Janeiro', position: 'center 35%' }}
        eyebrow={CONTACT.eyebrow}
        title={CONTACT.title}
        intro={CONTACT.text}
        crumbs={[{ label: 'Contato', href: '/contato' }]}
      />

      <section className="bg-cream-50 py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading eyebrow="Canais oficiais" title="Atendimento Via Lumina" />
            </Reveal>
            <ul className="space-y-3">
              {channels.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 0.06}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                    {...(c.track ? { 'data-track': c.track, 'data-track-label': 'pagina-contato' } : {})}
                    className="group flex items-center gap-5 rounded-[var(--radius-card)] bg-white p-5 shadow-soft ring-1 ring-navy-900/5 transition hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700 transition group-hover:bg-navy-900 group-hover:text-white">
                      <c.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-label text-xs font-bold tracking-[0.16em] text-slate-500 uppercase">{c.title}</span>
                      <span className="mt-0.5 block text-lg font-semibold break-all text-navy-900">{c.value}</span>
                      {c.note ? <span className="block text-sm text-slate-500">{c.note}</span> : null}
                    </span>
                  </a>
                </Reveal>
              ))}
              {a ? (
                <Reveal as="li" delay={0.2}>
                  <div className="flex items-start gap-5 rounded-[var(--radius-card)] bg-white p-5 shadow-soft ring-1 ring-navy-900/5">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <address className="not-italic">
                      <span className="block font-label text-xs font-bold tracking-[0.16em] text-slate-500 uppercase">Endereço</span>
                      <span className="mt-0.5 block font-semibold text-navy-900">
                        {a.street}, {a.complement}
                      </span>
                      <span className="block text-slate-700">
                        {a.district} | {a.city} - {a.state} | CEP {a.zip}
                      </span>
                    </address>
                  </div>
                </Reveal>
              ) : null}
              {settings.hours ? (
                <Reveal as="li" delay={0.24} className="flex items-center gap-3 px-2 pt-2 text-sm text-slate-500">
                  <Clock className="size-4" aria-hidden="true" /> Atendimento: {settings.hours}
                </Reveal>
              ) : null}
            </ul>
            {fullAddress ? (
              <Reveal delay={0.1}>
                <MapEmbed query={fullAddress} label={`Praça Dom José Gaspar, 134 — República, São Paulo`} />
              </Reveal>
            ) : null}
          </div>

          <div id="formulario" className="scroll-mt-28">
            <Reveal>
              <SectionHeading
                eyebrow="Formulário"
                title="Faça sua solicitação ou cadastre-se"
                intro="Conte para nós qual peregrinação desperta seu interesse ou cadastre-se para entrar na nossa base de peregrinos. Retornamos pelo canal de sua preferência."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              {/* useSearchParams exige Suspense; o fallback é o próprio formulário de solicitação. */}
              <Suspense fallback={contactForm}>
                <ContactChoice
                  eyebrow="Cadastro de clientes"
                  title="Cadastre-se na Via Lumina"
                  description={PILGRIM_PAGE.form.description}
                  signup={<PilgrimForm whatsappHref={signupWhatsapp} communityHref={settings.communityUrl || undefined} />}
                >
                  {contactForm}
                </ContactChoice>
              </Suspense>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
