/**
 * Redirecionamentos do WordPress no mesmo arquivo JSON usado pelo next.config.mjs.
 * Mantido para importacoes TypeScript, sem fonte duplicada de URLs.
 */
import routes from './legacy-redirects.json'

export const LEGACY_REDIRECTS: { source: string; destination: string }[] = routes
