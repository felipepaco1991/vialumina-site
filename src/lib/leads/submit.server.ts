import 'server-only'
import { randomBytes } from 'crypto'
import { commitTransaction, createLocalReq, initTransaction, killTransaction } from 'payload'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/settings.server'
import { SITE_URL } from '@/lib/site-url'
import { AGENCY_INTERESTS, AGENCY_PROFILES, LEADER_REACH, LEADER_ROLES, PRIEST_INTERESTS, PRIVACY_NOTICE_VERSION, SOURCE_BY_TYPE, destinationLabel, periodLabel, type LeadType } from './constants'
import { dispatchLeadEvent } from './integrations.server'
import { normalizeInstagram, normalizeUrl, onlyDigits, toStoredPhone } from './masks'
import { sendConfirmation, sendInternalNotification, smtpConfigured } from './notify.server'
import { rateLimited } from './rate-limit'
import { leadRecipients } from './recipients.server'
import { agencySchema, leaderSchema, pilgrimSchema, priestSchema, type LeadResult } from './schemas'
import { verifyTurnstile } from './turnstile.server'
import { sanitizeUtm } from './utm'

const MIN_FILL_MS = 3000
/** Reenvio idêntico (mesmo perfil e e-mail) dentro desta janela é tratado como duplo clique e não cria novo registro. */
const DOUBLE_SUBMIT_MS = 10 * 60 * 1000
const IP_LIMIT = { windowMs: 10 * 60 * 1000, max: 6 }
const EMAIL_LIMIT = { windowMs: 60 * 60 * 1000, max: 4 }

export type SubmitContext = { ip: string; now?: number }

const labelOf = (list: readonly { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v

const SCHEMAS = { PADRE: priestSchema, AGENCIA: agencySchema, FORMADOR: leaderSchema, PEREGRINO: pilgrimSchema } as const

type Normalized = {
  name: string
  email: string
  phone: string
  city: string
  state: string
  destinations: string[]
  profileCollection: 'priest-profiles' | 'agency-profiles' | 'leader-profiles' | 'pilgrim-profiles'
  profileField: 'priestProfile' | 'agencyProfile' | 'leaderProfile' | 'pilgrimProfile'
  profile: Record<string, unknown>
  summary: [string, string][]
  common: { sourcePage: string; entryPoint: string; utm: Record<string, string>; consentMarketing: boolean }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize(type: LeadType, d: any): Normalized {
  const phone = toStoredPhone(d.whatsapp)!
  const common = { sourcePage: d.sourcePage, entryPoint: d.entryPoint, utm: sanitizeUtm(d.utm) as Record<string, string>, consentMarketing: Boolean(d.consentMarketing) }
  const dests = (d.destinations as string[]).map(destinationLabel).join('; ')

  if (type === 'PADRE') {
    return {
      name: d.fullName, email: d.email, phone, city: d.city, state: d.state, destinations: d.destinations, common,
      profileCollection: 'priest-profiles', profileField: 'priestProfile',
      profile: {
        displayName: d.displayName || undefined, diocese: d.diocese, parish: d.parish, ministry: d.ministry, mainInterest: d.mainInterest,
        hasOrganized: d.hasOrganized || undefined, groupSize: d.groupSize || undefined, destinations: d.destinations, travelPeriod: d.travelPeriod || undefined, message: d.message || undefined,
      },
      summary: [['Diocese', d.diocese], ['Paróquia/comunidade', d.parish], ['Função', d.ministry], ['Interesse', labelOf(PRIEST_INTERESTS, d.mainInterest)], ['Destinos', dests || '-'], ['Período', d.travelPeriod ? periodLabel(d.travelPeriod) : '-']],
    }
  }
  if (type === 'AGENCIA') {
    return {
      name: d.contactName, email: d.email, phone, city: d.city, state: d.state, destinations: d.destinations, common,
      profileCollection: 'agency-profiles', profileField: 'agencyProfile',
      profile: {
        legalName: d.legalName, tradeName: d.tradeName, cnpj: onlyDigits(d.cnpj) || undefined, contactRole: d.contactRole, profile: d.profile, interest: d.interest,
        cadastur: d.cadastur || undefined, website: d.website ? normalizeUrl(d.website) : undefined, instagram: d.instagram ? normalizeInstagram(d.instagram) : undefined,
        tenure: d.tenure || undefined, worksWithReligious: d.worksWithReligious || undefined, volume: d.volume || undefined, destinations: d.destinations, message: d.message || undefined,
      },
      summary: [['Razão social', d.legalName], ['Nome fantasia', d.tradeName], ['CNPJ', d.cnpj || '-'], ['Cargo', d.contactRole], ['Perfil', labelOf(AGENCY_PROFILES, d.profile)], ['Interesse', labelOf(AGENCY_INTERESTS, d.interest)], ['Cadastur', d.cadastur || '-'], ['Destinos', dests || '-']],
    }
  }
  if (type === 'FORMADOR') {
    return {
      name: d.fullName, email: d.email, phone, city: d.city, state: d.state, destinations: d.destinations, common,
      profileCollection: 'leader-profiles', profileField: 'leaderProfile',
      profile: {
        community: d.community, role: d.role, roleDetail: d.roleDetail || undefined, instagram: d.instagram ? normalizeInstagram(d.instagram) : undefined,
        reach: d.reach || undefined, hasOrganized: d.hasOrganized || undefined, hasSpiritualGuide: d.hasSpiritualGuide || undefined,
        groupSize: d.groupSize || undefined, destinations: d.destinations, travelPeriod: d.travelPeriod || undefined, message: d.message || undefined,
      },
      summary: [['Comunidade/movimento', d.community], ['Atuação', labelOf(LEADER_ROLES, d.role)], ['Alcance', d.reach ? labelOf(LEADER_REACH, d.reach) : '-'], ['Instagram', d.instagram || '-'], ['Destinos', dests || '-'], ['Período', d.travelPeriod ? periodLabel(d.travelPeriod) : '-']],
    }
  }
  return {
    name: d.fullName, email: d.email, phone, city: d.city, state: d.state, destinations: d.destinations, common,
    profileCollection: 'pilgrim-profiles', profileField: 'pilgrimProfile',
    profile: {
      destinations: d.destinations, travelPeriod: d.travelPeriod, boardingCity: d.boardingCity || undefined, partySize: d.partySize || undefined,
      previousPilgrimage: d.previousPilgrimage || undefined, groupWithCommunity: d.groupWithCommunity || undefined, message: d.message || undefined,
    },
    summary: [['Destinos', dests], ['Quando pretende viajar', periodLabel(d.travelPeriod)], ['Embarque', d.boardingCity || '-'], ['Pessoas', d.partySize || '-']],
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Recebe um cadastro: valida, aplica antispam, grava (lead + perfil, em transação), registra consentimentos
 * e só então notifica. O retorno `ok: true` significa que o servidor persistiu o cadastro.
 */
export async function submitLead(type: LeadType, input: unknown, ctx: SubmitContext): Promise<LeadResult> {
  const parsed = SCHEMAS[type].safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    // Honeypot preenchido: sucesso silencioso para não orientar robôs.
    if (fieldErrors.website) return { ok: true }
    return { ok: false, error: 'Revise os campos destacados.', fieldErrors }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = parsed.data as Record<string, any>
  const now = ctx.now ?? Date.now()

  if (now - data.startedAt < MIN_FILL_MS) return { ok: false, error: 'Não foi possível enviar agora. Aguarde alguns segundos e tente novamente.' }
  if (rateLimited(`lead:ip:${ctx.ip}`, IP_LIMIT) || rateLimited(`lead:email:${data.email}`, EMAIL_LIMIT)) {
    return { ok: false, error: 'Recebemos muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente ou fale conosco pelo WhatsApp.' }
  }
  if (!(await verifyTurnstile(String(data.turnstileToken ?? ''), ctx.ip))) {
    return { ok: false, error: 'Não conseguimos confirmar que você não é um robô. Recarregue a verificação e tente novamente.' }
  }

  const payload = await getPayloadClient()
  const n = normalize(type, data)

  // Duplicidade: mesmo perfil com o mesmo e-mail ou WhatsApp.
  const sameContact: Where = { and: [{ type: { equals: type } }, { or: [{ emailKey: { equals: n.email } }, { phone: { equals: n.phone } }] }] }
  const existing = await payload.find({ collection: 'leads', where: sameContact, sort: 'createdAt', limit: 1, depth: 0, overrideAccess: true, pagination: false })
  const first = existing.docs[0]
  if (first) {
    const recent = await payload.count({
      collection: 'leads',
      overrideAccess: true,
      where: { and: [{ type: { equals: type } }, { emailKey: { equals: n.email } }, { createdAt: { greater_than: new Date(now - DOUBLE_SUBMIT_MS).toISOString() } }] },
    })
    // Duplo clique / reenvio imediato: confirma sem criar outro registro.
    if (recent.totalDocs > 0) return { ok: true }
  }

  const settings = await getSiteSettings()
  const months = settings.leadRetentionMonths ?? 24
  const retainUntil = new Date(now)
  retainUntil.setMonth(retainUntil.getMonth() + months)
  const nowIso = new Date(now).toISOString()
  const consents = [
    { purpose: 'cadastro-contato' as const, granted: true, grantedAt: nowIso, noticeVersion: PRIVACY_NOTICE_VERSION },
    ...(n.common.consentMarketing ? [{ purpose: 'comunicacoes' as const, granted: true, grantedAt: nowIso, noticeVersion: PRIVACY_NOTICE_VERSION }] : []),
  ]

  const req = await createLocalReq({}, payload)
  const started = await initTransaction(req)
  let leadId: number
  try {
    const lead = await payload.create({
      collection: 'leads',
      req,
      overrideAccess: true,
      data: {
        type,
        name: n.name,
        email: n.email,
        emailKey: n.email,
        phone: n.phone,
        city: n.city,
        state: n.state as never,
        destinations: n.destinations as never,
        status: 'novo',
        partnershipStatus: type === 'PEREGRINO' ? 'nao-se-aplica' : 'pendente',
        source: SOURCE_BY_TYPE[type],
        entryPoint: n.common.entryPoint || undefined,
        sourcePage: n.common.sourcePage || undefined,
        utm: {
          source: n.common.utm.utm_source, medium: n.common.utm.utm_medium, campaign: n.common.utm.utm_campaign, term: n.common.utm.utm_term, content: n.common.utm.utm_content,
        },
        consents,
        marketingConsent: n.common.consentMarketing,
        retainUntil: retainUntil.toISOString(),
        unsubscribeToken: randomBytes(24).toString('base64url'),
        possibleDuplicate: Boolean(first),
        duplicateOf: first?.id,
      },
    })
    leadId = lead.id
    const profile = await payload.create({ collection: n.profileCollection, req, overrideAccess: true, data: { lead: lead.id, ...n.profile } as never })
    await payload.update({ collection: 'leads', id: lead.id, req, overrideAccess: true, data: { [n.profileField]: profile.id } as never })
    if (started) await commitTransaction(req)
  } catch (err) {
    if (started) await killTransaction(req)
    payload.logger.error(`Falha ao gravar cadastro ${type}: ${err instanceof Error ? err.message : 'erro desconhecido'}`)
    return { ok: false, error: 'Não foi possível registrar seu cadastro agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.' }
  }

  payload.logger.info(`Cadastro ${type} ${leadId} recebido (origem ${SOURCE_BY_TYPE[type]}).`)

  // Notificações e integrações: o cadastro já está salvo; falhas aqui apenas ficam registradas.
  const updates: Record<string, unknown> = {}
  const { to, cc } = leadRecipients(settings, type)
  if (smtpConfigured() && to.length) {
    try {
      await sendInternalNotification({
        to, cc, type, leadId, name: n.name, replyTo: n.email, duplicate: Boolean(first),
        rows: [['Nome', n.name], ['E-mail', n.email], ['WhatsApp', n.phone], ['Cidade/UF', `${n.city}/${n.state}`], ...n.summary, ['Origem', `${SOURCE_BY_TYPE[type]}${n.common.utm.utm_campaign ? ` · ${n.common.utm.utm_campaign}` : ''}`]],
      })
      updates.notificationStatus = 'enviado'
    } catch (err) {
      updates.notificationStatus = 'falhou'
      updates.deliveryError = (err instanceof Error ? err.message : String(err)).slice(0, 250)
      payload.logger.error(`Falha no aviso interno do cadastro ${leadId}.`)
    }
  } else payload.logger.warn(`Cadastro ${leadId} salvo, mas o aviso por e-mail não está configurado (SMTP_HOST e destinatários).`)

  if (settings.leadConfirmationEmail && smtpConfigured()) {
    try {
      const token = (await payload.findByID({ collection: 'leads', id: leadId, depth: 0, overrideAccess: true, select: { unsubscribeToken: true } })).unsubscribeToken
      await sendConfirmation({ to: n.email, name: n.name, type, unsubscribeUrl: n.common.consentMarketing && token ? `${SITE_URL}/cadastro/comunicacoes/${token}` : undefined })
      updates.confirmationStatus = 'enviada'
    } catch {
      updates.confirmationStatus = 'falhou'
    }
  }
  if (Object.keys(updates).length) await payload.update({ collection: 'leads', id: leadId, overrideAccess: true, data: updates as never }).catch(() => undefined)

  await dispatchLeadEvent(
    {
      event: 'lead.created',
      occurredAt: nowIso,
      lead: {
        id: leadId, type, name: n.name, email: n.email, phone: n.phone, city: n.city, state: n.state,
        source: SOURCE_BY_TYPE[type], entryPoint: n.common.entryPoint, utm: n.common.utm, destinations: n.destinations,
        marketingConsent: n.common.consentMarketing, possibleDuplicate: Boolean(first),
      },
      profile: n.profile,
    },
    (msg) => payload.logger.warn(msg),
  )

  return { ok: true }
}

/** Retirada do consentimento promocional pelo titular (link com token secreto). Mantém o cadastro de contato. */
export async function withdrawMarketingConsent(token: string, ctx: { ip: string }): Promise<{ ok: boolean; alreadyWithdrawn?: boolean }> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token) || rateLimited(`unsub:${ctx.ip}`, { windowMs: 10 * 60 * 1000, max: 20 })) return { ok: false }
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'leads', where: { unsubscribeToken: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })
  const lead = docs[0]
  if (!lead) return { ok: false }
  const active = (lead.consents ?? []).some((c) => c.purpose === 'comunicacoes' && c.granted && !c.withdrawnAt)
  if (!active) return { ok: true, alreadyWithdrawn: true }
  const now = new Date().toISOString()
  await payload.update({
    collection: 'leads',
    id: lead.id,
    overrideAccess: true,
    data: { consents: (lead.consents ?? []).map((c) => (c.purpose === 'comunicacoes' && c.granted && !c.withdrawnAt ? { ...c, withdrawnAt: now } : c)) },
  })
  return { ok: true }
}
