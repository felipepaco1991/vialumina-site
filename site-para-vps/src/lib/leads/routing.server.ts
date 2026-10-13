import 'server-only'
import type { LeadType } from './constants'

/**
 * Para onde vai cada público (definido pela cliente): quem recebe o aviso interno do cadastro,
 * quem fica em cópia e qual WhatsApp aparece nos botões das páginas de cadastro.
 *
 * - Padres e agências: comercial (Williton), com cópia para a Fabíola.
 * - Clientes finais (peregrinos): Fabíola, sem cópia — respostas e controle de dados ficam com ela.
 */
type Routing = { to: string[]; cc: string[]; whatsapp?: string }

const COMERCIAL = 'williton.santos@vialuminaviagens.com.br'
const FABIOLA = 'fabiola.almeida@vialuminaviagens.com.br'

export const LEAD_ROUTING: Record<LeadType, Routing> = {
  PADRE: { to: [COMERCIAL], cc: [FABIOLA], whatsapp: '5511917992727' },
  AGENCIA: { to: [COMERCIAL], cc: [FABIOLA], whatsapp: '5511917992727' },
  // Sem número próprio: usa o WhatsApp do site (Configurações do site → Contato), hoje o da Fabíola (+55 11 99252-6053).
  PEREGRINO: { to: [FABIOLA], cc: [] },
}

/** WhatsApp (55 + DDD + número) dos botões das páginas de cadastro do público. */
export const leadWhatsapp = (type: LeadType, siteWhatsapp: string) => LEAD_ROUTING[type].whatsapp ?? siteWhatsapp
