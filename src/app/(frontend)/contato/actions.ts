'use server'
import { headers } from 'next/headers'
import nodemailer from 'nodemailer'
import { contactSchema, type ContactInput, type ContactResult } from '@/lib/contact-schema'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/settings.server'

const MIN_FILL_MS = 3000
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > MAX_PER_WINDOW
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function submitInquiry(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    // O honeypot preenchido é tratado como sucesso silencioso para não orientar robôs.
    if (fieldErrors.website) return { ok: true, delivered: false }
    return { ok: false, error: 'Revise os campos destacados.', fieldErrors }
  }
  const data = parsed.data
  if (Date.now() - data.startedAt < MIN_FILL_MS) return { ok: false, error: 'Não foi possível enviar. Aguarde alguns segundos e tente novamente.' }

  const h = await headers()
  const ip = (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'local').trim()
  if (rateLimited(ip)) return { ok: false, error: 'Muitas mensagens em pouco tempo. Tente novamente em alguns minutos ou fale pelo WhatsApp.' }

  const payload = await getPayloadClient()
  const settings = await getSiteSettings()

  let tripId: number | undefined
  let tripTitle = 'Não informado'
  if (data.trip && data.trip !== 'outro') {
    const { docs } = await payload.find({ collection: 'trips', where: { slug: { equals: data.trip } }, limit: 1, depth: 0, overrideAccess: false })
    if (docs[0]) {
      tripId = docs[0].id
      tripTitle = `${docs[0].title}${docs[0].periodTag ? ` (${docs[0].periodTag})` : ''}`
    }
  } else if (data.trip === 'outro') tripTitle = 'Outro / ainda não decidi'

  const inquiry = await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      trip: tripId,
      tripTitle,
      message: data.message,
      consent: true,
      consentAt: new Date().toISOString(),
      sourcePage: data.sourcePage,
      status: 'novo',
      emailDelivery: 'pendente',
    },
  })

  // Envio por e-mail (opcional). Sem SMTP, a solicitação fica registrada no painel.
  const recipients = settings.contactRecipients?.length ? settings.contactRecipients : (process.env.CONTACT_RECIPIENTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const smtpReady = Boolean(process.env.SMTP_HOST && recipients.length)
  if (!smtpReady) {
    payload.logger.warn(`Solicitação ${inquiry.id} salva, mas o envio por e-mail não está configurado (SMTP_HOST/CONTACT_RECIPIENTS).`)
    return { ok: true, delivered: false }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
    const rows: [string, string][] = [
      ['Nome', data.name],
      ['E-mail', data.email],
      ['WhatsApp', data.whatsapp],
      ['Peregrinação de interesse', tripTitle],
      ['Página de origem', data.sourcePage || '-'],
    ]
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients,
      replyTo: data.email,
      subject: `[Site] Solicitação de ${data.name} — ${tripTitle}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMensagem:\n${data.message}`,
      html: `<table>${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table><p><strong>Mensagem:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
    })
    await payload.update({ collection: 'inquiries', id: inquiry.id, overrideAccess: true, data: { emailDelivery: 'enviado' } })
    return { ok: true, delivered: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    payload.logger.error(`Falha ao enviar e-mail da solicitação ${inquiry.id}: ${message}`)
    await payload.update({ collection: 'inquiries', id: inquiry.id, overrideAccess: true, data: { emailDelivery: 'falhou', deliveryError: message.slice(0, 250) } })
    // A mensagem foi registrada; a equipe a verá no painel.
    return { ok: true, delivered: false }
  }
}
