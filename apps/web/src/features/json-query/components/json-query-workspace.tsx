'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ResultCard } from '@/features/tools/components/result-card'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { type JsonQueryMode, useJsonQuery } from '../hooks/use-json-query'

const modeOptions: { value: JsonQueryMode; label: string }[] = [
  { value: 'path', label: 'JSONPath' },
  { value: 'schema', label: 'JSON Schema' },
]

export const JsonQueryWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const jsonQuery = useJsonQuery()
  const queryLabel = jsonQuery.mode === 'path' ? 'JSONPath' : 'JSON Schema'

  return (
    <WorkspaceShell tool={tool} onClear={jsonQuery.clear}>
      <div className="space-y-4">
        <SegmentedControl
          value={jsonQuery.mode}
          options={modeOptions}
          onChange={jsonQuery.setMode}
          label={t('クエリの種類', 'Query type')}
        />
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="json-query-source">JSON</Label>
              <Textarea
                id="json-query-source"
                value={jsonQuery.json}
                onChange={(event) => jsonQuery.setJson(event.target.value)}
                className="min-h-64 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="json-query-expression">{queryLabel}</Label>
              {jsonQuery.mode === 'path' ? (
                <Input
                  id="json-query-expression"
                  value={jsonQuery.query}
                  onChange={(event) => jsonQuery.setQuery(event.target.value)}
                  className="font-mono"
                />
              ) : (
                <Textarea
                  id="json-query-expression"
                  value={jsonQuery.schema}
                  onChange={(event) => jsonQuery.setSchema(event.target.value)}
                  className="min-h-64 font-mono"
                />
              )}
            </div>
          </CardContent>
        </Card>
        <ResultCard title={t('結果', 'Result')} value={jsonQuery.value} error={jsonQuery.error} />
      </div>
    </WorkspaceShell>
  )
}
