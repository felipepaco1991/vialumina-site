/** Captura segura de UTMs: somente chaves conhecidas, valores curtos e com caracteres inofensivos. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
export type UtmKey = (typeof UTM_KEYS)[number]
export type Utm = Partial<Record<UtmKey, string>>

const SAFE = /^[\p{L}\p{N} _.\-+:/|%@]{1,100}$/u

export function sanitizeUtm(input: unknown): Utm {
  const out: Utm = {}
  if (!input || typeof input !== 'object') return out
  for (const key of UTM_KEYS) {
    const raw = (input as Record<string, unknown>)[key]
    if (typeof raw !== 'string') continue
    const v = raw.trim()
    if (SAFE.test(v)) out[key] = v
  }
  return out
}

const STORAGE_KEY = 'vl-utm'

/** Lê as UTMs da URL e preserva as primeiras da sessão (first touch). Somente no navegador. */
export function captureUtm(search: string): Utm {
  const fromUrl = sanitizeUtm(Object.fromEntries(new URLSearchParams(search)))
  try {
    const stored = sanitizeUtm(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}'))
    const merged = Object.keys(stored).length ? stored : fromUrl
    if (Object.keys(merged).length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    return merged
  } catch {
    return fromUrl
  }
}
