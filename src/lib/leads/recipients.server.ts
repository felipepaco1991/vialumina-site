import 'server-only'
import type { SiteSettingsData } from '@/lib/settings.server'
import type { LeadType } from './constants'
import { LEAD_ROUTING } from './routing.server'

/**
 * Destinatários do aviso interno: o que estiver preenchido em Configurações do site → Cadastros
 * (por público) vale como está, sem cópia; senão, o roteamento definido em `routing.server.ts`.
 */
export function leadRecipients(settings: SiteSettingsData, type: LeadType): { to: string[]; cc: string[] } {
  const byType = { PADRE: settings.leadRecipientsPadres, AGENCIA: settings.leadRecipientsAgencias, PEREGRINO: settings.leadRecipientsPeregrinos }[type]
  if (byType?.length) return { to: byType, cc: [] }
  const { to, cc } = LEAD_ROUTING[type]
  return { to, cc }
}
