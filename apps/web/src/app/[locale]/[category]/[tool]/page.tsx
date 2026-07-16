import { notFound } from 'next/navigation'
import { ToolWorkspace } from '@/features/tools/components/tool-workspace'
import { findToolByPath, tools } from '@/features/tools/domain/catalog'

export const generateStaticParams = () =>
  tools.map((tool) => ({ category: tool.category, tool: tool.pathSlug }))

const Page = async ({ params }: { params: Promise<{ category: string; tool: string }> }) => {
  const { category, tool: pathSlug } = await params
  const tool = findToolByPath(category, pathSlug)
  if (!tool) notFound()

  return <ToolWorkspace slug={tool.slug} />
}

export default Page
