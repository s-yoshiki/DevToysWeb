'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CodeEditor } from '@/components/code-editor'
import { CopyButton } from '@/components/copy-button'
import { Pane, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
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
            <CodeEditor
              value={markdown.input}
              onChange={(value) => markdown.setInput(value)}
              language="markdown"
              ariaLabel="Markdown"
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
