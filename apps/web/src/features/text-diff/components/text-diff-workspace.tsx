'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useTextDiff } from '../hooks/use-text-diff'

export const TextDiffWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const diff = useTextDiff()

  return (
    <WorkspaceShell tool={tool} onClear={diff.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <PaneGrid>
              <Pane>
                <PaneHeader title={t('変更前', 'Before')} />
                <CodeArea
                  value={diff.before}
                  onChange={(event) => diff.setBefore(event.target.value)}
                  aria-label={t('変更前', 'Before')}
                  className="min-h-64"
                />
              </Pane>
              <Pane variant="result" className="bg-transparent">
                <PaneHeader title={t('変更後', 'After')} />
                <CodeArea
                  value={diff.after}
                  onChange={(event) => diff.setAfter(event.target.value)}
                  aria-label={t('変更後', 'After')}
                  className="min-h-64"
                />
              </Pane>
            </PaneGrid>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 text-sm text-muted-foreground">
              {t(
                `${diff.additions}件の追加、${diff.deletions}件の削除`,
                `${diff.additions} additions, ${diff.deletions} deletions`,
              )}
            </div>
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-border bg-muted/40 p-5 font-mono text-sm">
              {diff.changes.map((part, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff parts have no identity beyond their position
                  key={`${index}-${part.value}`}
                  className={
                    part.added
                      ? 'bg-success/25 text-foreground underline decoration-success decoration-2'
                      : part.removed
                        ? 'bg-destructive/25 text-foreground line-through decoration-destructive decoration-2'
                        : ''
                  }
                >
                  {part.value}
                </span>
              ))}
            </pre>
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
