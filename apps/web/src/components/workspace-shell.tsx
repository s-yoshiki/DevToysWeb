'use client'

import { Expand, Maximize2, Minimize2, RotateCcw, Shrink } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFullscreen } from '@/hooks/use-fullscreen'
import type { ToolDefinition } from '@/libs/domain/catalog'

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
  const { maximized, browserFullscreen, toggleMaximized, toggleBrowserFullscreen } = useFullscreen()
  const Icon = tool.icon
  return (
    <div data-workspace-shell className="mx-auto max-w-6xl px-3 py-4 sm:px-4 lg:px-6">
      <header className="mb-4 flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="secondary" className="mb-2 capitalize">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMaximized}
            aria-pressed={maximized}
            aria-label={maximized ? dictionary.restoreWorkspace : dictionary.maximizeWorkspace}
            title={maximized ? dictionary.restoreWorkspace : dictionary.maximizeWorkspace}
          >
            {maximized ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleBrowserFullscreen}
            aria-pressed={browserFullscreen}
            aria-label={
              browserFullscreen
                ? dictionary.exitBrowserFullscreen
                : dictionary.enterBrowserFullscreen
            }
            title={
              browserFullscreen
                ? dictionary.exitBrowserFullscreen
                : dictionary.enterBrowserFullscreen
            }
          >
            {browserFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}
          </Button>
          <Button variant="outline" onClick={onClear}>
            <RotateCcw className="size-4" />
            {dictionary.clear}
          </Button>
        </div>
      </header>
      {children}
    </div>
  )
}
