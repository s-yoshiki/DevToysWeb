'use client'

import { Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { type ToolCategory, tools } from '../domain/catalog'
import { ToolCard } from './tool-card'

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

export const ToolDashboard = () => {
  const { locale, dictionary } = useLocale()
  const [query, setQuery] = useState('')
  const visible = useMemo(
    () =>
      tools.filter((tool) =>
        `${tool.title[locale]} ${tool.description[locale]}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [locale, query],
  )
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> Developer toolbox
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {dictionary.tagline}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {dictionary.heroDescription}
          </p>
          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dictionary.search}
              className="h-12 rounded-xl bg-background pl-11 shadow-sm"
            />
          </div>
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} locale={locale} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
