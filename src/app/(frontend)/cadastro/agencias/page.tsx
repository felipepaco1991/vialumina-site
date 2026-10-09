import type { Metadata } from 'next'
import { LandingHero } from '@/components/cadastro/LandingHero'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { WhatsAppStrip } from '@/components/cadastro/Extras'
import { Faq } from '@/components/cadastro/Faq'
import { AgencyForm } from '@/components/cadastro/form/AgencyForm'
import { FormCard } from '@/components/cadastro/form/FormShell'
import { AboutBlock, BenefitCards, Timeline } from '@/components/cadastro/Sections'
import { AGENCY_PAGE as P } from '@/content/cadastro'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const revalidate = 3600

export const metadata: Metadata = {
  title: P.meta.title,
  description: P.meta.description,
  alternates: { canonical: P.path },
  openGraph: { title: `${P.meta.title} | Via Lumina Viagens`, description: P.meta.description, url: P.path, type: 'website' },
}

export default async function AgenciasPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, 'Olá! Represento uma agência de turismo e gostaria de conhecer as oportunidades de parceria com a Via Lumina Viagens.')
  return (
    <>
      <LandingMeta event="view_lp_agencias" path={P.path} name={P.meta.title} description={P.meta.description} />
      <LandingHero
        imageKey="agencias"
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        text={P.hero.text}
        cta={P.hero.cta}
        crumbs={[{ label: 'Cadastro', href: '/cadastro' }, { label: P.crumb, href: P.path }]}
        trust={['Mais de 40 anos de trajetória no turismo', 'Peregrinações no Brasil e no exterior']}
      />
      <AboutBlock id="agencias-sobre" eyebrow="Uma nova oportunidade para sua agência" title={P.about.title} paragraphs={P.about.paragraphs} />
      <BenefitCards id="agencias-estrutura" eyebrow="Conheça nossa estrutura" title={P.benefits.title} items={P.benefits.items} />
      <BenefitCards id="agencias-perfis" eyebrow="Para quem é esta parceria?" title={P.audience.title} items={P.audience.items} tone="white" columns={3} />
      <Timeline id="agencias-passos" eyebrow="Como começar?" title={P.steps.title} items={P.steps.items} />
      <FormCard id="agencias-formulario" eyebrow="Cadastro para agências" title={P.form.title} description={P.form.description}>
        <AgencyForm whatsappHref={wa} />
      </FormCard>
      <Faq id="agencias-faq" title={P.faq.title} items={P.faq.items} />
      <WhatsAppStrip href={wa} text="Quer falar com a equipe comercial antes de cadastrar a agência?" />
    </>
  )
}
