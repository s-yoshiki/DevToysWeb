'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  CodeArea,
  ErrorBanner,
  Pane,
  PaneHeader,
} from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useMermaid } from '../hooks/use-mermaid'

export const MermaidWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const mermaid = useMermaid()

  return (
    <WorkspaceShell tool={tool} onClear={mermaid.clear}>
      <Card className="overflow-hidden border-border/70">
        <CardContent className="grid min-h-[520px] p-0 lg:grid-cols-2">
          <Pane>
            <PaneHeader title="Mermaid" />
            <CodeArea
              value={mermaid.input}
              onChange={(event) => mermaid.setInput(event.target.value)}
              aria-label={t('Mermaidコード', 'Mermaid code')}
              spellCheck={false}
              className="min-h-64"
            />
          </Pane>
          <Pane variant="result" className="bg-transparent">
            <PaneHeader title={t('プレビュー', 'Preview')} />
            {mermaid.error && (
              <ErrorBanner title={t('構文エラー', 'Syntax error')} message={mermaid.error} />
            )}
            <div
              className="flex min-h-64 flex-1 items-center justify-center overflow-auto p-6 [&_svg]:h-auto [&_svg]:max-w-full"
              aria-live="polite"
            >
              {mermaid.svg ? (
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid uses strict security mode for generated SVG
                  dangerouslySetInnerHTML={{ __html: mermaid.svg }}
                />
              ) : (
                !mermaid.error && (
                  <p className="text-sm text-muted-foreground">
                    {t('コードを入力するとプレビューが表示されます', 'Enter code to see a preview')}
                  </p>
                )
              )}
            </div>
          </Pane>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
