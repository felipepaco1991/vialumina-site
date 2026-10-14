'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'
import { CONTACT_ITEM, NAV_ITEMS, PARTNERSHIP_ITEMS, signupItems } from '@/lib/nav'


const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))


type MenuItem = { href: string; path: string; label: string }

const SIGNUP_ITEMS = signupItems('menu')

/** Menu suspenso ("Parcerias", "Cadastre-se"): abre por clique/teclado (e ao passar o mouse), fecha com Esc ou clique fora. */
function DropdownMenu({ label, items, pathname, solid, width = 'w-52' }: { label: string; items: readonly MenuItem[]; pathname: string; solid: boolean; width?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const active = items.some((i) => isActive(pathname, i.path))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <li ref={ref} className="relative flex items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        // Mouse/toque: o hover já abre, então o clique mantém aberto (não fecha de volta). Teclado (detail 0) alterna.
        onClick={(e) => setOpen((v) => (e.detail === 0 ? !v : true))}
        className={cn(
          'relative inline-flex items-center gap-1 rounded-full px-2.5 py-2 font-label text-[0.8125rem] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 xl:px-4',
          solid ? 'text-navy-900 hover:text-gold-700' : 'text-white/90 hover:text-white',
        )}
      >
        {label}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
        <span aria-hidden="true" className={cn('absolute inset-x-2.5 -bottom-0.5 xl:inset-x-4 h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-500', active ? 'scale-x-100' : 'scale-x-0')} />
      </button>
      {open ? (
        <div className={cn('absolute top-full left-0 z-10 pt-2', width)}>
          <ul className="overflow-hidden rounded-2xl bg-white py-2 shadow-deep ring-1 ring-navy-900/10">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.path) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 font-label text-[0.8125rem] font-semibold text-navy-900 transition hover:bg-cream-100 hover:text-gold-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

type Props = { whatsappHref: string; phoneHref: string; phoneDisplay: string; whatsappDisplay: string }

export function Header({ whatsappHref, phoneHref, phoneDisplay, whatsappDisplay }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [heroTone, setHeroTone] = useState<string | null>(null)

  useEffect(() => {
    // Na home, o carrossel marca o slide ativo claro (data-hero-tone) e o cabeçalho passa a ser branco.
    const root = document.documentElement
    const sync = () => setHeroTone(root.dataset.heroTone ?? null)
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-hero-tone'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  // Slide claro: cabeçalho branco. Slide roxo (Crescer): faixa roxa com o texto branco, como na arte.
  const solid = scrolled || open || heroTone === 'light'
  const purple = !solid && heroTone === 'purple'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        solid
          ? 'bg-white/95 shadow-[0_8px_30px_rgb(10_46_92/0.08)] backdrop-blur-md'
          : purple
            ? 'bg-[#28055f] shadow-[inset_0_6px_0_#511b8e]'
            : 'bg-gradient-to-b from-navy-950/55 to-transparent',
      )}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Link href="/" className="relative block h-11 w-[108px] shrink-0 lg:h-13 lg:w-[127px]" aria-label="Via Lumina Viagens — página inicial">
          <Image
            src="/assets/logos/via-lumina-logo-branco.webp"
            alt=""
            fill
            sizes="128px"
            loading="eager"
            className={cn('object-contain transition-opacity duration-500', solid ? 'opacity-0' : 'opacity-100')}
          />
          <Image
            src="/assets/logos/via-lumina-logo.webp"
            alt=""
            fill
            sizes="128px"
            loading="eager"
            className={cn('object-contain transition-opacity duration-500', solid ? 'opacity-100' : 'opacity-0')}
          />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex items-center rounded-full px-2.5 py-2 font-label text-[0.8125rem] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 xl:px-4',
                      solid ? 'text-navy-900 hover:text-gold-700' : 'text-white/90 hover:text-white',
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-2.5 -bottom-0.5 xl:inset-x-4 h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-500 ease-[var(--ease-out-soft)]',
                        active ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
            <DropdownMenu label="Parcerias" items={PARTNERSHIP_ITEMS} pathname={pathname} solid={solid} width="w-64" />
            <DropdownMenu label="Cadastre-se" items={SIGNUP_ITEMS} pathname={pathname} solid={solid} width="w-64" />
            <li className="flex items-center">
              <Link
                href={CONTACT_ITEM.href}
                aria-current={isActive(pathname, CONTACT_ITEM.href) ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center rounded-full px-2.5 py-2 font-label text-[0.8125rem] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 xl:px-4',
                  solid ? 'text-navy-900 hover:text-gold-700' : 'text-white/90 hover:text-white',
                )}
              >
                {CONTACT_ITEM.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-2.5 -bottom-0.5 xl:inset-x-4 h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-500 ease-[var(--ease-out-soft)]',
                    isActive(pathname, CONTACT_ITEM.href) ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={whatsappHref}
            variant="whatsapp"
            size="sm"
            className="hidden sm:inline-flex"
            icon={<WhatsAppIcon className="size-[18px]" />}
            data-track="whatsapp_click"
            data-track-label="header"
          >
            {/* No lg (1024px) só o ícone cabe ao lado dos novos itens do menu; o texto volta em telas maiores. */}
            <span className="max-lg:inline lg:sr-only xl:not-sr-only">WhatsApp</span>
          </ButtonLink>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden',
                solid ? 'text-navy-900 hover:bg-navy-900/5' : 'text-white hover:bg-white/10',
              )}
              aria-label="Abrir menu"
            >
              <Menu className="size-6" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm data-[state=closed]:animate-[fade-out_0.3s_ease_both] data-[state=open]:animate-[fade-in_0.3s_ease_both] lg:hidden" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,380px)] flex-col bg-cream-50 shadow-deep data-[state=closed]:animate-[slide-out-right_0.35s_var(--ease-out-soft)_both] data-[state=open]:animate-[slide-in-right_0.4s_var(--ease-out-soft)_both] lg:hidden"
              >
                <div className="flex h-[4.5rem] items-center justify-between border-b border-navy-900/10 px-5">
                  <Dialog.Title className="eyebrow">Menu</Dialog.Title>
                  <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-900/5" aria-label="Fechar menu">
                    <X className="size-6" />
                  </Dialog.Close>
                </div>
                <nav aria-label="Principal (celular)" className="flex-1 overflow-y-auto px-5 py-6">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item, i) => {
                      const active = isActive(pathname, item.href)
                      return (
                        <li key={item.href} className="animate-[fade-up_0.4s_var(--ease-out-soft)_both]" style={{ animationDelay: `${80 + i * 50}ms` }}>
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl transition-colors',
                              active ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-900/5',
                            )}
                          >
                            {item.label}
                            {active ? <span className="size-2 rounded-full bg-gold-300" aria-hidden="true" /> : null}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="eyebrow mt-6 mb-2 px-4">Parcerias</p>
                  <ul className="space-y-1">
                    {PARTNERSHIP_ITEMS.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.href}
                          aria-current={isActive(pathname, item.path) ? 'page' : undefined}
                          className={cn('flex items-center rounded-2xl px-4 py-3 font-display text-xl transition-colors', isActive(pathname, item.path) ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-900/5')}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="eyebrow mt-6 mb-2 px-4">Cadastre-se</p>
                  <ul className="space-y-1">
                    {SIGNUP_ITEMS.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.href}
                          aria-current={isActive(pathname, item.path) ? 'page' : undefined}
                          className={cn('flex items-center rounded-2xl px-4 py-3 font-display text-xl transition-colors', isActive(pathname, item.path) ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-900/5')}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={CONTACT_ITEM.href}
                    aria-current={isActive(pathname, CONTACT_ITEM.href) ? 'page' : undefined}
                    className={cn(
                      'mt-5 flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl transition-colors',
                      isActive(pathname, CONTACT_ITEM.href) ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-900/5',
                    )}
                  >
                    {CONTACT_ITEM.label}
                    {isActive(pathname, CONTACT_ITEM.href) ? <span className="size-2 rounded-full bg-gold-300" aria-hidden="true" /> : null}
                  </Link>
                </nav>
                <div className="space-y-3 border-t border-navy-900/10 p-5">
                  <ButtonLink
                    href={whatsappHref}
                    variant="whatsapp"
                    className="w-full"
                    icon={<WhatsAppIcon className="size-5" />}
                    data-track="whatsapp_click"
                    data-track-label="menu-mobile"
                  >
                    {whatsappDisplay}
                  </ButtonLink>
                  <a href={phoneHref} className="flex items-center justify-center gap-2 py-2 text-sm text-slate-700">
                    <Phone className="size-4" aria-hidden="true" /> Central: {phoneDisplay}
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
