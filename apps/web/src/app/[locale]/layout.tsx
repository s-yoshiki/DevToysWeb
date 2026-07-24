import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/components/locale-provider'
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
            className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground"
          >
            {dictionary.appName} · {dictionary.footerNote}
          </footer>
        </div>
      </div>
    </LocaleProvider>
  )
}

export default LocaleLayout
