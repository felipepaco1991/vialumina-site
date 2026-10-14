'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { UserRoundPlus, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { MotionRoot } from '@/components/cadastro/motion'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow: string
  title: string
  description: string
  /** Formulário "Solicite informações". */
  children: ReactNode
  /** Formulário de cadastro de clientes, exibido no painel lateral. */
  signup: ReactNode
}

const option = 'inline-flex min-h-12 items-center justify-center rounded-full px-3 text-center font-label text-sm leading-tight font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:px-5'

/**
 * Escolha entre "fazer uma solicitação" (formulário na própria página) e "cadastre-se" (painel que
 * desliza da direita com o cadastro de clientes).
 */
export function ContactChoice({ eyebrow, title, description, children, signup }: Props) {
  // `?cadastro=1` (menu, rodapé, chamadas das páginas) abre o painel de cadastro.
  const signupRequested = useSearchParams().get('cadastro') === '1'
  const [open, setOpen] = useState(signupRequested)
  const [lastRequested, setLastRequested] = useState(signupRequested)
  if (lastRequested !== signupRequested) {
    setLastRequested(signupRequested)
    setOpen(signupRequested)
  }

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next || !signupRequested) return
    // Remove `cadastro` da URL para que o link "Cadastre-se" possa reabrir o painel.
    const params = new URLSearchParams(window.location.search)
    params.delete('cadastro')
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <div role="group" aria-label="Como podemos ajudar" className="grid grid-cols-2 gap-1.5 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-navy-900/10">
        <button
          type="button"
          aria-pressed={!open}
          onClick={() => document.getElementById('name')?.focus()}
          className={cn(option, !open ? 'bg-navy-900 text-white shadow-[0_8px_20px_rgb(10_46_92/0.2)]' : 'text-navy-900 hover:bg-navy-900/5')}
        >
          Solicitar informações
        </button>
        <Dialog.Trigger
          aria-pressed={open}
          data-track="click_cadastre_se"
          data-track-label="pagina-contato"
          className={cn(option, 'gap-2', open ? 'bg-navy-900 text-white shadow-[0_8px_20px_rgb(10_46_92/0.2)]' : 'text-navy-900 hover:bg-navy-900/5')}
        >
          <UserRoundPlus className="size-4 shrink-0" aria-hidden="true" />
          Cadastre-se
        </Dialog.Trigger>
      </div>

      <div className="mt-8">{children}</div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-navy-950/50 backdrop-blur-sm data-[state=closed]:animate-[fade-out_0.3s_ease_both] data-[state=open]:animate-[fade-in_0.3s_ease_both]" />
        <Dialog.Content
          id="cadastro"
          aria-describedby="cadastro-descricao"
          className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[600px] flex-col bg-cream-50 shadow-deep data-[state=closed]:animate-[slide-out-right_0.35s_var(--ease-out-soft)_both] data-[state=open]:animate-[slide-in-right_0.4s_var(--ease-out-soft)_both]"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-navy-900/10 px-5 py-5 sm:px-8">
            <div>
              <p className="eyebrow mb-1.5">{eyebrow}</p>
              <Dialog.Title className="font-display text-[1.6rem] leading-tight font-medium text-navy-900 sm:text-[1.85rem]">{title}</Dialog.Title>
            </div>
            <Dialog.Close className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-navy-900 hover:bg-navy-900/5" aria-label="Fechar cadastro">
              <X className="size-6" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
            <Dialog.Description id="cadastro-descricao" className="mb-7 leading-relaxed text-slate-700">
              {description}
            </Dialog.Description>
            <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-soft ring-1 ring-navy-900/5 sm:p-7">
              <MotionRoot>{signup}</MotionRoot>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
