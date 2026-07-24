'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CodeEditor } from '@/features/tools/components/code-editor'
import { CopyButton } from '@/features/tools/components/copy-button'
import { Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { useGlob } from '../hooks/use-glob'

export const GlobWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const glob = useGlob()

  return (
    <WorkspaceShell tool={tool} onClear={glob.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('globパターン', 'Glob pattern')}
            </CardTitle>
            <fieldset
              className="flex gap-1 rounded-lg border bg-background p-1"
              aria-label={t('照合オプション', 'Matching options')}
            >
              <Button
                size="sm"
                variant={glob.options.dot ? 'default' : 'ghost'}
                onClick={() => glob.toggle({ dot: !glob.options.dot })}
                className="h-7 px-3"
              >
                {t('ドットも一致', 'Match dotfiles')}
              </Button>
              <Button
                size="sm"
                variant={glob.options.caseSensitive ? 'default' : 'ghost'}
                onClick={() => glob.toggle({ caseSensitive: !glob.options.caseSensitive })}
                className="h-7 px-3"
              >
                {t('大文字小文字を区別', 'Case sensitive')}
              </Button>
            </fieldset>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="glob-pattern">{t('パターン', 'Pattern')}</Label>
            <Input
              id="glob-pattern"
              value={glob.pattern}
              onChange={(event) => glob.setPattern(event.target.value)}
              className="mt-2 font-mono"
              placeholder="src/**/*.{ts,tsx}"
            />
          </div>
          {glob.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {glob.error}
            </p>
          )}
          <PaneGrid className="min-h-[420px]">
            <Pane>
              <PaneHeader title={t('テストするパス', 'Paths to test')} />
              <CodeEditor
                value={glob.paths}
                onChange={(value) => glob.setPaths(value)}
                ariaLabel={t('テストするパス', 'Paths to test')}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={t(
                  `一致 ${glob.matched.length} / ${glob.matches.length}`,
                  `${glob.matched.length} of ${glob.matches.length} matched`,
                )}
                actions={<CopyButton value={glob.matchedPaths} />}
              />
              <ul className="flex-1 overflow-y-auto p-3">
                {glob.matches.map((entry) => (
                  <li
                    key={entry.path}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm',
                      entry.matched ? 'text-foreground' : 'text-muted-foreground/60',
                    )}
                  >
                    {entry.matched ? (
                      <Check className="size-4 shrink-0 text-success" />
                    ) : (
                      <X className="size-4 shrink-0 opacity-40" />
                    )}
                    <span className="truncate">{entry.path}</span>
                  </li>
                ))}
              </ul>
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
