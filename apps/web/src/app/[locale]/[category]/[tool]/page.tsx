import { notFound } from 'next/navigation'
import { JsonLd } from '@/features/seo/components/json-ld'
import { toolMetadata } from '@/features/seo/domain/metadata'
import { breadcrumbJsonLd, toolJsonLd } from '@/features/seo/domain/structured-data'
import { ToolWorkspace } from '@/features/tools/components/tool-workspace'
import { findToolByPath, tools } from '@/features/tools/domain/catalog'
import { isLocale } from '@/i18n/dictionaries'

type PageParams = { locale: string; category: string; tool: string }

export const generateStaticParams = () =>
  tools.map((tool) => ({ category: tool.category, tool: tool.pathSlug }))

const resolveTool = async (params: Promise<PageParams>) => {
  const { locale, category, tool: pathSlug } = await params
  const tool = findToolByPath(category, pathSlug)
  if (!isLocale(locale) || !tool) notFound()
  return { locale, tool }
}

export const generateMetadata = async ({ params }: { params: Promise<PageParams> }) => {
  const { locale, tool } = await resolveTool(params)
  return toolMetadata(tool, locale)
}

const Page = async ({ params }: { params: Promise<PageParams> }) => {
  const { locale, tool } = await resolveTool(params)

  return (
    <>
      <JsonLd data={[toolJsonLd(tool, locale), breadcrumbJsonLd(tool, locale)]} />
      <ToolWorkspace slug={tool.slug} />
    </>
  )
}

export default Page
