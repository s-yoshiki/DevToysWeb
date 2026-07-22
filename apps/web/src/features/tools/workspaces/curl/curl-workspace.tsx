'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { CopyButton } from '../../components/copy-button'
import { SegmentedControl } from '../../components/segmented-control'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '../../components/workspace-panes'
import { WorkspaceShell } from '../../components/workspace-shell'
import { type CurlTarget, curlTargets } from '../../domain/curl'
import type { WorkspaceProps } from '../types'
import { useCurlConverter } from './use-curl-converter'

const targetOptions = curlTargets.map((value) => ({ value, label: value }))

export const CurlWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const curl = useCurlConverter()

  return (
    <WorkspaceShell tool={tool} onClear={curl.clear}>
      <div className="space-y-4">
        <SegmentedControl<CurlTarget>
          value={curl.target}
          options={targetOptions}
          onChange={curl.setTarget}
          label={t('出力する言語', 'Output language')}
        />
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <PaneGrid className="min-h-[32rem]">
              <Pane>
                <PaneHeader title="cURL" />
                <CodeArea
                  value={curl.input}
                  onChange={(event) => curl.setInput(event.target.value)}
                  aria-label="cURL"
                  className="min-h-64"
                />
              </Pane>
              <Pane variant="result">
                <PaneHeader title={curl.target} actions={<CopyButton value={curl.value} />} />
                <CodeArea
                  readOnly
                  value={curl.value}
                  aria-label={curl.target}
                  className={`min-h-64 ${curl.error ? 'text-destructive' : ''}`}
                />
              </Pane>
            </PaneGrid>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          {t(
            '基本的なメソッド、ヘッダー、リクエストボディに対応します。',
            'Supports common methods, headers, and request bodies.',
          )}
        </p>
      </div>
    </WorkspaceShell>
  )
}
