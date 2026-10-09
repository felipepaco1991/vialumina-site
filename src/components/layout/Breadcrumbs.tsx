import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { absoluteUrl } from '@/lib/site-url'
import { cn } from '@/lib/cn'
import { JsonLd } from '@/components/seo/JsonLd'

export type Crumb = { label: string; href: string }

/** Trilha de navegação com dados estruturados BreadcrumbList. */
export function Breadcrumbs({ items, tone = 'light', className }: { items: Crumb[]; tone?: 'light' | 'dark'; className?: string }) {
  const all = [{ label: 'Início', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Trilha de navegação" className={className}>
        <ol className={cn('flex flex-wrap items-center gap-1.5 font-label text-xs font-semibold tracking-wide', tone === 'light' ? 'text-white/75' : 'text-slate-500')}>
          {all.map((c, i) => {
            const last = i === all.length - 1
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={tone === 'light' ? 'text-white' : 'text-navy-900'}>
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className={cn('transition', tone === 'light' ? 'hover:text-white' : 'hover:text-navy-900')}>
                      {c.label}
                    </Link>
                    <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  )
}
