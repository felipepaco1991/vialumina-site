import type { Metadata } from 'next'
import { LandingHero } from '@/components/cadastro/LandingHero'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { WhatsAppStrip } from '@/components/cadastro/Extras'
import { Faq } from '@/components/cadastro/Faq'
import { LeaderForm } from '@/components/cadastro/form/LeaderForm'
import { FormCard } from '@/components/cadastro/form/FormShell'
import { AboutBlock, BenefitCards, Timeline } from '@/components/cadastro/Sections'
import { LEADER_PAGE as P } from '@/content/cadastro'
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

export default async function FormadoresPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(leadWhatsapp('FORMADOR', settings.whatsapp), 'Olá! Tenho condições de reunir um grupo de peregrinos e gostaria de conversar com a Via Lumina Viagens.')
  return (
    <>
      <LandingMeta event="view_lp_formadores" path={P.path} name={P.meta.title} description={P.meta.description} />
      <LandingHero
        variant="formadores"
        imageKey="formadores"
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        text={P.hero.text}
        cta={P.hero.cta}
        crumbs={[{ label: 'Cadastro', href: '/cadastro' }, { label: P.crumb, href: P.path }]}
        trust={['Mais de 40 anos de trajetória no turismo', 'Guia espiritual em todas as viagens', 'Peregrinações no Brasil e no exterior']}
      />
      <AboutBlock id="formadores-sobre" eyebrow="Uma liderança que reúne pessoas" title={P.about.title} paragraphs={P.about.paragraphs} />
      <BenefitCards id="formadores-beneficios" eyebrow="Como a Via Lumina caminha com você" title={P.benefits.title} items={P.benefits.items} />
      <Timeline id="formadores-passos" eyebrow="Como funciona?" title={P.steps.title} items={P.steps.items} />
      <FormCard id="formadores-formulario" eyebrow="Cadastro para formadores" title={P.form.title} description={P.form.description}>
        <LeaderForm whatsappHref={wa} />
      </FormCard>
      <Faq id="agencias-faq" title={P.faq.title} items={P.faq.items} />
      <WhatsAppStrip href={wa} text="Prefere conversar antes de se cadastrar? Fale com nossa equipe." />
    </>
  )
}
