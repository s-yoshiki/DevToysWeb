'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CodeEditor } from '@/features/tools/components/code-editor'
import { CopyButton } from '@/features/tools/components/copy-button'
import { Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useRegex } from '../hooks/use-regex'

export const RegexWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const regex = useRegex()

  return (
    <WorkspaceShell tool={tool} onClear={regex.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {t('正規表現の設定', 'Expression settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 border-b bg-muted/20 p-5 sm:grid-cols-[1fr_10rem]">
            <div className="space-y-2">
              <Label htmlFor="regex-pattern">{t('パターン', 'Pattern')}</Label>
              <Input
                id="regex-pattern"
                value={regex.pattern}
                onChange={(event) => regex.setPattern(event.target.value)}
                className="font-mono"
                placeholder="(?<name>\\w+)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regex-flags">{t('フラグ', 'Flags')}</Label>
              <Input
                id="regex-flags"
                value={regex.flags}
                onChange={(event) => regex.setFlags(event.target.value)}
                className="font-mono"
                placeholder="gimu"
              />
            </div>
          </div>
          <PaneGrid className="min-h-[430px]">
            <Pane>
              <PaneHeader title={t('テスト文字列', 'Test text')} />
              <CodeEditor
                value={regex.input}
                onChange={(value) => regex.setInput(value)}
                ariaLabel={t('テスト文字列', 'Test text')}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={t(`一致結果 (${regex.matches.length})`, `Matches (${regex.matches.length})`)}
                actions={<CopyButton value={regex.output} />}
              />
              <CodeEditor readOnly value={regex.output} ariaLabel={t('一致結果', 'Matches')} />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
