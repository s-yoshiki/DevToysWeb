'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SelectorMode } from '@/features/selector/functions/selector'
import { CopyButton } from '@/features/tools/components/copy-button'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useSelector } from '../hooks/use-selector'

const modeOptions: { value: SelectorMode; label: string }[] = [
  { value: 'css', label: 'CSS' },
  { value: 'xpath', label: 'XPath' },
]

export const SelectorWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const selector = useSelector()

  return (
    <WorkspaceShell tool={tool} onClear={selector.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">{t('セレクタ', 'Selector')}</CardTitle>
            <SegmentedControl<SelectorMode>
              value={selector.mode}
              options={modeOptions}
              onChange={selector.changeMode}
              label={t('セレクタの種類', 'Selector type')}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="selector-input">
              {selector.mode === 'css' ? 'CSS selector' : 'XPath expression'}
            </Label>
            <Input
              id="selector-input"
              value={selector.selector}
              onChange={(event) => selector.setSelector(event.target.value)}
              className="mt-2 font-mono"
              placeholder={selector.mode === 'css' ? 'ul.links > li a' : '//a[@href]'}
            />
          </div>
          {selector.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {selector.error}
            </p>
          )}
          <PaneGrid className="min-h-[420px]">
            <Pane>
              <PaneHeader title="HTML" />
              <CodeArea
                value={selector.html}
                onChange={(event) => selector.setHtml(event.target.value)}
                aria-label="HTML"
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={t(
                  `一致結果 (${selector.matches.length})`,
                  `Matches (${selector.matches.length})`,
                )}
                actions={<CopyButton value={selector.output} />}
              />
              <CodeArea readOnly value={selector.output} aria-label={t('一致結果', 'Matches')} />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
