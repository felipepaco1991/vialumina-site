'use client'
import { CircleCheck, Compass, LoaderCircle, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, type FormEventHandler, type ReactNode } from 'react'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'
import { AnimatePresence, m } from '../motion'

/** Card do formulário: destaque visual com o azul e dourado da marca. */
export function FormCard({ id, eyebrow, title, description, children }: { id: string; eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id="cadastro" aria-labelledby={id} className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#041a36_0%,#0a2e5c_55%,#0d3568_100%)] py-20 sm:py-28">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="text-white lg:sticky lg:top-28">
          <p className="eyebrow-light mb-3">{eyebrow}</p>
          <h2 id={id} className="title-rule text-[2rem] leading-[1.12] font-medium text-white sm:text-[2.6rem]">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">{description}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] bg-white p-5 shadow-deep ring-1 ring-white/20 sm:p-9">{children}</div>
      </div>
    </section>
  )
}

export function StepHeader({ labels, current }: { labels: string[]; current: number }) {
  return (
    <nav aria-label="Etapas do cadastro" className="mb-8">
      <p className="mb-3 font-label text-xs font-bold tracking-[0.18em] text-gold-700 uppercase" aria-live="polite">
        Etapa {current + 1} de {labels.length} · {labels[current]}
      </p>
      <ol className="flex gap-2" aria-hidden="true">
        {labels.map((l, i) => (
          <li key={l} className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-900/10">
            <m.div className="h-full rounded-full bg-gold-500" initial={false} animate={{ width: i <= current ? '100%' : '0%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Container da etapa atual, com transição entre etapas. */
export function StepPanel({ stepKey, direction, children }: { stepKey: number; direction: 1 | -1; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <m.div key={stepKey} initial={{ opacity: 0, x: direction * 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -24 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
        {children}
      </m.div>
    </AnimatePresence>
  )
}

/** Barra de ações do formulário: voltar / continuar / enviar. */
export function FormActions({ step, total, pending, submitLabel, onBack, onNext }: { step: number; total: number; pending: boolean; submitLabel: string; onBack: () => void; onNext: () => void }) {
  const last = step === total - 1
  const btn = 'inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-8 font-label font-semibold tracking-wide transition duration-300 disabled:pointer-events-none disabled:opacity-70'
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      {step > 0 ? (
        <button type="button" onClick={onBack} disabled={pending} className={cn(btn, 'border border-navy-900/20 bg-white text-navy-900 hover:border-navy-900')}>
          <ArrowLeft className="size-5" aria-hidden="true" /> Voltar
        </button>
      ) : (
        <span />
      )}
      {last ? (
        <button type="submit" disabled={pending} className={cn(btn, 'bg-navy-900 text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] hover:-translate-y-0.5 hover:bg-navy-800')}>
          {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
          {pending ? 'Enviando…' : submitLabel}
        </button>
      ) : (
        <button type="button" onClick={onNext} className={cn(btn, 'bg-navy-900 text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] hover:-translate-y-0.5 hover:bg-navy-800')}>
          Continuar <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/** Envio direto (formulário curto, em uma etapa). */
export function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-navy-900 px-8 font-label font-semibold tracking-wide text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-70"
    >
      {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
      {pending ? 'Enviando…' : label}
    </button>
  )
}

/** Mensagem de erro do servidor, acima do botão. */
export function ServerError({ message }: { message: string | null }) {
  return message ? (
    <p role="alert" className="rounded-xl bg-alert/10 px-4 py-3 text-sm font-semibold text-alert">
      {message}
    </p>
  ) : null
}

/** Confirmação visual depois que o servidor recebeu o cadastro. */
export function SuccessPanel({ title, text, whatsappHref }: { title: string; text: string; whatsappHref: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
    ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])
  return (
    <m.div ref={ref} tabIndex={-1} role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="py-6 text-center outline-none sm:py-10">
      <m.div initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }} className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-gold-100 text-gold-700">
        <CircleCheck className="size-11" aria-hidden="true" />
      </m.div>
      <h3 className="font-display text-3xl text-navy-900">{title}</h3>
      <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-slate-700">{text}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/destinos" data-track="click_destinos" data-track-label="sucesso-cadastro" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-navy-900/20 bg-white px-6 font-label text-sm font-semibold text-navy-900 transition hover:border-navy-900">
          <Compass className="size-5" aria-hidden="true" /> Conhecer os destinos
        </Link>
        <a href={whatsappHref} target="_blank" rel="noopener" data-track="click_whatsapp" data-track-label="sucesso-cadastro" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-label text-sm font-semibold text-white transition hover:bg-whatsapp-dark">
          <WhatsAppIcon className="size-5" /> Falar pelo WhatsApp
        </a>
      </div>
    </m.div>
  )
}

export function FormElement({ onSubmit, onFocusCapture, children }: { onSubmit: FormEventHandler<HTMLFormElement>; onFocusCapture: () => void; children: ReactNode }) {
  return (
    <form onSubmit={onSubmit} onFocusCapture={onFocusCapture} onChangeCapture={onFocusCapture} noValidate className="relative space-y-6">
      {children}
    </form>
  )
}
