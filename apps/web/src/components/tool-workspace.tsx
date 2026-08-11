'use client'

import { useEffect } from 'react'
import { recordToolVisit } from '@/hooks/use-recent-tools'
import { findTool } from '@/libs/domain/catalog'
import { workspaces } from '@/workspaces/registry'

/** Resolves a catalog slug to the workspace that renders it. */
export const ToolWorkspace = ({ slug }: { slug: string }) => {
  useEffect(() => recordToolVisit(slug), [slug])

  const tool = findTool(slug)
  if (!tool) return null

  const Workspace = workspaces[tool.workspace ?? 'default']
  return <Workspace tool={tool} />
}
