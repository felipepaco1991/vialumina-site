import { AboutSection } from '@/components/home/AboutSection'
import { Differentials } from '@/components/home/Differentials'
import { FeaturedTrips } from '@/components/home/FeaturedTrips'
import { FinalCta } from '@/components/home/FinalCta'
import { HistorySection } from '@/components/home/HistorySection'
import { HomeHero } from '@/components/home/HomeHero'
import { InstagramSection } from '@/components/home/InstagramSection'
import { NewsletterInvite } from '@/components/institutional/SignupInvites'
import { ValuesSection } from '@/components/home/ValuesSection'
import { getSiteSettings } from '@/lib/settings.server'
import { getFeaturedTrips, getListedTrips } from '@/lib/trips.server'
import { whatsappUrl } from '@/lib/whatsapp'

export const revalidate = 3600

export const metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  const [settings, featured, all] = await Promise.all([getSiteSettings(), getFeaturedTrips(4), getListedTrips()])
  const wa = whatsappUrl(settings.whatsapp, settings.defaultWhatsappMessage ?? undefined)
  const pdfWa = whatsappUrl(settings.whatsapp, 'Olá! Gostaria de receber o roteiro em PDF de uma peregrinação da Via Lumina.')
  return (
    <>
      <HomeHero whatsappHref={wa} />
      <Differentials />
      <FeaturedTrips trips={featured} total={all.length} />
      <NewsletterInvite />
      <AboutSection />
      <HistorySection />
      <ValuesSection />
      <InstagramSection />
      <FinalCta whatsappHref={wa} pdfWhatsappHref={pdfWa} />
    </>
  )
}
