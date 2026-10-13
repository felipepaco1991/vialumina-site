'use client'
import { MapPinned } from 'lucide-react'
import { useState } from 'react'

/** Mapa carregado somente após o clique: não pesa no carregamento inicial nem define cookies de terceiros antes da ação do usuário. */
export function MapEmbed({ query, label }: { query: string; label: string }) {
  const [load, setLoad] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-navy-900 ring-1 ring-navy-900/10 sm:aspect-[16/9]">
      {load ? (
        <iframe src={src} title={`Mapa: ${label}`} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(150deg,#0a2e5c,#0f4c81)] p-6 text-center text-white">
          <MapPinned className="size-10 text-gold-200" aria-hidden="true" />
          <p className="max-w-xs text-white/85">{label}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setLoad(true)} className="min-h-11 rounded-full bg-white px-5 font-label text-sm font-semibold text-navy-900 hover:bg-gold-100">
              Carregar mapa
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 font-label text-sm font-semibold text-white hover:bg-white/10"
            >
              Abrir no Google Maps
            </a>
          </div>
          <p className="text-xs text-white/55">O mapa é fornecido pelo Google e só é carregado após o clique.</p>
        </div>
      )}
    </div>
  )
}
