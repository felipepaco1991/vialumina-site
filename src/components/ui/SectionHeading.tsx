import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: string | null
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', tone = 'dark', as: Tag = 'h2', className, id }: Props) {
  return (
    <header className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className={cn('mb-3', tone === 'light' ? 'eyebrow-light' : 'eyebrow')}>{eyebrow}</p> : null}
      <Tag
        id={id}
        className={cn(
          'title-rule text-[2rem] leading-[1.12] font-medium sm:text-[2.5rem]',
          align === 'center' && 'title-rule-center',
          tone === 'light' && 'text-white',
        )}
      >
        {title}
      </Tag>
      {intro ? <div className={cn('mt-6 text-lg leading-relaxed', tone === 'light' ? 'text-white/80' : 'text-slate-700')}>{intro}</div> : null}
    </header>
  )
}
