'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
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
            <pre className="whitespace-pre-wrap break-words rounded-xl border bg-muted/20 p-5 font-mono text-sm">
              {diff.changes.map((part, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff parts have no identity beyond their position
                  key={`${index}-${part.value}`}
                  className={
                    part.added
                      ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                      : part.removed
                        ? 'bg-red-500/25 text-red-700 line-through dark:text-red-300'
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
