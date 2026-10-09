'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void; remove: (id?: string) => void }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** CAPTCHA Cloudflare Turnstile (opcional): só aparece se NEXT_PUBLIC_TURNSTILE_SITE_KEY estiver definida. */
export function Turnstile({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const widget = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    const el = ref.current
    const mount = () => {
      if (!window.turnstile || widget.current) return
      widget.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        language: 'pt-br',
        callback: (t: string) => onToken(t),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    }
    if (window.turnstile) mount()
    else {
      let script = document.getElementById('vl-turnstile') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.id = 'vl-turnstile'
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', mount)
    }
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current)
      widget.current = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current)
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={ref} className="min-h-[65px]" />
}
