import 'server-only'
import type { SiteSettingsData } from '@/lib/settings.server'
import type { LeadType } from './constants'

const split = (v: string | undefined) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean)

/** Destinatários da notificação interna: por perfil → gerais → LEAD_RECIPIENTS → CONTACT_RECIPIENTS. */
export function leadRecipients(settings: SiteSettingsData, type: LeadType): string[] {
  const byType = { PADRE: settings.leadRecipientsPadres, AGENCIA: settings.leadRecipientsAgencias, PEREGRINO: settings.leadRecipientsPeregrinos }[type]
  return (
    (byType?.length ? byType : null) ??
    (settings.leadRecipients?.length ? settings.leadRecipients : null) ??
    (split(process.env.LEAD_RECIPIENTS).length ? split(process.env.LEAD_RECIPIENTS) : null) ??
    (settings.contactRecipients?.length ? settings.contactRecipients : null) ??
    split(process.env.CONTACT_RECIPIENTS)
  )
}
