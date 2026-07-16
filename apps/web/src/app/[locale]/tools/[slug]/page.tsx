import { notFound } from 'next/navigation'
import { ToolWorkspace } from '@/features/tools/components/tool-workspace'
import { findTool, tools } from '@/features/tools/domain/catalog'

export const generateStaticParams = () => tools.map(({ slug }) => ({ slug }))
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const tool = findTool(slug)
  if (!tool) notFound()
  return <ToolWorkspace slug={tool.slug} />
}

export default Page
