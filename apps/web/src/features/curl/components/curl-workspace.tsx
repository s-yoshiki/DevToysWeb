'use client'

import { Card, CardContent } from '@/components/ui/card'
import { type CurlTarget, curlTargets } from '@/features/curl/functions/curl'
import { CodeEditor } from '@/features/tools/components/code-editor'
import { languageForFormat } from '@/features/tools/components/code-editor-language'
import { CopyButton } from '@/features/tools/components/copy-button'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { Pane, PaneGrid, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useCurlConverter } from '../hooks/use-curl-converter'

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
                <CodeEditor
                  value={curl.input}
                  onChange={(value) => curl.setInput(value)}
                  language="shell"
                  ariaLabel="cURL"
                  className="min-h-64"
                />
              </Pane>
              <Pane variant="result">
                <PaneHeader title={curl.target} actions={<CopyButton value={curl.value} />} />
                <CodeEditor
                  readOnly
                  value={curl.value}
                  language={languageForFormat(curl.target)}
                  ariaLabel={curl.target}
                  className="min-h-64"
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
