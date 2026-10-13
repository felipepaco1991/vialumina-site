import { Compass, Globe, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Links oficiais da Via Lumina Viagens: site, WhatsApp, comunidade, roteiros e redes sociais.',
  alternates: { canonical: '/links' },
}

/** Página de links da bio do Instagram (preserva a URL /links/ do site anterior). */
export default async function LinksPage() {
  const s = await getSiteSettings()
  const links = [
    { href: '/', label: 'Site', icon: Globe },
    { href: whatsappUrl(s.whatsapp, 'Olá, acessei a página de links e gostaria de falar com a Via Lumina!'), label: 'WhatsApp', icon: WhatsAppIcon, track: true },
    ...(s.communityUrl ? [{ href: s.communityUrl, label: 'Comunidade Via Lumina', icon: Users }] : []),
    { href: '/destinos', label: 'Conheça nossos Roteiros', icon: Compass },
    ...(s.instagramUrl ? [{ href: s.instagramUrl, label: 'Instagram', icon: InstagramIcon }] : []),
    ...(s.facebookUrl ? [{ href: s.facebookUrl, label: 'Facebook', icon: FacebookIcon }] : []),
    ...(s.grupoArboUrl ? [{ href: s.grupoArboUrl, label: 'Grupo Arbo', icon: Globe }] : []),
    ...(s.garupaUrl ? [{ href: s.garupaUrl, label: 'Apoiamos a Garupa', icon: Globe }] : []),
  ]
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-[linear-gradient(160deg,#041a36,#0a2e5c_50%,#0f4c81)] px-4 pt-32 pb-20 text-white">
      <Image src="/assets/logos/raios-via-lumina.webp" alt="" width={636} height={1280} className="absolute -top-10 -left-32 -z-10 w-[380px] opacity-10" aria-hidden="true" />
      <div className="mx-auto max-w-md text-center">
        <Image src="/assets/logos/via-lumina-logo-branco.webp" alt="Via Lumina — viagens de fé" width={260} height={107} className="mx-auto h-auto w-56" loading="eager" />
        <h1 className="mt-6 font-display text-2xl text-white">Caminhos de Fé, Experiência e Propósito com Deus.</h1>
        <ul className="mt-10 space-y-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                {...('track' in l ? { 'data-track': 'whatsapp_click', 'data-track-label': 'links' } : {})}
                className="flex min-h-14 items-center gap-4 rounded-full border border-white/20 bg-white/10 px-6 font-label font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-navy-900"
              >
                <l.icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-center">{l.label}</span>
                <span className="w-5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
