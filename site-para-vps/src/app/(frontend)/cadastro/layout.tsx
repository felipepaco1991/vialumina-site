import type { ReactNode } from 'react'
import { MotionRoot } from '@/components/cadastro/motion'

/** Provedor de animações (Motion) compartilhado pelas páginas de cadastro. */
export default function CadastroLayout({ children }: { children: ReactNode }) {
  return (
    <MotionRoot>
      {/* Sem JavaScript, as revelações animadas não podem manter o conteúdo oculto. */}
      <noscript>
        <style>{'[data-m-reveal]{opacity:1!important;transform:none!important}'}</style>
      </noscript>
      {children}
    </MotionRoot>
  )
}
