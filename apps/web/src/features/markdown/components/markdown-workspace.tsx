'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CopyButton } from '@/features/tools/components/copy-button'
import { CodeArea, Pane, PaneHeader } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useMarkdownPreview } from '../hooks/use-markdown-preview'

export const MarkdownWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const markdown = useMarkdownPreview()

  return (
    <WorkspaceShell tool={tool} onClear={markdown.clear}>
      <Card className="overflow-hidden border-border/70">
        <CardContent className="grid min-h-[520px] p-0 lg:grid-cols-2">
          <Pane>
            <PaneHeader title="Markdown" />
            <CodeArea
              value={markdown.input}
              onChange={(event) => markdown.setInput(event.target.value)}
              aria-label="Markdown"
              className="min-h-64"
            />
          </Pane>
          <Pane variant="result" className="bg-transparent">
            <PaneHeader
              title={t('プレビュー', 'Preview')}
              actions={<CopyButton value={markdown.html} />}
            />
            <article
              className="prose prose-neutral max-w-none flex-1 overflow-auto p-6 dark:prose-invert"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: useMarkdownPreview runs every string through DOMPurify
              dangerouslySetInnerHTML={{ __html: markdown.html }}
            />
          </Pane>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
