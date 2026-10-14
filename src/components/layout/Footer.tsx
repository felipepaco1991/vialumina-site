import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/Icons'
import type { SiteSettingsData } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'
import { CONTACT_ITEM, NAV_ITEMS, PROMOTION_ITEMS, SIGNUP_LINKS } from '@/lib/nav'

/** Logos brancas dos parceiros (altura uniforme; Crescer e Trivva levam às páginas de promoção). */
const PARTNERS = [
  { name: 'Crescer — Encontro Nacional da Família Católica', src: '/assets/logos/crescer-branco.webp', width: 733, height: 158, href: '/promocoes/crescer' },
  { name: 'Trivva', src: '/assets/logos/trivva-branco.webp', width: 1598, height: 376, href: '/promocoes/trivva' },
  { name: 'AD Viagens e Turismo — 40 anos', src: '/assets/logos/ad-viagens-branco.webp', width: 975, height: 297, href: null },
] as const

export function Footer({ settings }: { settings: SiteSettingsData }) {
  const a = settings.address
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_45%,#0d3568_75%,#071f42_100%)] text-white/80">
      <Image
        src="/assets/logos/raios-via-lumina.webp"
        alt=""
        width={636}
        height={1280}
        className="pointer-events-none absolute -top-24 -right-24 w-[340px] opacity-[0.07] select-none"
        aria-hidden="true"
      />
      <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_1.1fr_0.7fr_1fr] lg:gap-10 lg:py-20">
        <div className="space-y-6">
          <Image src="/assets/logos/via-lumina-logo-branco.webp" alt="Via Lumina — viagens de fé" width={220} height={90} className="h-auto w-[200px]" />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-white/70">
            Caminhos de Fé, Experiência e Propósito com Deus. Uma operadora especializada em turismo religioso, parte de um Grupo com mais de 40 anos de história no turismo.
          </p>
          <div className="flex gap-3">
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} target="_blank" rel="noopener" aria-label="Instagram da Via Lumina" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold-300 hover:text-gold-200">
                <InstagramIcon className="size-5" />
              </a>
            ) : null}
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} target="_blank" rel="noopener" aria-label="Facebook da Via Lumina" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 transition hover:border-gold-300 hover:text-gold-200">
                <FacebookIcon className="size-5" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="eyebrow-light mb-5 font-label">Atendimento</h2>
          <ul className="space-y-4 text-[0.95rem]">
            <li>
              <a href={whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)} target="_blank" rel="noopener" className="flex gap-3 hover:text-white" data-track="whatsapp_click" data-track-label="footer">
                <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-gold-300" />
                <span>
                  WhatsApp: {settings.whatsappDisplay}
                  {settings.hours ? <span className="block text-sm text-white/55">{settings.hours}</span> : null}
                </span>
              </a>
            </li>
            {settings.phone ? (
              <li>
                <a href={`tel:+${settings.phone}`} className="flex gap-3 hover:text-white">
                  <Phone className="mt-0.5 size-5 shrink-0 text-gold-300" aria-hidden="true" /> Central: {settings.phoneDisplay}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="flex gap-3 break-all hover:text-white">
                  <Mail className="mt-0.5 size-5 shrink-0 text-gold-300" aria-hidden="true" /> {settings.email}
                </a>
              </li>
            ) : null}
            {a?.street ? (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold-300" aria-hidden="true" />
                <address className="not-italic">
                  {a.street}
                  {a.complement ? `, ${a.complement}` : ''}
                  <br />
                  {a.district} | {a.city} - {a.state} | <span className="whitespace-nowrap">CEP {a.zip}</span>
                </address>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow-light mb-5 font-label">Navegue</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] lg:grid-cols-1">
            {[...NAV_ITEMS, CONTACT_ITEM].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/politica-de-privacidade" className="transition hover:text-gold-200">
                Política de Privacidade
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow-light mb-5 font-label">Promoções</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {PROMOTION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="eyebrow-light mt-8 mb-4 font-label">Cadastre-se</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {SIGNUP_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center gap-6 py-10 sm:flex-row sm:gap-10">
          <h2 className="eyebrow-light font-label">Nossos parceiros</h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-start">
            {PARTNERS.map((p) => {
              const logo = (
                <Image src={p.src} alt={p.name} width={p.width} height={p.height} className="h-10 w-auto sm:h-12" />
              )
              return (
                <li key={p.name}>
                  {p.href ? (
                    <Link href={p.href} className="block opacity-90 transition hover:opacity-100">
                      {logo}
                    </Link>
                  ) : (
                    logo
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 text-sm text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Via Lumina – Viagens de Fé. Todos os direitos reservados.</p>
          <a href={settings.grupoArboUrl ?? '#'} target="_blank" rel="noopener" className="flex items-center gap-3 transition hover:text-white">
            Uma marca do
            <Image src="/assets/logos/grupo-arbo.webp" alt="Grupo Arbo" width={120} height={38} className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
