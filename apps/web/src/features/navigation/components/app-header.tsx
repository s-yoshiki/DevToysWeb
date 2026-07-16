'use client'

import { Braces, ExternalLink, Languages, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { ThemeToggle } from '@/features/theme/components/theme-toggle'
import { tools } from '@/features/tools/domain/catalog'
import { getToolPath } from '@/features/tools/domain/tool-path'

export const AppHeader = () => {
  const { locale, dictionary } = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const toggleLocale = () =>
    router.push(pathname.replace(`/${locale}`, locale === 'ja' ? '/en' : '/ja'))
  const nav = (
    <nav className="space-y-1">
      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <Link
            key={tool.slug}
            href={getToolPath(locale, tool)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
            {tool.title[locale]}
          </Link>
        )
      })}
    </nav>
  )
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto p-5">
            <Link href={`/${locale}`} className="mb-6 flex items-center gap-2 font-bold">
              <Braces className="size-5 text-primary" />
              {dictionary.appName}
            </Link>
            {nav}
          </SheetContent>
        </Sheet>
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Braces className="size-4" />
          </span>
          {dictionary.appName}
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleLocale}>
            <Languages className="size-4" />
            {locale === 'ja' ? 'EN' : '日本語'}
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
                aria-label="GitHub"
              />
            }
          >
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
