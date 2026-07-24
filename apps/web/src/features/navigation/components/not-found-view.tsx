'use client'

import { ArrowLeft, Braces, Compass, Home } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { findTool } from '@/libs/domain/catalog'
import { getToolPath } from '@/libs/domain/tool-path'
import { getDictionary, isLocale, type Locale } from '@/i18n/dictionaries'

const suggestions = ['json-format', 'base64', 'unit-convert', 'timer', 'qr-code', 'text-diff']

/**
 * Rendered by the static `404.html`, which CloudFront serves for any unmatched
 * path — so the locale cannot come from a route param and is read from the URL
 * after mount instead. Japanese is the default, matching `/`.
 */
const useUrlLocale = (): Locale => {
  const [locale, setLocale] = useState<Locale>('ja')

  useEffect(() => {
    const segment = window.location.pathname.split('/').filter(Boolean)[0] ?? ''
    if (isLocale(segment)) setLocale(segment)
  }, [])

  return locale
}

export const NotFoundView = () => {
  const locale = useUrlLocale()
  const dictionary = getDictionary(locale)
  const tools = suggestions.map(findTool).filter((tool) => tool !== undefined)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Braces className="size-4" />
            </span>
            {dictionary.appName}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <p
            aria-hidden="true"
            className="font-mono text-7xl font-bold leading-none text-primary sm:text-8xl"
          >
            404
          </p>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {dictionary.notFoundTitle}
            </h1>
            <p className="mt-3 max-w-prose text-sm text-muted-foreground">
              {dictionary.notFoundDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href={`/${locale}`} />}
                className="h-9 px-3"
              >
                <Home className="size-4" />
                {dictionary.backToHome}
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="h-9 px-3">
                <ArrowLeft className="size-4" />
                {dictionary.goBack}
              </Button>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Compass className="size-3" />
            {dictionary.popularDestinations}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={getToolPath(locale, tool)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-border-strong hover:bg-muted"
                >
                  <span className="text-lg" aria-hidden="true">
                    {tool.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{tool.title[locale]}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {tool.description[locale]}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        {dictionary.appName} · {dictionary.footerNote}
      </footer>
    </div>
  )
}
