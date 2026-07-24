'use client'

import { CodeEditor } from '@/components/code-editor'
import { CopyButton } from '@/components/copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pane, PaneGrid, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
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
              <div className="min-h-80 flex-1 overflow-auto p-4">
                {regex.error ? (
                  <p className="font-mono text-sm text-destructive">{regex.error}</p>
                ) : regex.matches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('一致する箇所はありません', 'No matches')}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {regex.matches.map((m) => (
                      <li key={m.key} className="rounded-lg border border-border bg-muted/20 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {m.match}
                          </span>
                          <span className="shrink-0 font-mono text-xs text-muted-foreground">
                            index {m.index}
                          </span>
                        </div>
                        {m.groups.length > 0 && (
                          <dl className="mt-2 space-y-1 border-t border-border/60 pt-2">
                            {m.groups.map((group) => (
                              <div
                                key={group.name}
                                className="flex items-baseline justify-between gap-3 text-xs"
                              >
                                <dt className="shrink-0 font-mono text-muted-foreground">
                                  {group.name}
                                </dt>
                                <dd className="truncate font-mono">
                                  {group.value ?? (
                                    <span className="text-muted-foreground/60">undefined</span>
                                  )}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
