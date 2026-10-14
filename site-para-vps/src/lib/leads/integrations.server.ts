import 'server-only'
import { createHmac } from 'crypto'
import type { LeadType } from './constants'

/**
 * Ponto único de integração com CRM, plataformas de e-mail e automação comercial.
 * Hoje há um adaptador: webhook assinado (LEAD_WEBHOOK_URL + LEAD_WEBHOOK_SECRET). Para outros destinos
 * (HubSpot, RD Station, Mailchimp...), adicione um adaptador em `adapters` — todos recebem o mesmo evento.
 * Sem configuração, nada é enviado. O consentimento de marketing acompanha o evento: respeite-o no destino.
 */
export type LeadEvent = {
  event: 'lead.created'
  occurredAt: string
  lead: {
    id: number | string
    type: LeadType
    name: string
    email: string
    phone: string | null
    city: string
    state: string
    source: string
    entryPoint: string
    utm: Record<string, string | null | undefined>
    destinations: string[]
    marketingConsent: boolean
    possibleDuplicate: boolean
  }
  profile: Record<string, unknown>
}

type Adapter = (event: LeadEvent) => Promise<void>

const webhookAdapter: Adapter = async (event) => {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) return
  const body = JSON.stringify(event)
  const secret = process.env.LEAD_WEBHOOK_SECRET
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'X-ViaLumina-Signature': `sha256=${createHmac('sha256', secret).update(body).digest('hex')}` } : {}),
    },
    body,
    signal: AbortSignal.timeout(4000),
  })
}

const adapters: Adapter[] = [webhookAdapter]

/** Entrega o evento aos adaptadores; falhas nunca impedem o cadastro. */
export async function dispatchLeadEvent(event: LeadEvent, log: (msg: string) => void) {
  await Promise.all(
    adapters.map((a) =>
      a(event).catch((err) => log(`Integração falhou para o cadastro ${event.lead.id}: ${err instanceof Error ? err.message : 'erro desconhecido'}`)),
    ),
  )
}
