import { revalidatePath } from 'next/cache'

/**
 * Revalida todas as páginas públicas após alterações no CMS.
 * O volume de conteúdo é pequeno, então invalidar o layout raiz é simples e seguro.
 * Fora do runtime do Next (ex.: script de seed) a chamada não se aplica e é ignorada.
 */
export const revalidateSite = ({ req }: { req: { context?: Record<string, unknown> } }) => {
  if (req.context?.disableRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Executado fora de uma requisição do Next.js.
  }
}
