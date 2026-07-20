'use client'

import { ChevronDown, History, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { useRecentTools } from '@/features/tools/application/use-recent-tools'
import { type ToolCategory, type ToolDefinition, tools } from '@/features/tools/domain/catalog'
import { getToolPath } from '@/features/tools/domain/tool-path'
import { cn } from '@/lib/utils'

const categories: ToolCategory[] = [
  'converters',
  'encoders',
  'formatters',
  'generators',
  'testers',
  'search',
  'text',
  'images',
  'network',
]

const storageKey = 'devtoys:collapsed-categories'

/**
 * Starts fully expanded so the static markup matches for everyone, then adopts the
 * visitor's saved preference once the client takes over.
 */
const useCollapsedCategories = () => {
  const [collapsed, setCollapsed] = useState<ToolCategory[]>([])

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]')
      if (Array.isArray(parsed))
        setCollapsed(parsed.filter((item): item is ToolCategory => categories.includes(item)))
    } catch {
      // A corrupt entry just means we keep the default expanded state.
    }
  }, [])

  const toggle = useCallback((category: ToolCategory) => {
    setCollapsed((previous) => {
      const next = previous.includes(category)
        ? previous.filter((entry) => entry !== category)
        : [...previous, category]
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // Preference persistence is best-effort.
      }
      return next
    })
  }, [])

  return { collapsed, toggle }
}

const ToolLink = ({ tool, active }: { tool: ToolDefinition; active: boolean }) => {
  const { locale } = useLocale()
  return (
    <Link
      href={getToolPath(locale, tool)}
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
}

export const AppSidebar = () => {
  const pathname = usePathname()
  const { locale, dictionary } = useLocale()
  const recent = useRecentTools()
  const { collapsed, toggle } = useCollapsedCategories()

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

        {recent.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              <History className="size-3" />
              {dictionary.recentTools}
            </h2>
            <div className="space-y-1">
              {recent.slice(0, 5).map((tool) => (
                <ToolLink
                  key={tool.slug}
                  tool={tool}
                  active={pathname === getToolPath(locale, tool)}
                />
              ))}
            </div>
          </section>
        )}

        <nav className="space-y-3" aria-label="Tool navigation">
          {categories.map((category) => {
            const entries = tools.filter((tool) => tool.category === category)
            const isCollapsed = collapsed.includes(category)
            return (
              <section key={category}>
                <button
                  type="button"
                  onClick={() => toggle(category)}
                  aria-expanded={!isCollapsed}
                  className="mb-1 flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    className={cn('size-3 transition-transform', isCollapsed && '-rotate-90')}
                    aria-hidden="true"
                  />
                  {dictionary.categories[category]}
                  <span className="ml-auto tabular-nums opacity-60">{entries.length}</span>
                </button>
                {!isCollapsed && (
                  <div className="space-y-1">
                    {entries.map((tool) => (
                      <ToolLink
                        key={tool.slug}
                        tool={tool}
                        active={pathname === getToolPath(locale, tool)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
