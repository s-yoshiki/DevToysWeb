'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/features/tools/components/copy-button'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { type EscapeTarget, escapeTargets } from '@/features/tools/domain/text-tools'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useStringEscape } from '../hooks/use-string-escape'

const escapeLabels: Record<EscapeTarget, string> = {
  json: 'JSON',
  javascript: 'JavaScript',
  sql: 'SQL',
  regex: 'RegExp',
  shell: 'Shell',
  csv: 'CSV',
}

export const StringEscapeWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const escaper = useStringEscape()

  return (
    <WorkspaceShell tool={tool} onClear={escaper.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('エスケープ対象', 'Escape target')}
            </CardTitle>
            <SegmentedControl
              value={escaper.reverse ? 'unescape' : 'escape'}
              onChange={(value) => escaper.setReverse(value === 'unescape')}
              label={t('変換方向', 'Direction')}
              options={[
                { value: 'escape', label: t('エスケープ', 'Escape') },
                { value: 'unescape', label: t('解除', 'Unescape') },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <SegmentedControl<EscapeTarget>
              value={escaper.target}
              onChange={escaper.setTarget}
              label={t('エスケープ対象', 'Escape target')}
              options={escapeTargets.map((value) => ({ value, label: escapeLabels[value] }))}
            />
          </div>
          {escaper.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {escaper.error}
            </p>
          )}
          <PaneGrid>
            <Pane>
              <PaneHeader title={dictionary.input} />
              <CodeArea
                value={escaper.input}
                onChange={(event) => escaper.setInput(event.target.value)}
                aria-label={dictionary.input}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={dictionary.output}
                actions={<CopyButton value={escaper.output} />}
              />
              <CodeArea readOnly value={escaper.output} aria-label={dictionary.output} />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
