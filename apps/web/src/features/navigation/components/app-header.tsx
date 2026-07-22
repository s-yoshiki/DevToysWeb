'use client'

import { Braces, Languages, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GithubIcon } from '@/components/icons/github-icon'
import { useLocale } from '@/components/locale-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  categoryOrder as categories,
  type ToolDefinition,
  tools,
} from '@/features/tools/domain/catalog'
import { getToolPath, isSamePath } from '@/features/tools/domain/tool-path'
import { cn } from '@/lib/utils'
import { CommandPalette, useCommandPalette } from './command-palette'

/** Rendered after mount so the static export never ships a platform-specific hint. */
const useShortcutHint = () => {
  const [hint, setHint] = useState('')
  useEffect(() => {
    setHint(/mac|iphone|ipad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K')
  }, [])
  return hint
}

/**
 * Tool list for the mobile drawer. It mirrors the desktop sidebar's category
 * grouping — a flat list of every tool is unusable at this width — and closes
 * the drawer on selection so the destination is not left hidden behind it.
 */
const MobileNav = ({ onNavigate }: { onNavigate: () => void }) => {
  const { locale, dictionary } = useLocale()
  const pathname = usePathname()
  const isActive = (tool: ToolDefinition) => isSamePath(pathname, getToolPath(locale, tool))

  return (
    <nav className="space-y-5" aria-label={dictionary.mainNavigation}>
      {categories.map((category) => (
        <section key={category}>
          <h3 className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {dictionary.categories[category]}
          </h3>
          <ul>
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={getToolPath(locale, tool)}
                    onClick={onNavigate}
                    aria-current={isActive(tool) ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive(tool)
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span className="w-5 shrink-0 text-center text-base" aria-hidden="true">
                      {tool.emoji}
                    </span>
                    <span className="truncate">{tool.title[locale]}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}

export const AppHeader = () => {
  const { locale, dictionary } = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const palette = useCommandPalette()
  const shortcutHint = useShortcutHint()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleLocale = () =>
    router.push(pathname.replace(`/${locale}`, locale === 'ja' ? '/en' : '/ja'))

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      {/*
       * First tabbable element on the page: lets keyboard users jump past the
       * sidebar's ~60 tool links straight to the tool they opened.
       */}
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-50"
      >
        {dictionary.skipToContent}
      </a>

      <div className="flex h-14 items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={dictionary.openMenu}
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto p-5">
            <SheetTitle className="mb-5 flex items-center gap-2 font-bold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Braces className="size-4" />
              </span>
              {dictionary.appName}
            </SheetTitle>
            <MobileNav onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Braces className="size-4" />
          </span>
          {dictionary.appName}
        </Link>

        {/* Collapses to an icon-only square below `sm`; a full search field plus
            the header actions does not fit on a 375px viewport. */}
        <button
          type="button"
          onClick={() => palette.setOpen(true)}
          aria-label={dictionary.search}
          className="ml-2 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground sm:ml-4 sm:size-auto sm:h-9 sm:max-w-xs sm:flex-1 sm:justify-start sm:gap-2 sm:px-3 sm:text-sm"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden truncate sm:inline">{dictionary.search}</span>
          {shortcutHint && (
            <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              {shortcutHint}
            </kbd>
          )}
        </button>
        <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            aria-label={dictionary.switchLanguage}
          >
            <Languages className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline" aria-hidden="true">
              {locale === 'ja' ? 'EN' : '日本語'}
            </span>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={
              <a
                href="https://github.com/s-yoshiki/DevToysWeb"
                target="_blank"
                rel="noreferrer"
                aria-label={dictionary.githubRepository}
              />
            }
          >
            <GithubIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
