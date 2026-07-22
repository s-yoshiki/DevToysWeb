'use client'

import { CornerDownLeft, History, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { type ToolDefinition, tools } from '@/features/tools/domain/catalog'
import { getToolPath } from '@/features/tools/domain/tool-path'
import { useRecentTools } from '@/features/tools/hooks/use-recent-tools'
import { cn } from '@/lib/utils'

/** Every string a tool can reasonably be searched by, in both locales. */
const haystack = (tool: ToolDefinition) =>
  [
    tool.slug,
    tool.pathSlug,
    tool.category,
    tool.title.ja,
    tool.title.en,
    tool.description.ja,
    tool.description.en,
  ]
    .join(' ')
    .toLowerCase()

export const CommandPalette = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const router = useRouter()
  const { locale, dictionary } = useLocale()
  const recent = useRecentTools()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const results = useMemo(() => {
    if (!terms.length) return recent.length ? recent : tools.slice(0, 8)
    return tools.filter((tool) => {
      const text = haystack(tool)
      return terms.every((term) => text.includes(term))
    })
  }, [recent, terms])
  const showingRecent = !terms.length && recent.length > 0

  // Reset the transient state each time the palette is summoned.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  const activeSlug = results[active]?.slug
  useEffect(() => {
    if (!activeSlug) return
    listRef.current?.querySelector(`[data-slug="${activeSlug}"]`)?.scrollIntoView({
      block: 'nearest',
    })
  }, [activeSlug])

  const select = useCallback(
    (tool: ToolDefinition | undefined) => {
      if (!tool) return
      onOpenChange(false)
      router.push(getToolPath(locale, tool))
    },
    [locale, onOpenChange, router],
  )

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => (results.length ? (index + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      select(results[active])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onKeyDown={onKeyDown}>
        <DialogTitle className="sr-only">{dictionary.commandPalette}</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            placeholder={dictionary.commandPalettePlaceholder}
            aria-label={dictionary.commandPalettePlaceholder}
            aria-controls={listId}
            aria-activedescendant={activeSlug ? `${listId}-${activeSlug}` : undefined}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={dictionary.commandPalette}
          className="max-h-[min(24rem,60vh)] overflow-y-auto p-2"
        >
          {showingRecent && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <History className="size-3" />
              {dictionary.recentTools}
            </div>
          )}
          {results.map((tool, index) => (
            <button
              key={tool.slug}
              type="button"
              id={`${listId}-${tool.slug}`}
              role="option"
              aria-selected={index === active}
              data-slug={tool.slug}
              onMouseMove={() => setActive(index)}
              onClick={() => select(tool)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                index === active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
              )}
            >
              <span className="w-5 shrink-0 text-center text-base" aria-hidden="true">
                {tool.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {tool.title[locale]}
                </span>
                <span className="block truncate text-xs">{tool.description[locale]}</span>
              </span>
              <span className="hidden shrink-0 text-[11px] uppercase tracking-wider sm:block">
                {dictionary.categories[tool.category]}
              </span>
              {index === active && <CornerDownLeft className="size-3.5 shrink-0" />}
            </button>
          ))}
          {!results.length && (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              {dictionary.noToolsFound}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Binds ⌘K / Ctrl+K globally and returns the palette's open state. */
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((previous) => !previous)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return { open, setOpen }
}
