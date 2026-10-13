/** Máscaras e validações de documentos/telefones brasileiros (usadas no cliente e no servidor). */

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

/** Máscara progressiva: (11) 99999-9999 ou (11) 3333-4444. */
export function maskPhone(value: string): string {
  let d = onlyDigits(value)
  if (d.startsWith('55') && d.length > 11) d = d.slice(2)
  d = d.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Telefone nacional (DDD + número) sem o 55, ou null se inválido. DDD de 11 a 99; celular começa com 9. */
export function normalizeBrPhone(value: string): string | null {
  let d = onlyDigits(value)
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2)
  if (d.length !== 10 && d.length !== 11) return null
  const ddd = Number(d.slice(0, 2))
  if (ddd < 11 || ddd > 99) return null
  if (d.length === 11 && d[2] !== '9') return null
  // Fixo (10 dígitos) começa com 2 a 5; números que começam com 9 estão incompletos (celular sem um dígito).
  if (d.length === 10 && !/[2-5]/.test(d[2]!)) return null
  if (/^(\d)\1+$/.test(d)) return null
  return d
}

/** Formato armazenado: E.164 sem o "+" (ex.: 5511999998888). */
export const toStoredPhone = (value: string): string | null => {
  const n = normalizeBrPhone(value)
  return n ? `55${n}` : null
}

export function formatStoredPhone(stored: string | null | undefined): string {
  if (!stored) return ''
  return maskPhone(stored.replace(/^55/, ''))
}

export function maskCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

/** Valida o CNPJ pelos dígitos verificadores (não consulta a Receita: a verificação cadastral é feita pela equipe). */
export function isValidCnpj(value: string): boolean {
  const d = onlyDigits(value)
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false
  const calc = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum = weights.reduce((acc, w, i) => acc + Number(d[i]) * w, 0)
    const mod = sum % 11
    return mod < 2 ? 0 : 11 - mod
  }
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13])
}

/** Normaliza site/URL: aceita "empresa.com.br" e devolve https://empresa.com.br; null se inválido. */
export function normalizeUrl(value: string): string | null {
  const v = value.trim()
  if (!v) return null
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return null
    return u.toString()
  } catch {
    return null
  }
}

/** Instagram: aceita @usuario, usuario ou URL; devolve "@usuario" ou null. */
export function normalizeInstagram(value: string): string | null {
  const v = value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, '')
  return /^[A-Za-z0-9._]{1,30}$/.test(v) ? `@${v}` : null
}
