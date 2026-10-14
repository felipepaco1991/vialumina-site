'use server'
import { headers } from 'next/headers'
import type { LeadType } from '@/lib/leads/constants'
import type { AgencyInput, LeaderInput, LeadResult, PilgrimInput, PriestInput } from '@/lib/leads/schemas'
import { submitLead, withdrawMarketingConsent } from '@/lib/leads/submit.server'

/**
 * IP usado no limite de taxa. Preferimos cabeçalhos definidos pelo proxy de confiança (Cloudflare, X-Real-IP do
 * Nginx) e, por último, o fim da cadeia X-Forwarded-For (a entrada adicionada pelo proxy; o início é forjável).
 * O proxy de produção deve sobrescrever esses cabeçalhos — ver docs/publicacao.md.
 */
async function clientIp() {
  const h = await headers()
  const chain = h.get('x-forwarded-for')?.split(',').map((s) => s.trim()).filter(Boolean)
  return (h.get('cf-connecting-ip') ?? h.get('x-real-ip') ?? chain?.at(-1) ?? 'local').trim()
}

async function run(type: LeadType, input: unknown): Promise<LeadResult> {
  try {
    return await submitLead(type, input, { ip: await clientIp() })
  } catch {
    // Nunca expõe detalhes internos ao navegador.
    return { ok: false, error: 'Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.' }
  }
}

export const submitPriest = async (input: PriestInput) => run('PADRE', input)
export const submitAgency = async (input: AgencyInput) => run('AGENCIA', input)
export const submitLeader = async (input: LeaderInput) => run('FORMADOR', input)
export const submitPilgrim = async (input: PilgrimInput) => run('PEREGRINO', input)

export async function withdrawConsent(token: string) {
  return withdrawMarketingConsent(token, { ip: await clientIp() })
}
