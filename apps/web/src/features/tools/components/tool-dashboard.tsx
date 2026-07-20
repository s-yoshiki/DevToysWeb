'use client'

import { ArrowRight, History, LayoutGrid, Search, Sparkles, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { cn } from '@/lib/utils'
import { useRecentTools } from '../application/use-recent-tools'
import { type ToolCategory, tools } from '../domain/catalog'
import { ToolCard } from './tool-card'

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

export const ToolDashboard = () => {
  const { locale, dictionary } = useLocale()
  const recent = useRecentTools()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
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
  const popular = ['json-format', 'base64', 'jwt', 'regex', 'text-diff', 'qr-code']
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool))

  const resetFilters = () => {
    setQuery('')
    setActiveCategory('all')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {tools.length} {dictionary.toolCount}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {dictionary.tagline}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {dictionary.heroDescription}
          </p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dictionary.search}
              className="h-14 rounded-2xl bg-background pl-11 text-base shadow-sm"
            />
          </div>
        </div>
      </section>

      {!query && activeCategory === 'all' && recent.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <History className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">{dictionary.recentTools}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recent.slice(0, 4).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {!query && activeCategory === 'all' && (
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">{dictionary.popularTools}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border bg-card/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <LayoutGrid className="size-4 text-primary" />
          {dictionary.browseByCategory}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm transition-colors',
              activeCategory === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {dictionary.allTools} <span className="ml-1 opacity-70">{tools.length}</span>
          </button>
          {categories.map((category) => {
            const count = tools.filter((tool) => tool.category === category).length
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-3.5 py-2 text-sm transition-colors',
                  activeCategory === category
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {dictionary.categories[category]} <span className="ml-1 opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-12 space-y-12">
        {categories.map((category) => {
          const entries = visible.filter((tool) => tool.category === category)
          if (!entries.length) return null
          return (
            <section key={category}>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-lg font-semibold">{dictionary.categories[category]}</h2>
                <span className="text-xs text-muted-foreground">{entries.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {entries.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} locale={locale} />
                ))}
              </div>
            </section>
          )
        })}
        {!visible.length && (
          <div className="rounded-2xl border border-dashed py-16 text-center">
            <Search className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-4 font-medium">{dictionary.noToolsFound}</p>
            <Button variant="ghost" className="mt-2" onClick={resetFilters}>
              {dictionary.resetFilters} <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
