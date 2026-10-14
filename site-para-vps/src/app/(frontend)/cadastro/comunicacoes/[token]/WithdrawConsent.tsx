'use client'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { withdrawConsent } from '../../actions'

export function WithdrawConsent({ token }: { token: string }) {
  const [pending, start] = useTransition()
  const [state, setState] = useState<'idle' | 'done' | 'already' | 'error'>('idle')

  if (state === 'done' || state === 'already')
    return (
      <div role="status" className="mt-10 rounded-[var(--radius-card)] bg-white p-8 shadow-soft ring-1 ring-navy-900/5">
        <CircleCheck className="size-10 text-whatsapp" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl text-navy-900">{state === 'done' ? 'Consentimento retirado' : 'Nenhuma comunicação promocional ativa'}</h2>
        <p className="mt-2 text-slate-700">
          {state === 'done' ? 'Você não receberá mais comunicações promocionais da Via Lumina. A retirada foi registrada com data e hora.' : 'Este cadastro já não tem consentimento ativo para comunicações promocionais.'}
        </p>
        <Link href="/" className="mt-6 inline-flex font-label text-sm font-bold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-6">
          Voltar ao site
        </Link>
      </div>
    )

  return (
    <div className="mt-10">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await withdrawConsent(token)
            setState(!r.ok ? 'error' : r.alreadyWithdrawn ? 'already' : 'done')
          })
        }
        className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-navy-900 px-8 font-label font-semibold text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] transition hover:-translate-y-0.5 hover:bg-navy-800 disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
        Retirar meu consentimento promocional
      </button>
      {state === 'error' ? (
        <p role="alert" className="mt-4 rounded-xl bg-alert/10 px-4 py-3 text-sm font-semibold text-alert">
          Não foi possível concluir. O link pode estar incorreto ou expirado; escreva para a Via Lumina pelo e-mail da Política de Privacidade.
        </p>
      ) : null}
    </div>
  )
}
