'use client'

import { ArrowRight, History, LayoutGrid, Search, TrendingUp, X } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { categoryOrder as categories, type ToolCategory, tools } from '../domain/catalog'
import { useRecentTools } from '../hooks/use-recent-tools'
import { ToolCard } from './tool-card'

const popularSlugs = ['json-format', 'base64', 'jwt', 'regex', 'text-diff', 'qr-code']

const SectionHeading = ({
  icon: Icon,
  children,
  count,
}: {
  icon?: typeof History
  children: React.ReactNode
  count?: number
}) => (
  <div className="mb-4 flex items-center gap-2">
    {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
    <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
    {count !== undefined && (
      <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
    )}
  </div>
)

export const ToolDashboard = () => {
  const { locale, dictionary } = useLocale()
  const recent = useRecentTools()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
  const searchId = useId()

  const visible = useMemo(
    () =>
      tools.filter(
        (tool) =>
          (activeCategory === 'all' || tool.category === activeCategory) &&
          `${tool.title[locale]} ${tool.description[locale]}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [activeCategory, locale, query],
  )
  const popular = popularSlugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool))

  const isFiltered = Boolean(query) || activeCategory !== 'all'
  const resetFilters = () => {
    setQuery('')
    setActiveCategory('all')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b border-border pb-10">
        {/* Deliberately not uppercased: the copy is Japanese in one locale, and
            `uppercase` would rewrite the Latin inside it ("Web" → "WEB"). */}
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          {tools.length} {dictionary.toolCount}
        </p>
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {dictionary.tagline}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
          {dictionary.heroDescription}
        </p>

        <div className="relative mt-8 max-w-xl">
          {/* A placeholder is not an accessible name, so the field keeps a real
              (visually hidden) label of its own. */}
          <label htmlFor={searchId} className="sr-only">
            {dictionary.search}
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dictionary.search}
            className="h-11 bg-card pl-10 pr-10 text-base"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={dictionary.clearSearch}
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </section>

      {!isFiltered && recent.length > 0 && (
        <section className="mt-10">
          <SectionHeading icon={History}>{dictionary.recentTools}</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recent.slice(0, 3).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {!isFiltered && (
        <section className="mt-10">
          <SectionHeading icon={TrendingUp}>{dictionary.popularTools}</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionHeading icon={LayoutGrid}>{dictionary.browseByCategory}</SectionHeading>
        {/*
         * A group of independent on/off filters, so each button reports its own
         * `aria-pressed` state rather than relying on colour alone.
         */}
        <fieldset className="flex flex-wrap gap-2" aria-label={dictionary.filterByCategory}>
          {(['all', ...categories] as const).map((category) => {
            const selected = activeCategory === category
            const count =
              category === 'all'
                ? tools.length
                : tools.filter((tool) => tool.category === category).length
            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                {category === 'all' ? dictionary.allTools : dictionary.categories[category]}
                <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
              </button>
            )
          })}
        </fieldset>
      </section>

      {/* Filtering happens without a page load, so the new result count has to
          be announced for it to reach a screen reader at all. */}
      <p aria-live="polite" className="sr-only">
        {visible.length} {dictionary.toolsFound}
      </p>

      <div className="mt-10 space-y-10">
        {categories.map((category) => {
          const entries = visible.filter((tool) => tool.category === category)
          if (!entries.length) return null
          return (
            <section key={category}>
              <SectionHeading count={entries.length}>
                {dictionary.categories[category]}
              </SectionHeading>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} locale={locale} />
                ))}
              </div>
            </section>
          )
        })}
        {!visible.length && (
          <div className="rounded-xl border border-dashed border-border-strong py-16 text-center">
            <Search className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 font-medium">{dictionary.noToolsFound}</p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              {dictionary.resetFilters}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
