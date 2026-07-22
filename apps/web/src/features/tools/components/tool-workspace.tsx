'use client'

import { useEffect } from 'react'
import { findTool } from '../domain/catalog'
import { recordToolVisit } from '../hooks/use-recent-tools'
import { workspaces } from '../workspaces/registry'

/** Resolves a catalog slug to the workspace that renders it. */
export const ToolWorkspace = ({ slug }: { slug: string }) => {
  useEffect(() => recordToolVisit(slug), [slug])

  const tool = findTool(slug)
  if (!tool) return null

  const Workspace = workspaces[tool.workspace ?? 'default']
  return <Workspace tool={tool} />
}
