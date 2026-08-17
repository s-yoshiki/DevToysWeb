import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/components/locale-provider'
import { contentPageLinks } from '@/features/content/domain/page-slugs'
import { AppHeader } from '@/features/navigation/components/app-header'
import { AppSidebar } from '@/features/navigation/components/app-sidebar'
import { getDictionary, isLocale, locales } from '@/i18n/dictionaries'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))
const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <div data-app-chrome="header">
        <AppHeader />
      </div>
      <div data-content-region className="flex min-h-[calc(100vh-var(--header-height))]">
        <div data-app-chrome="sidebar" className="contents">
          <AppSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <footer
            data-app-chrome="footer"
            className="border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6"
          >
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
              <nav aria-label={locale === 'ja' ? 'サイト情報' : 'Site information'}>
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {contentPageLinks.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={`/${locale}/${link.slug}/`}
                        className="transition-colors hover:text-foreground"
                      >
                        {dictionary.sitePages[link.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <p>
                {dictionary.appName} · {dictionary.footerNote}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </LocaleProvider>
  )
}

export default LocaleLayout
