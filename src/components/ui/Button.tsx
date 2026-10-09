import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'whatsapp' | 'primary' | 'gold' | 'outline' | 'ghost-light' | 'link'
type Size = 'md' | 'lg' | 'sm'

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-label font-semibold tracking-wide transition duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-3 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  whatsapp:
    'bg-whatsapp text-white shadow-[0_14px_35px_rgb(22_163_74/0.28)] hover:-translate-y-0.5 hover:bg-whatsapp-dark hover:shadow-[0_16px_34px_rgb(22_163_74/0.32)] focus-visible:outline-whatsapp',
  primary: 'bg-navy-900 text-white shadow-[0_12px_30px_rgb(10_46_92/0.22)] hover:-translate-y-0.5 hover:bg-navy-800 focus-visible:outline-navy-900',
  gold: 'bg-gold-500 text-navy-950 shadow-[0_12px_30px_rgb(201_146_42/0.3)] hover:-translate-y-0.5 hover:bg-gold-300 focus-visible:outline-gold-500',
  outline: 'border border-navy-900/20 bg-white text-navy-900 hover:-translate-y-0.5 hover:border-navy-900 hover:shadow-soft focus-visible:outline-navy-900',
  'ghost-light':
    'border border-white/55 bg-white/10 text-white backdrop-blur-md hover:-translate-y-0.5 hover:bg-white hover:text-navy-900 focus-visible:outline-white',
  link: 'px-0! py-0! min-h-0! text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-6 hover:text-gold-700',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-4 text-[0.8125rem]',
  md: 'min-h-12 px-6 text-sm',
  lg: 'min-h-14 px-7 text-[0.9375rem]',
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode; icon?: ReactNode; iconAfter?: ReactNode }

/** Atributos de rastreamento lidos pelo componente Analytics. */
export type TrackProps = { 'data-track'?: string; 'data-track-label'?: string; 'data-track-trip'?: string }

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconAfter,
  external,
  ...rest
}: CommonProps & TrackProps & { href: string; external?: boolean } & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>) {
  const cls = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {iconAfter}
    </>
  )
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal)
    return (
      <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>
        {content}
      </a>
    )
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconAfter,
  ...rest
}: CommonProps & Omit<ComponentProps<'button'>, 'children' | 'className'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconAfter}
    </button>
  )
}
