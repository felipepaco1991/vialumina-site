'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { track } from '@/lib/analytics'
import {
  EMPTY_FILTERS,
  FILTER_LABELS,
  LIST_KEYS,
  activeFilterCount,
  applyFilters,
  buildFacets,
  parseFilters,
  serializeFilters,
  type FilterState,
  type SortKey,
} from '@/lib/filters'
import type { TripCardData } from '@/lib/trip-model'
import { FilterPanel } from './FilterPanel'
import { TripCard } from './TripCard'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'data', label: 'Data de saída' },
  { value: 'relevancia', label: 'Relevância' },
  { value: 'duracao', label: 'Duração' },
]

const plural = (n: number) => (n === 1 ? '1 peregrinação encontrada' : `${n} peregrinações encontradas`)

export function TripCatalog({ trips, whatsappHref }: { trips: TripCardData[]; whatsappHref: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [state, setState] = useState<FilterState>(() => parseFilters(new URLSearchParams(searchParams.toString())))
  const [query, setQuery] = useState(state.q)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(state)
  const [draftQuery, setDraftQuery] = useState(state.q)

  // Navegação pelo histórico (voltar/avançar) restaura os filtros.
  const paramsKey = searchParams.toString()
  const [lastParams, setLastParams] = useState(paramsKey)
  if (paramsKey !== lastParams) {
    setLastParams(paramsKey)
    const next = parseFilters(new URLSearchParams(paramsKey))
    if (serializeFilters(next) !== serializeFilters(state)) {
      setState(next)
      setQuery(next.q)
    }
  }

  const commit = (next: FilterState) => {
    // Ao buscar por texto, a ordenação passa a ser por relevância (a menos que o usuário escolha outra).
    if (next.q && !state.q && state.ordem === 'data') next = { ...next, ordem: 'relevancia' }
    if (!next.q && state.q && next.ordem === 'relevancia') next = { ...next, ordem: 'data' }
    setState(next)
    const qs = serializeFilters(next)
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
  }

  // Busca com pequeno atraso para não reorganizar a lista a cada tecla.
  useEffect(() => {
    if (query.trim() === state.q) return
    const t = setTimeout(() => commit({ ...state, q: query.trim() }), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Analytics: registra o uso de filtros (agrupado).
  const lastTracked = useRef(serializeFilters(state))
  useEffect(() => {
    const qs = serializeFilters(state)
    if (qs === lastTracked.current) return
    const t = setTimeout(() => {
      lastTracked.current = qs
      track('filter_use', { filters: qs || '(nenhum)', results: applyFilters(trips, state).length })
    }, 1200)
    return () => clearTimeout(t)
  }, [state, trips])

  const results = useMemo(() => applyFilters(trips, state), [trips, state])
  const facets = useMemo(() => buildFacets(trips, state), [trips, state])
  const draftFacets = useMemo(() => buildFacets(trips, { ...draft, q: draftQuery }), [trips, draft, draftQuery])
  const draftCount = useMemo(() => applyFilters(trips, { ...draft, q: draftQuery.trim() }).length, [trips, draft, draftQuery])
  const active = activeFilterCount(state)

  const chips = [
    ...(state.q ? [{ key: 'q' as const, value: state.q, label: `“${state.q}”` }] : []),
    ...LIST_KEYS.flatMap((key) =>
      state[key].map((value) => ({
        key,
        value,
        label: facets[key].find((o) => o.value === value)?.label ?? value,
      })),
    ),
  ]

  const removeChip = (key: (typeof chips)[number]['key'], value: string) => {
    if (key === 'q') {
      setQuery('')
      commit({ ...state, q: '' })
    } else commit({ ...state, [key]: state[key].filter((v) => v !== value) })
  }

  const clearAll = () => {
    setQuery('')
    commit({ ...EMPTY_FILTERS })
  }

  const openSheet = (open: boolean) => {
    if (open) {
      setDraft(state)
      setDraftQuery(query)
    }
    setSheetOpen(open)
  }

  const applyDraft = () => {
    setQuery(draftQuery)
    commit({ ...draft, q: draftQuery.trim() })
    setSheetOpen(false)
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="grid gap-10 xl:grid-cols-[290px_1fr] xl:gap-12">
      {/* Painel lateral (desktop) */}
      <aside aria-label="Filtros" className="hidden xl:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[var(--radius-card)] bg-white p-6 shadow-soft ring-1 ring-navy-900/5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-navy-900">Filtrar</h2>
            {active ? (
              <button type="button" onClick={clearAll} className="font-label text-xs font-bold text-gold-700 hover:underline">
                Limpar filtros
              </button>
            ) : null}
          </div>
          <FilterPanel state={state} facets={facets} onChange={commit} query={query} onQueryChange={setQuery} idPrefix="d" />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra de resultados */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-900/10 pb-5">
          <h2 className="font-display text-2xl text-navy-900" aria-live="polite" aria-atomic="true">
            {plural(results.length)}
          </h2>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Dialog.Root open={sheetOpen} onOpenChange={openSheet}>
              <Dialog.Trigger className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-navy-900/15 bg-white px-5 font-label text-sm font-semibold text-navy-900 shadow-soft sm:flex-none xl:hidden">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {active ? <span className="rounded-full bg-navy-900 px-2 py-0.5 text-xs text-white">{active}</span> : null}
              </Dialog.Trigger>
              <AnimatePresence>
                {sheetOpen ? (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild forceMount>
                      <motion.div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    </Dialog.Overlay>
                    <Dialog.Content asChild forceMount aria-describedby={undefined}>
                      <motion.div
                        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92svh] flex-col rounded-t-[28px] bg-cream-50 shadow-deep"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="flex items-center justify-between border-b border-navy-900/10 px-5 py-4">
                          <Dialog.Title className="font-display text-2xl text-navy-900">Filtrar peregrinações</Dialog.Title>
                          <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-900/5" aria-label="Fechar filtros">
                            <X className="size-6" />
                          </Dialog.Close>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-6">
                          <FilterPanel state={draft} facets={draftFacets} onChange={setDraft} query={draftQuery} onQueryChange={setDraftQuery} idPrefix="m" />
                        </div>
                        <div className="flex gap-3 border-t border-navy-900/10 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                          <button
                            type="button"
                            onClick={() => {
                              setDraft({ ...EMPTY_FILTERS })
                              setDraftQuery('')
                            }}
                            className="min-h-12 rounded-full border border-navy-900/20 px-5 font-label text-sm font-semibold text-navy-900"
                          >
                            Limpar
                          </button>
                          <button type="button" onClick={applyDraft} className="min-h-12 flex-1 rounded-full bg-navy-900 px-5 font-label text-sm font-semibold text-white">
                            Ver {draftCount} {draftCount === 1 ? 'peregrinação' : 'peregrinações'}
                          </button>
                        </div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                ) : null}
              </AnimatePresence>
            </Dialog.Root>

            <label className="flex flex-1 items-center gap-2 sm:flex-none">
              <span className="font-label text-xs font-bold tracking-wide whitespace-nowrap text-slate-500 uppercase">Ordenar por</span>
              <select
                value={state.ordem}
                onChange={(e) => commit({ ...state, ordem: e.target.value as SortKey })}
                className="h-12 w-full min-w-0 cursor-pointer rounded-full border border-navy-900/15 bg-white px-4 font-label text-sm font-semibold text-navy-900 shadow-soft outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-200/60 sm:w-auto"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Filtros ativos */}
        <AnimatePresence initial={false}>
          {chips.length ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ul className="flex flex-wrap items-center gap-2 pt-5" aria-label="Filtros ativos">
                {chips.map((c) => (
                  <li key={`${c.key}-${c.value}`}>
                    <button
                      type="button"
                      onClick={() => removeChip(c.key, c.value)}
                      className="group inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy-900 py-1.5 pr-2.5 pl-3.5 text-sm text-white transition hover:bg-navy-800"
                      aria-label={`Remover filtro ${c.key === 'q' ? 'pesquisa' : FILTER_LABELS[c.key]}: ${c.label}`}
                    >
                      <span className="max-w-[16rem] truncate">{c.label}</span>
                      <X className="size-4 opacity-70 group-hover:opacity-100" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={clearAll} className="min-h-9 px-2 font-label text-xs font-bold text-gold-700 hover:underline">
                    Limpar filtros
                  </button>
                </li>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Resultados */}
        {results.length ? (
          <motion.ul layout className="mt-8 grid gap-6 sm:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((trip, i) => (
                <motion.li
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: Math.min(i, 6) * 0.04, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                >
                  <TripCard trip={trip} priority={i < 2} sizes="(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 rounded-[var(--radius-card)] bg-white px-6 py-14 text-center shadow-soft ring-1 ring-navy-900/5">
            <SearchX className="mx-auto size-10 text-gold-500" aria-hidden="true" />
            <h3 className="mt-5 font-display text-2xl text-navy-900">Nenhuma peregrinação com esses critérios</h3>
            <p className="mx-auto mt-3 max-w-md text-slate-700">Remova alguns filtros ou fale com nossa equipe — podemos ajudar a encontrar o roteiro ideal.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={clearAll} className="min-h-12 rounded-full bg-navy-900 px-6 font-label text-sm font-semibold text-white hover:bg-navy-800">
                Limpar filtros
              </button>
              <ButtonLink href={whatsappHref} variant="whatsapp" icon={<WhatsAppIcon className="size-5" />} data-track="whatsapp_click" data-track-label="catalogo-vazio">
                Falar pelo WhatsApp
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </MotionConfig>
  )
}
