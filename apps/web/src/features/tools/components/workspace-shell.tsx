'use client'

import { RotateCcw } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ToolDefinition } from '../domain/catalog'

/**
 * Page frame shared by every workspace: category badge, tool identity and the
 * single reset affordance. Workspaces own what "clear" means for their state.
 */
export const WorkspaceShell = ({
  tool,
  onClear,
  children,
}: {
  tool: ToolDefinition
  onClear: () => void
  children: React.ReactNode
}) => {
  const { locale, dictionary } = useLocale()
  const Icon = tool.icon
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <Badge variant="secondary" className="mb-3 capitalize">
            {dictionary.categories[tool.category]}
          </Badge>
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
              aria-hidden="true"
            >
              <Icon className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{tool.title[locale]}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description[locale]}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClear}>
          <RotateCcw className="size-4" />
          {dictionary.clear}
        </Button>
      </header>
      {children}
    </div>
  )
}
