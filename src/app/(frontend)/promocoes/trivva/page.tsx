import type { Metadata } from 'next'
import { Backpack, ExternalLink, Palmtree, Route } from 'lucide-react'
import { LandingMeta } from '@/components/cadastro/LandingMeta'
import { PageCta } from '@/components/institutional/PageCta'
import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { TRIVVA_SIGNUP_URL } from '@/content/promocoes'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

const PATH = '/promocoes/trivva'
const description =
  'Inscreva-se em sua peregrinação e garanta também com a nossa parceira Trivva a sua viagem de férias. Cadastre-se pelo link da Via Lumina.'

export const metadata: Metadata = {
  title: 'Trivva — garanta também a sua viagem de férias',
  description,
  alternates: { canonical: PATH },
  openGraph: {
    title: 'Via Lumina + Trivva | Viagem de férias',
    description,
    url: PATH,
    type: 'website',
  },
}

const STEPS = [
  {
    icon: Route,
    title: 'Escolha sua peregrinação',
    text: 'Conheça os roteiros da Via Lumina e garanta o seu lugar na próxima saída.',
  },
  {
    icon: Backpack,
    title: 'Cadastre-se na Trivva',
    text: 'Pelo link da Via Lumina, você se cadastra na Trivva, nossa parceira em viagens de lazer.',
  },
  {
    icon: Palmtree,
    title: 'Planeje suas férias',
    text: 'Com a assinatura, você acumula diárias para hospedagens, experiências e viagens, no Brasil e no exterior.',
  },
]

export default async function TrivvaPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(
    settings.whatsapp,
    'Olá! Vi a parceria da Via Lumina com a Trivva e gostaria de saber mais.',
  )
  return (
    <>
      <LandingMeta
        event="view_promo_trivva"
        path={PATH}
        name="Via Lumina + Trivva"
        description={description}
      />
      <PageHero
        image={{
          src: '/assets/home/hero-banner-topo.webp',
          alt: 'Muralhas da Cidade Antiga de Jerusalém ao entardecer, com os raios dourados da Via Lumina',
          position: '60% center',
        }}
        eyebrow="Parceria Via Lumina + Trivva"
        title="Sua peregrinação e a sua viagem de férias, juntas"
        intro="Inscreva-se em sua peregrinação e garanta também com a nossa parceira Trivva a sua viagem de férias."
        crumbs={[
          { label: 'Promoções', href: '/promocoes' },
          { label: 'Trivva', href: PATH },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={TRIVVA_SIGNUP_URL}
            variant="gold"
            size="lg"
            iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
            data-track="promo_click"
            data-track-label="trivva-hero-inscricao"
          >
            Inscrever-se na Trivva
          </ButtonLink>
          <ButtonLink href="/destinos" variant="ghost-light" size="lg">
            Ver peregrinações
          </ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="como-funciona" className="bg-white py-20 sm:py-24">
        <div className="container-site">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3">Como funciona</p>
            <h2
              id="como-funciona"
              className="title-rule title-rule-center mx-auto text-[2rem] leading-tight font-medium sm:text-[2.6rem]"
            >
              Três passos para viajar mais
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 0.08}
                className="rounded-[var(--radius-card)] bg-cream-50 p-8 ring-1 ring-navy-900/5"
              >
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <step.icon className="size-6" aria-hidden="true" strokeWidth={1.7} />
                </span>
                <p className="mt-5 font-label text-xs font-bold tracking-[0.18em] text-gold-700 uppercase">
                  Passo {i + 1}
                </p>
                <h3 className="mt-1 text-[1.5rem] leading-tight font-medium text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-slate-700">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="sobre-trivva" className="bg-cream-50 py-20 sm:py-24">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-3">Nossa parceira</p>
            <h2
              id="sobre-trivva"
              className="title-rule text-[2rem] leading-tight font-medium sm:text-[2.6rem]"
            >
              O que é a Trivva
            </h2>
            <div className="mt-7 space-y-4 text-lg leading-relaxed text-slate-700">
              <p>
                A Trivva é um clube de turismo por assinatura: o associado paga uma mensalidade e
                acumula diárias para usar em hospedagens, experiências e viagens, no Brasil ou no
                exterior.
              </p>
              <p>
                Quem se cadastra pela página da Via Lumina conta com uma vantagem exclusiva para
                novos assinantes, informada pela própria Trivva no cadastro.
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            id="inscricao"
            className="scroll-mt-28 rounded-[var(--radius-panel)] bg-[linear-gradient(135deg,#0a2e5c,#0f4c81)] p-8 text-white shadow-deep sm:p-10"
          >
            <p className="eyebrow-light mb-3">Inscrição</p>
            <h2 className="text-[1.8rem] leading-tight font-medium text-white sm:text-[2.1rem]">
              Inscreva-se pelo link da Via Lumina
            </h2>
            <p className="mt-4 text-white/80">
              Você será levado ao site da Trivva para escolher o plano e concluir o cadastro.
            </p>
            <ButtonLink
              href={TRIVVA_SIGNUP_URL}
              variant="gold"
              size="lg"
              className="mt-7 w-full"
              iconAfter={<ExternalLink className="size-5" aria-hidden="true" />}
              data-track="promo_click"
              data-track-label="trivva-formulario-inscricao"
            >
              Inscrever-se na Trivva
            </ButtonLink>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              O cadastro, os planos, os valores e o tratamento dos dados informados no site da
              Trivva são de responsabilidade da Trivva. Condições referenciais, sujeitas à
              confirmação por ela.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="inscreva-peregrinacao" className="bg-white py-16">
        <div className="container-site">
          <Reveal className="flex flex-col items-center justify-between gap-6 rounded-[var(--radius-panel)] bg-cream-50 px-8 py-10 text-center ring-1 ring-navy-900/5 sm:flex-row sm:px-12 sm:text-left">
            <div>
              <h2
                id="inscreva-peregrinacao"
                className="font-display text-[1.7rem] leading-snug text-navy-900"
              >
                Ainda não escolheu a sua peregrinação?
              </h2>
              <p className="mt-1.5 max-w-xl text-slate-700">
                Veja os roteiros disponíveis ou deixe seus dados para receber novidades da Via
                Lumina.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href="/destinos" variant="primary">
                Explorar peregrinações
              </ButtonLink>
              <ButtonLink href="/cadastro/peregrinos?origem=promocao-trivva" variant="outline">
                Quero receber novidades
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <PageCta whatsappHref={wa} />
    </>
  )
}
