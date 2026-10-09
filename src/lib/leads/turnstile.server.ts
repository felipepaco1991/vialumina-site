import 'server-only'

/**
 * Cloudflare Turnstile (CAPTCHA sem fricção), opcional.
 * Ativa quando NEXT_PUBLIC_TURNSTILE_SITE_KEY e TURNSTILE_SECRET_KEY estão definidas.
 * Sem as chaves, o antispam usa honeypot, tempo mínimo de preenchimento e limite de taxa.
 */
export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (!turnstileEnabled()) return true
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token })
    if (ip && ip !== 'local') body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(5000) })
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch {
    // Falha do serviço de verificação: bloqueia por segurança (mensagem orienta a tentar novamente).
    return false
  }
}
