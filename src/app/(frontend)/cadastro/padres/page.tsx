import type { Metadata } from 'next'
import { LandingHero } from '@/components/cadastro/LandingHero'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { WhatsAppStrip } from '@/components/cadastro/Extras'
import { Faq } from '@/components/cadastro/Faq'
import { PriestForm } from '@/components/cadastro/form/PriestForm'
import { FormCard } from '@/components/cadastro/form/FormShell'
import { AboutBlock, BenefitCards, Timeline } from '@/components/cadastro/Sections'
import { PRIEST_PAGE as P } from '@/content/cadastro'
import { leadWhatsapp } from '@/lib/leads/routing.server'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const revalidate = 3600

export const metadata: Metadata = {
  title: P.meta.title,
  description: P.meta.description,
  alternates: { canonical: P.path },
  openGraph: { title: `${P.meta.title} | Via Lumina Viagens`, description: P.meta.description, url: P.path, type: 'website' },
}

export default async function PadresPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(leadWhatsapp('PADRE', settings.whatsapp), 'Olá! Sou sacerdote e gostaria de conhecer as possibilidades de parceria com a Via Lumina Viagens.')
  return (
    <>
      <LandingMeta event="view_lp_padres" path={P.path} name={P.meta.title} description={P.meta.description} />
      <LandingHero
        variant="padres"
        imageKey="padres"
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        text={P.hero.text}
        cta={P.hero.cta}
        crumbs={[{ label: 'Cadastro', href: '/cadastro' }, { label: P.crumb, href: P.path }]}
        trust={['Mais de 40 anos de trajetória no turismo', 'Guia espiritual em todas as viagens']}
      />
      <AboutBlock id="padres-sobre" eyebrow="Mais do que uma viagem" title={P.about.title} paragraphs={P.about.paragraphs} />
      <BenefitCards id="padres-beneficios" eyebrow="Por que conhecer a Via Lumina?" title={P.benefits.title} items={P.benefits.items} />
      <Timeline id="padres-passos" eyebrow="Como funciona a parceria?" title={P.steps.title} items={P.steps.items} />
      <FormCard id="padres-formulario" eyebrow="Cadastro para padres" title={P.form.title} description={P.form.description}>
        <PriestForm whatsappHref={wa} />
      </FormCard>
      <Faq id="padres-faq" title={P.faq.title} items={P.faq.items} />
      <WhatsAppStrip href={wa} text="Prefere conversar antes de se cadastrar? Fale com nossa equipe." />
    </>
  )
}
