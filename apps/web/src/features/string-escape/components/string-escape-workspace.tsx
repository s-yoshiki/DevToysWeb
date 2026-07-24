'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeEditor } from '@/features/tools/components/code-editor'
import { languageForFormat } from '@/features/tools/components/code-editor-language'
import { CopyButton } from '@/features/tools/components/copy-button'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
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
              <CodeEditor
                value={escaper.input}
                onChange={(value) => escaper.setInput(value)}
                language={escaper.reverse ? languageForFormat(escaper.target) : 'plaintext'}
                ariaLabel={dictionary.input}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={dictionary.output}
                actions={<CopyButton value={escaper.output} />}
              />
              <CodeEditor
                readOnly
                value={escaper.output}
                language={escaper.reverse ? 'plaintext' : languageForFormat(escaper.target)}
                ariaLabel={dictionary.output}
              />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
