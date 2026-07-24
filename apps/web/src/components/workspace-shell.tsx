'use client'

import { Expand, Maximize2, Minimize2, RotateCcw, Shrink } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WorkspaceGuide } from '@/components/workspace-guide'
import { useFullscreen } from '@/hooks/use-fullscreen'
import type { ToolDefinition } from '@/libs/domain/catalog'
import { cn } from '@/libs/utils'

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
      <header
        className={cn(
          'flex flex-col justify-between gap-3 border-b border-border sm:flex-row sm:items-end',
          // Maximized mode trades the tool identity's presence for working space:
          // a tighter frame, a smaller icon and title, and no description.
          maximized ? 'mb-2 pb-2' : 'mb-4 pb-4',
        )}
      >
        <div>
          {!maximized && (
            <Badge variant="secondary" className="mb-2 capitalize">
              {dictionary.categories[tool.category]}
            </Badge>
          )}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex shrink-0 items-center justify-center rounded-xl bg-accent text-primary',
                maximized ? 'size-8' : 'size-11',
              )}
              aria-hidden="true"
            >
              <Icon className={maximized ? 'size-4' : 'size-5'} />
            </div>
            <div>
              <h1
                className={cn(
                  'font-bold tracking-tight',
                  maximized ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl',
                )}
              >
                {tool.title[locale]}
              </h1>
              {!maximized && (
                <p className="mt-1 text-sm text-muted-foreground">{tool.description[locale]}</p>
              )}
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
      {!maximized && <WorkspaceGuide tool={tool} />}
    </div>
  )
}
