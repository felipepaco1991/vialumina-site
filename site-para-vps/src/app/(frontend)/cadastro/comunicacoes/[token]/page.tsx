import type { Metadata } from 'next'
import { WithdrawConsent } from './WithdrawConsent'

export const metadata: Metadata = {
  title: 'Preferências de comunicação',
  description: 'Retire seu consentimento para receber comunicações promocionais da Via Lumina Viagens.',
  robots: { index: false, follow: false },
}

export default async function ConsentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return (
    <section className="bg-cream-50 pt-36 pb-24">
      <div className="container-site max-w-2xl">
        <p className="eyebrow mb-3">Privacidade</p>
        <h1 className="title-rule text-[2.2rem] leading-tight font-medium sm:text-5xl">Preferências de comunicação</h1>
        <p className="mt-6 text-lg text-slate-700">
          Aqui você pode retirar o consentimento para receber novidades e comunicações promocionais da Via Lumina Viagens. Seu cadastro de contato é mantido para o atendimento já solicitado. Para acessar, corrigir ou excluir seus dados, escreva para o e-mail indicado na Política de Privacidade.
        </p>
        <WithdrawConsent token={token} />
      </div>
    </section>
  )
}
