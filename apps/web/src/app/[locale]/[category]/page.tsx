import { notFound } from 'next/navigation'
import { ContentPage } from '@/features/content/components/content-page'
import { type ContentPageSlug, contentPageLinks } from '@/features/content/domain/page-slugs'
import { JsonLd } from '@/features/seo/components/json-ld'
import { contentPageMetadata } from '@/features/seo/domain/metadata'
import { contentPageJsonLd } from '@/features/seo/domain/structured-data'
import { isLocale } from '@/i18n/dictionaries'

type PageParams = { locale: string; category: string }

export const generateStaticParams = () =>
  contentPageLinks.map(({ slug: category }) => ({ category }))

const resolvePage = async (params: Promise<PageParams>) => {
  const { locale, category } = await params
  const link = contentPageLinks.find((entry) => entry.slug === category)
  if (!isLocale(locale) || !link) notFound()
  return { locale, slug: link.slug as ContentPageSlug }
}

export const generateMetadata = async ({ params }: { params: Promise<PageParams> }) => {
  const { locale, slug } = await resolvePage(params)
  return contentPageMetadata(slug, locale)
}

const Page = async ({ params }: { params: Promise<PageParams> }) => {
  const { locale, slug } = await resolvePage(params)

  return (
    <>
      <JsonLd data={[contentPageJsonLd(slug, locale)]} />
      <ContentPage locale={locale} slug={slug} />
    </>
  )
}

export default Page
