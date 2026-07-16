import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/features/i18n/components/locale-provider'
import { getDictionary, isLocale, locales } from '@/features/i18n/domain/dictionaries'
import { AppHeader } from '@/features/navigation/components/app-header'
import { AppSidebar } from '@/features/navigation/components/app-sidebar'

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
  return (
    <LocaleProvider locale={locale} dictionary={getDictionary(locale)}>
      <AppHeader />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AppSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        DevToys · Built for focus
      </footer>
    </LocaleProvider>
  )
}

export default LocaleLayout
