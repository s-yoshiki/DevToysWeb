import { notFound } from 'next/navigation'
import { JsonLd } from '@/features/seo/components/json-ld'
import { homeMetadata } from '@/features/seo/domain/metadata'
import { toolListJsonLd, websiteJsonLd } from '@/features/seo/domain/structured-data'
import { ToolDashboard } from '@/features/tools/components/tool-dashboard'
import { isLocale } from '@/i18n/dictionaries'

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return homeMetadata(locale)
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <>
      <JsonLd data={[websiteJsonLd(locale), toolListJsonLd(locale)]} />
      <ToolDashboard />
    </>
  )
}

export default Page
