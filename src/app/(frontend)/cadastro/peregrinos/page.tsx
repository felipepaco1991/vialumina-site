import type { Metadata } from 'next'
import { LandingHero } from '@/components/cadastro/LandingHero'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { CommunityInvite, FinalCtaDestinations } from '@/components/cadastro/Extras'
import { PilgrimForm } from '@/components/cadastro/form/PilgrimForm'
import { FormCard } from '@/components/cadastro/form/FormShell'
import { AboutBlock, CareList, DestinationCards } from '@/components/cadastro/Sections'
import { HERO } from '@/content/institutional'
import { PILGRIM_PAGE as P } from '@/content/cadastro'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const revalidate = 3600

export const metadata: Metadata = {
  title: P.meta.title,
  description: P.meta.description,
  alternates: { canonical: P.path },
  openGraph: { title: `${P.meta.title} | Via Lumina Viagens`, description: P.meta.description, url: P.path, type: 'website' },
}

export default async function PeregrinosPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, 'Olá! Gostaria de receber informações sobre as peregrinações da Via Lumina Viagens.')
  const community = settings.communityUrl || undefined
  return (
    <>
      <LandingMeta event="view_lp_peregrinos" path={P.path} name={P.meta.title} description={P.meta.description} />
      <LandingHero
        variant="peregrinos"
        imageKey="peregrinos"
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        text={P.hero.text}
        cta={P.hero.cta}
        crumbs={[{ label: 'Cadastro', href: '/cadastro' }, { label: P.crumb, href: P.path }]}
        trust={HERO.badges}
      />
      <AboutBlock id="peregrinos-sobre" eyebrow="Viajar também pode ser uma experiência de fé" title={P.about.title} paragraphs={P.about.paragraphs} />
      <DestinationCards id="peregrinos-destinos" eyebrow="Descubra onde sua fé pode te levar" title={P.destinations.title} items={P.destinations.items} />
      <CareList id="peregrinos-cuidado" eyebrow="Por que viajar com a Via Lumina?" title={P.care.title} keys={P.care.items} />
      <FormCard id="peregrinos-formulario" eyebrow="Cadastro de clientes" title={P.form.title} description={P.form.description}>
        <PilgrimForm whatsappHref={wa} communityHref={community} />
      </FormCard>
      {community ? <CommunityInvite href={community} {...P.community} /> : null}
      <FinalCtaDestinations title={P.finalCta.title} text={P.finalCta.text} cta={P.finalCta.cta} />
    </>
  )
}
