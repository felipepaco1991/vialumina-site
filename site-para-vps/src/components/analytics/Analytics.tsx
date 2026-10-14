'use client'
import Link from 'next/link'
import { useEffect, useSyncExternalStore } from 'react'
import { CONSENT_KEY, track, type AnalyticsEvent } from '@/lib/analytics'

type Props = { gtmId?: string | null; ga4Id?: string | null }

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

function enableTracking({ gtmId, ga4Id }: Props) {
  window.dataLayer = window.dataLayer || []
  if (gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    loadScript('vl-gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`)
    return // GA4 deve ser configurado dentro do GTM para não duplicar eventos.
  }
  if (ga4Id) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { anonymize_ip: true })
    loadScript('vl-ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`)
  }
}

// Preferência de consentimento guardada no navegador (store externo para useSyncExternalStore).
const CONSENT_EVENT = 'vl-consent-change'
type Choice = 'granted' | 'denied' | null
function readConsent(): Choice {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}
function subscribeConsent(cb: () => void) {
  window.addEventListener('storage', cb)
  window.addEventListener(CONSENT_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(CONSENT_EVENT, cb)
  }
}

/** Consentimento + ouvinte global de cliques em elementos com data-track. */
export function Analytics({ gtmId, ga4Id }: Props) {
  const configured = Boolean(gtmId || ga4Id)
  // No servidor o valor é "undefined": o aviso só aparece após a hidratação.
  const choice = useSyncExternalStore<Choice | undefined>(subscribeConsent, readConsent, () => undefined)

  useEffect(() => {
    if (choice === 'granted' && configured) enableTracking({ gtmId, ga4Id })
  }, [choice, configured, gtmId, ga4Id])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (!el) return
      track(el.dataset.track as AnalyticsEvent, {
        label: el.dataset.trackLabel,
        trip: el.dataset.trackTrip,
        link_url: el instanceof HTMLAnchorElement ? el.href : undefined,
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  const decide = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {}
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  return (
    <>
      {configured && choice === null ? (
        <div
          role="dialog"
          aria-label="Preferências de cookies"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl animate-fade-up rounded-2xl border border-navy-900/10 bg-white p-5 shadow-deep sm:inset-x-6 sm:bottom-6"
        >
          <p className="text-[0.95rem] leading-relaxed text-slate-700">
            Usamos cookies de medição para entender como o site é utilizado e melhorar sua experiência. Você pode aceitar ou recusar.{' '}
            <Link href="/politica-de-privacidade" className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4">
              Política de Privacidade
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => decide('granted')} className="min-h-11 rounded-full bg-navy-900 px-6 font-label text-sm font-semibold text-white hover:bg-navy-800">
              Aceitar
            </button>
            <button onClick={() => decide('denied')} className="min-h-11 rounded-full border border-navy-900/20 px-6 font-label text-sm font-semibold text-navy-900 hover:border-navy-900">
              Recusar
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

/** Dispara um evento ao montar (ex.: visualização de roteiro). */
export function TrackOnMount({ event, params }: { event: AnalyticsEvent; params?: Record<string, string> }) {
  useEffect(() => {
    track(event, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
