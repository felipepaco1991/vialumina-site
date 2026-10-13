import 'server-only'
import nodemailer from 'nodemailer'
import { SITE_URL } from '@/lib/site-url'
import { leadTypeLabel, type LeadType } from './constants'

export const smtpConfigured = () => Boolean(process.env.SMTP_HOST)

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  })
}

type Row = [label: string, value: string]

/** Aviso interno de novo cadastro. Lança erro se o envio falhar (quem chama registra o status). */
export async function sendInternalNotification(args: { to: string[]; cc?: string[]; type: LeadType; leadId: number | string; name: string; replyTo: string; rows: Row[]; duplicate: boolean }) {
  const { to, cc, type, leadId, name, replyTo, rows, duplicate } = args
  const link = `${SITE_URL}/admin/collections/leads/${leadId}`
  const subject = `[Cadastro ${leadTypeLabel(type)}] ${name}${duplicate ? ' (possível duplicidade)' : ''}`
  await transporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    cc: cc?.length ? cc : undefined,
    replyTo,
    subject,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nAbrir no painel: ${link}`,
    html: `<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table><p><a href="${link}">Abrir no painel</a></p>`,
  })
}

/** Confirmação opcional ao cadastrado — só enviada quando habilitada nas configurações e com SMTP pronto. */
export async function sendConfirmation(args: { to: string; name: string; type: LeadType; unsubscribeUrl?: string }) {
  const first = args.name.split(' ')[0]
  const what = { PADRE: 'seu interesse em conhecer a parceria', AGENCIA: 'o interesse em conhecer as oportunidades de parceria', PEREGRINO: 'seu interesse nas peregrinações' }[args.type]
  const footer = args.unsubscribeUrl ? `\n\nPara deixar de receber comunicações promocionais: ${args.unsubscribeUrl}` : ''
  await transporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: args.to,
    subject: 'Recebemos seu cadastro · Via Lumina Viagens',
    text: `Olá, ${first}!\n\nRecebemos seu cadastro e agradecemos ${what} na Via Lumina Viagens. Nossa equipe poderá entrar em contato pelos canais informados.\n\nEste e-mail confirma apenas o recebimento do cadastro.${footer}\n\nVia Lumina Viagens\n${SITE_URL}`,
  })
}
