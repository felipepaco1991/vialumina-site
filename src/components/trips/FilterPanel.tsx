'use client'
import { Search, X } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { FILTER_LABELS, type FacetOption, type Facets, type FilterState, type ListKey } from '@/lib/filters'

type Props = {
  state: FilterState
  facets: Facets
  onChange: (next: FilterState) => void
  /** Campo de busca com valor controlado externamente (para debounce). */
  query: string
  onQueryChange: (q: string) => void
  idPrefix?: string
}

const GROUPS: { key: ListKey; collapsedLimit?: number }[] = [
  { key: 'regiao' },
  { key: 'pais', collapsedLimit: 6 },
  { key: 'mes', collapsedLimit: 6 },
  { key: 'embarque' },
  { key: 'duracao' },
  { key: 'acompanhante', collapsedLimit: 5 },
  { key: 'preco' },
]

export function FilterPanel({ state, facets, onChange, query, onQueryChange, idPrefix = 'f' }: Props) {
  const searchId = `${idPrefix}-busca`
  const toggle = (key: ListKey, value: string) => {
    const current = state[key]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...state, [key]: next })
  }

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor={searchId} className="mb-2 block font-label text-xs font-bold tracking-[0.16em] text-navy-900 uppercase">
          Pesquisar
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Destino, santuário, padre…"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-navy-900/15 bg-white pr-10 pl-12 text-[0.98rem] text-ink-900 shadow-[inset_0_1px_2px_rgb(10_46_92/0.05)] transition outline-none placeholder:text-slate-500 focus:border-gold-500 focus:ring-4 focus:ring-gold-200/60"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-navy-900/5 hover:text-navy-900"
              aria-label="Limpar pesquisa"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-slate-500">Busca por roteiro, país, cidade, santuário ou acompanhante — sem diferenciar acentos.</p>
      </div>

      {GROUPS.map(({ key, collapsedLimit }) => {
        const options = facets[key]
        if (key === 'preco' && !facets.priceAvailable) return null
        if (!options.length) return null
        return (
          <FacetGroup
            key={key}
            idPrefix={`${idPrefix}-${key}`}
            legend={FILTER_LABELS[key]}
            options={options}
            selected={state[key]}
            onToggle={(v) => toggle(key, v)}
            collapsedLimit={collapsedLimit}
            note={key === 'preco' ? 'Somente roteiros com valores aprovados, comparados em reais.' : undefined}
          />
        )
      })}
    </div>
  )
}

function FacetGroup({
  legend,
  options,
  selected,
  onToggle,
  collapsedLimit,
  idPrefix,
  note,
}: {
  legend: string
  options: FacetOption[]
  selected: string[]
  onToggle: (value: string) => void
  collapsedLimit?: number
  idPrefix: string
  note?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const limit = collapsedLimit && !expanded ? collapsedLimit : Infinity
  // Opções selecionadas sempre visíveis, mesmo com a lista recolhida.
  const visible = options.filter((o, i) => i < limit || selected.includes(o.value))
  const hidden = options.length - visible.length

  return (
    <fieldset>
      <legend className="mb-3 font-label text-xs font-bold tracking-[0.16em] text-navy-900 uppercase">{legend}</legend>
      <ul id={listId} className="space-y-1">
        {visible.map((o) => {
          const id = `${idPrefix}-${o.value}`
          const checked = selected.includes(o.value)
          const disabled = !checked && o.count === 0
          return (
            <li key={o.value}>
              <label
                htmlFor={id}
                className={cn(
                  'group flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors',
                  checked ? 'bg-navy-900/[0.06]' : 'hover:bg-navy-900/[0.04]',
                  disabled && 'cursor-not-allowed opacity-45',
                )}
              >
                <input id={id} type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={() => onToggle(o.value)} />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2',
                    checked ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/30 bg-white',
                  )}
                >
                  <svg viewBox="0 0 12 10" className={cn('size-3 transition', checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0')} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 5l3.5 3.5L11 1" />
                  </svg>
                </span>
                <span className="flex-1 text-[0.95rem] leading-snug text-ink-900">{o.label}</span>
                <span className="font-label text-xs font-semibold text-slate-500 tabular-nums">{o.count}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {collapsedLimit && options.length > collapsedLimit ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-2 ml-2.5 font-label text-xs font-bold tracking-wide text-gold-700 underline-offset-4 hover:underline"
        >
          {expanded ? 'Mostrar menos' : `Mostrar mais ${hidden > 0 ? `(${hidden})` : ''}`}
        </button>
      ) : null}
      {note ? <p className="mt-2 ml-2.5 text-xs text-slate-500">{note}</p> : null}
    </fieldset>
  )
}
