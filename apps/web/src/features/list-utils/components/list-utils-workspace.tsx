'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/copy-button'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useListUtils } from '../hooks/use-list-utils'
import { ListOptionsPanel } from './list-options-panel'

export const ListUtilsWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const list = useListUtils()

  return (
    <WorkspaceShell tool={tool} onClear={list.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {t('整形オプション', 'Formatting options')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ListOptionsPanel options={list.options} update={list.update} />
          <PaneGrid>
            <Pane>
              <PaneHeader title={dictionary.input} />
              <CodeArea
                value={list.input}
                onChange={(event) => list.setInput(event.target.value)}
                aria-label={dictionary.input}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={`${dictionary.output} (${list.lineCount})`}
                actions={<CopyButton value={list.output} />}
              />
              <CodeArea readOnly value={list.output} aria-label={dictionary.output} />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
