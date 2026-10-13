import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PageCta } from '@/components/institutional/PageCta'
import { PageHero } from '@/components/layout/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { CRESCER, PROMOTIONS } from '@/content/promocoes'
import { getSiteSettings } from '@/lib/settings.server'
import { whatsappUrl } from '@/lib/whatsapp'

const description =
  'Promoções e parcerias da Via Lumina Viagens: viagem de férias com a Trivva e o 30º Crescer, Encontro Nacional da Família Católica.'

export const metadata: Metadata = {
  title: 'Promoções',
  description,
  alternates: { canonical: '/promocoes' },
  openGraph: {
    title: 'Promoções | Via Lumina Viagens',
    description,
    url: '/promocoes',
    type: 'website',
  },
}

export default async function PromocoesPage() {
  const settings = await getSiteSettings()
  const wa = whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)
  return (
    <>
      <PageHero
        image={{
          src: '/assets/institucional/paisagem-sagrada.webp',
          alt: 'Vista da Cidade Antiga de Jerusalém a partir do Monte das Oliveiras',
          position: 'center 40%',
        }}
        eyebrow="Promoções e parcerias"
        title="Oportunidades para quem caminha com a Via Lumina"
        intro="Além das peregrinações, reunimos aqui as promoções e os eventos que recomendamos aos nossos peregrinos."
        crumbs={[{ label: 'Promoções', href: '/promocoes' }]}
      />
      <section aria-labelledby="promocoes-titulo" className="bg-cream-50 py-20 sm:py-24">
        <div className="container-site">
          <h2 id="promocoes-titulo" className="sr-only">
            Promoções disponíveis
          </h2>
          <ul className="grid gap-8 lg:grid-cols-2">
            <Reveal as="li">
              <Link
                href="/promocoes/trivva"
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-soft ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="relative isolate flex aspect-[3/1] items-end overflow-hidden bg-[linear-gradient(135deg,#041a36_0%,#0a2e5c_55%,#0f4c81_100%)] p-6">
                  <Image
                    src="/assets/logos/raios-via-lumina.webp"
                    alt=""
                    width={636}
                    height={1280}
                    aria-hidden="true"
                    className="absolute -top-10 right-4 -z-10 w-40 opacity-15"
                  />
                  <p className="font-display text-3xl text-white">
                    Via Lumina <span className="text-gold-300">+</span> Trivva
                  </p>
                </div>
                <PromoCardBody {...PROMOTIONS[0]} />
              </Link>
            </Reveal>
            <Reveal as="li" delay={0.08}>
              <Link
                href="/promocoes/crescer"
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-soft ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div
                  className="relative aspect-[3/1] overflow-hidden"
                  style={{ backgroundColor: CRESCER.banner.color }}
                >
                  <Image
                    src={CRESCER.banner.src}
                    alt={CRESCER.bannerAlt}
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover transition duration-[1.2s] group-hover:scale-[1.03]"
                  />
                </div>
                <PromoCardBody {...PROMOTIONS[1]} />
              </Link>
            </Reveal>
          </ul>
        </div>
      </section>
      <PageCta whatsappHref={wa} />
    </>
  )
}

function PromoCardBody({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string
  title: string
  summary: string
}) {
  return (
    <div className="flex flex-1 flex-col p-7">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h3 className="text-[1.5rem] leading-tight font-medium text-navy-900">{title}</h3>
      <p className="mt-3 text-slate-700">{summary}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-label text-sm font-semibold text-navy-900">
        Ver promoção{' '}
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </div>
  )
}
