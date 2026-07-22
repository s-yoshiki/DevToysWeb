'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { CopyButton } from '../../components/copy-button'
import { CodeArea, Pane, PaneHeader } from '../../components/workspace-panes'
import { WorkspaceShell } from '../../components/workspace-shell'
import type { WorkspaceProps } from '../types'
import { useUrlParser } from './use-url-parser'

export const UrlParserWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const parser = useUrlParser()

  return (
    <WorkspaceShell tool={tool} onClear={parser.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">{t('URLを解析', 'Parse URL')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="url-input">URL</Label>
            <Input
              id="url-input"
              value={parser.input}
              onChange={(event) => parser.setInput(event.target.value)}
              className="mt-2 font-mono"
              placeholder="https://example.com/path?key=value#hash"
            />
          </div>
          <Pane variant="result" className="min-h-[430px]">
            <PaneHeader
              title={t('解析結果', 'Parsed components')}
              actions={<CopyButton value={parser.output} />}
            />
            <CodeArea
              readOnly
              value={parser.output}
              aria-label={t('解析結果', 'Parsed components')}
              className={parser.error ? 'min-h-80 text-destructive' : 'min-h-80'}
            />
          </Pane>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
