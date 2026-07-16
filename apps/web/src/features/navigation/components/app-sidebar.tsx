'use client'

import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { type ToolCategory, tools } from '@/features/tools/domain/catalog'
import { getToolPath } from '@/features/tools/domain/tool-path'
import { cn } from '@/lib/utils'

const categories: ToolCategory[] = [
  'converters',
  'encoders',
  'formatters',
  'generators',
  'testers',
  'text',
  'images',
  'network',
]

export const AppSidebar = () => {
  const pathname = usePathname()
  const { locale, dictionary } = useLocale()

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-card/35 lg:block">
      <div className="h-full overflow-y-auto px-3 py-5">
        <Link
          href={`/${locale}`}
          className={cn(
            'mb-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === `/${locale}`
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <LayoutGrid className="size-4" />
          {dictionary.allTools}
        </Link>

        <nav className="space-y-6" aria-label="Tool navigation">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                {dictionary.categories[category]}
              </h2>
              <div className="space-y-1">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => {
                    const href = getToolPath(locale, tool)
                    const active = pathname === href
                    return (
                      <Link
                        key={tool.slug}
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-accent font-medium text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground',
                        )}
                      >
                        <span className="w-5 text-center text-base" aria-hidden="true">
                          {tool.emoji}
                        </span>
                        <span className="truncate">{tool.title[locale]}</span>
                        {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                      </Link>
                    )
                  })}
              </div>
            </section>
          ))}
        </nav>
      </div>
    </aside>
  )
}
