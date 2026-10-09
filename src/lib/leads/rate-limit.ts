/**
 * Limitador de taxa em memória (janela deslizante). Protege cada instância do servidor contra rajadas;
 * para vários servidores, mova o contador para um armazenamento compartilhado (ex.: Redis).
 */
const buckets = new Map<string, number[]>()

export function rateLimited(key: string, { windowMs, max }: { windowMs: number; max: number }): boolean {
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  buckets.set(key, recent)
  // Evita crescimento ilimitado do mapa.
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k)
  return recent.length > max
}

export const resetRateLimits = () => buckets.clear()
