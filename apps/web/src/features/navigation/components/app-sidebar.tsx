'use client'

import { ChevronDown, History, LayoutGrid, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  categoryOrder as categories,
  type ToolCategory,
  type ToolDefinition,
  tools,
} from '@/libs/domain/catalog'
import { getToolPath, isSamePath } from '@/libs/domain/tool-path'
import { useRecentTools } from '@/hooks/use-recent-tools'
import { cn } from '@/libs/utils'

const storageKey = 'devtoys:collapsed-categories'
const railStorageKey = 'devtoys:sidebar-collapsed'

/** Reads a saved preference after mount so the static markup stays identical for everyone. */
const usePersistentState = <Value,>(
  key: string,
  initial: Value,
  parse: (raw: unknown) => Value,
) => {
  const [value, setValue] = useState<Value>(initial)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) setValue(parse(JSON.parse(raw)))
    } catch {
      // A corrupt entry just means we keep the default.
    }
  }, [key, parse])

  const store = useCallback(
    (next: Value) => {
      setValue(next)
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // Preference persistence is best-effort.
      }
    },
    [key],
  )

  return [value, store] as const
}

const parseCategories = (raw: unknown): ToolCategory[] =>
  Array.isArray(raw) ? raw.filter((item): item is ToolCategory => categories.includes(item)) : []

const parseBoolean = (raw: unknown) => raw === true

const useCollapsedCategories = () => {
  const [collapsed, store] = usePersistentState<ToolCategory[]>(storageKey, [], parseCategories)

  const toggle = useCallback(
    (category: ToolCategory) =>
      store(
        collapsed.includes(category)
          ? collapsed.filter((entry) => entry !== category)
          : [...collapsed, category],
      ),
    [collapsed, store],
  )

  return { collapsed, toggle }
}

const ToolLink = ({ tool, active }: { tool: ToolDefinition; active: boolean }) => {
  const { locale } = useLocale()
  return (
    <Link
      href={getToolPath(locale, tool)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-accent font-medium text-accent-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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

/** Icon-only entry for the collapsed rail; the name moves into a tooltip. */
const RailLink = ({ tool, active }: { tool: ToolDefinition; active: boolean }) => {
  const { locale } = useLocale()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={getToolPath(locale, tool)}
            aria-current={active ? 'page' : undefined}
            aria-label={tool.title[locale]}
            className={cn(
              'flex size-10 items-center justify-center rounded-lg text-lg transition-colors',
              active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted',
            )}
          />
        }
      >
        <span aria-hidden="true">{tool.emoji}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{tool.title[locale]}</TooltipContent>
    </Tooltip>
  )
}

export const AppSidebar = () => {
  const pathname = usePathname()
  const { locale, dictionary } = useLocale()
  const recent = useRecentTools()
  const { collapsed, toggle } = useCollapsedCategories()
  const [rail, setRail] = usePersistentState(railStorageKey, false, parseBoolean)

  const isActive = (tool: ToolDefinition) => isSamePath(pathname, getToolPath(locale, tool))
  const toggleLabel = rail ? dictionary.expandSidebar : dictionary.collapseSidebar

  return (
    <aside
      className={cn(
        'sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] shrink-0 overflow-hidden border-r border-border transition-[width] duration-200 lg:block',
        rail ? 'w-[4.5rem]' : 'w-64',
      )}
      data-collapsed={rail}
    >
      {/* Fixed inner width so the labels never re-wrap while the width animates. */}
      <div
        className={cn(
          'flex h-full shrink-0 flex-col overflow-y-auto px-3',
          rail ? 'w-[4.5rem] py-3' : 'w-64 py-5',
        )}
      >
        <div className={cn('mb-3 flex', rail ? 'justify-center' : 'justify-end')}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setRail(!rail)}
            aria-label={toggleLabel}
            title={toggleLabel}
            aria-expanded={!rail}
          >
            {rail ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>

        {rail ? (
          <TooltipProvider delay={150}>
            <nav
              className="flex flex-col items-center gap-1"
              aria-label={dictionary.mainNavigation}
            >
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      href={`/${locale}`}
                      aria-label={dictionary.allTools}
                      className={cn(
                        'flex size-10 items-center justify-center rounded-lg transition-colors',
                        isSamePath(pathname, `/${locale}`)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    />
                  }
                >
                  <LayoutGrid className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="right">{dictionary.allTools}</TooltipContent>
              </Tooltip>

              {categories.map((category) => (
                <section key={category} className="flex w-full flex-col items-center">
                  <span className="my-1.5 h-px w-6 bg-border" aria-hidden="true" />
                  <span className="sr-only">{dictionary.categories[category]}</span>
                  {tools
                    .filter((tool) => tool.category === category)
                    .map((tool) => (
                      <RailLink key={tool.slug} tool={tool} active={isActive(tool)} />
                    ))}
                </section>
              ))}
            </nav>
          </TooltipProvider>
        ) : (
          <>
            <Link
              href={`/${locale}`}
              className={cn(
                'mb-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isSamePath(pathname, `/${locale}`)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <LayoutGrid className="size-4" />
              {dictionary.allTools}
            </Link>

            {recent.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <History className="size-3" />
                  {dictionary.recentTools}
                </h2>
                <div className="space-y-1">
                  {recent.slice(0, 5).map((tool) => (
                    <ToolLink key={tool.slug} tool={tool} active={isActive(tool)} />
                  ))}
                </div>
              </section>
            )}

            <nav className="space-y-3" aria-label={dictionary.mainNavigation}>
              {categories.map((category) => {
                const entries = tools.filter((tool) => tool.category === category)
                const isCollapsed = collapsed.includes(category)
                return (
                  <section key={category}>
                    <button
                      type="button"
                      onClick={() => toggle(category)}
                      aria-expanded={!isCollapsed}
                      className="mb-1 flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
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
                          <ToolLink key={tool.slug} tool={tool} active={isActive(tool)} />
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}
            </nav>
          </>
        )}
      </div>
    </aside>
  )
}
