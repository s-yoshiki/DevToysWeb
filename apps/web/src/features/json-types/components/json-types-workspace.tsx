'use client'

import { Sparkles } from 'lucide-react'
import { useId } from 'react'
import { CodeEditor } from '@/components/code-editor'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorBanner, Pane, PaneGrid, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { type JsonTypeTarget, jsonTypeTargets } from '../functions/json-types'
import { useJsonTypes } from '../hooks/use-json-types'

const targetLabels: Record<JsonTypeTarget, string> = {
  typescript: 'TypeScript',
  go: 'Go',
  python: 'Python',
}

const targetLanguages: Record<JsonTypeTarget, string> = {
  typescript: 'typescript',
  go: 'go',
  python: 'python',
}

export const JsonTypesWorkspace = ({ tool }: WorkspaceProps) => {
  const fieldId = useId()
  const { dictionary } = useLocale()
  const t = useTranslate()
  const jsonTypes = useJsonTypes()

  return (
    <WorkspaceShell tool={tool} onClear={jsonTypes.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('出力言語', 'Output language')}
            </CardTitle>
            <SegmentedControl<JsonTypeTarget>
              value={jsonTypes.target}
              onChange={jsonTypes.setTarget}
              label={t('出力言語', 'Output language')}
              options={jsonTypeTargets.map((value) => ({ value, label: targetLabels[value] }))}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-end gap-4 border-b bg-muted/20 p-5">
            <div className="w-full max-w-64 space-y-2">
              <Label htmlFor={`${fieldId}-json-types-root`}>
                {t('ルート型名', 'Root type name')}
              </Label>
              <Input
                id={`${fieldId}-json-types-root`}
                value={jsonTypes.rootName}
                onChange={(event) => jsonTypes.setRootName(event.target.value)}
                placeholder="Root"
              />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {t(
                'ネストしたオブジェクトはキー名から命名され、配列の要素は単数形になります。',
                'Nested objects are named after their key; array element names are singularised.',
              )}
            </p>
          </div>
          {jsonTypes.error && (
            <ErrorBanner
              title={t('JSONを解析できません', 'Cannot parse JSON')}
              message={jsonTypes.error}
            />
          )}
          <PaneGrid>
            <Pane>
              <PaneHeader
                title={t('JSONサンプル', 'JSON sample')}
                actions={
                  <Button variant="ghost" size="sm" onClick={jsonTypes.loadSample}>
                    <Sparkles className="size-4" />
                    {t('サンプル', 'Sample')}
                  </Button>
                }
              />
              <CodeEditor
                value={jsonTypes.input}
                onChange={jsonTypes.setInput}
                language="json"
                ariaLabel={t('JSONサンプル', 'JSON sample')}
                placeholder={t('JSONを貼り付け…', 'Paste JSON…')}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={dictionary.output}
                actions={<CopyButton value={jsonTypes.output} />}
              />
              <CodeEditor
                readOnly
                value={jsonTypes.output}
                language={targetLanguages[jsonTypes.target]}
                ariaLabel={dictionary.output}
              />
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
