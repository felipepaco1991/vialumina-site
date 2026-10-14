/**
 * Eventos de analytics enviados ao dataLayer (GTM) e/ou gtag (GA4).
 * Nada é carregado sem consentimento; antes disso os eventos ficam apenas em memória.
 */
export type AnalyticsEvent =
  | 'view_trip'
  | 'trip_card_click'
  | 'filter_use'
  | 'whatsapp_click'
  | 'info_request'
  | 'pdf_download'
  | 'form_submit'
  // Landing pages de cadastro (padres, agências, peregrinos)
  | 'view_lp_padres'
  | 'view_lp_agencias'
  | 'view_lp_peregrinos'
  | 'start_form_padres'
  | 'start_form_agencias'
  | 'start_form_peregrinos'
  | 'submit_form_padres'
  | 'submit_form_agencias'
  | 'submit_form_peregrinos'
  | 'form_error'
  | 'click_whatsapp'
  | 'click_destinos'
  | 'click_cadastre_se'
  // Promoções e parcerias (banners da home e páginas /promocoes/*)
  | 'view_promo_trivva'
  | 'view_promo_crescer'
  | 'promo_click'

type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
  // Com GA4 direto (sem GTM), o gtag também recebe o evento.
  if (window.gtag && !document.getElementById('vl-gtm')) window.gtag('event', event, params)
}

export const CONSENT_KEY = 'vl-consent-analytics'
