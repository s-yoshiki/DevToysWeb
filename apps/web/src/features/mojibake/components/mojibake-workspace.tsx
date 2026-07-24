'use client'

import { Sparkles, Wand2 } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useMojibake } from '../hooks/use-mojibake'

export const MojibakeWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const mojibake = useMojibake()

  return (
    <WorkspaceShell tool={tool} onClear={mojibake.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">
                {t('文字化けした文字列', 'Garbled text')}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={mojibake.loadSample}>
                <Sparkles className="size-4" />
                {t('サンプル', 'Sample')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              value={mojibake.input}
              onChange={(event) => mojibake.setInput(event.target.value)}
              aria-label={t('文字化けした文字列', 'Garbled text')}
              placeholder={t('文字化けした文字列を貼り付け…', 'Paste garbled text…')}
              className="min-h-40 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

        {mojibake.best && (
          <Card className="overflow-hidden border-primary/40 bg-accent/30 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-primary/20 py-4">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wand2 className="size-4 text-primary" />
                {t('最有力の復元候補', 'Best restoration')}
                <span className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {mojibake.best.label}
                </span>
              </CardTitle>
              <CopyButton value={mojibake.best.text} />
            </CardHeader>
            <CardContent className="p-5">
              <p className="whitespace-pre-wrap break-words text-lg leading-relaxed">
                {mojibake.best.text}
              </p>
            </CardContent>
          </Card>
        )}

        {mojibake.input && mojibake.candidates.length === 0 && (
          <Card className="border-border/70">
            <CardContent className="p-5 text-sm text-muted-foreground">
              {t(
                '復元候補が見つかりませんでした。この方式で戻せる文字化けではない可能性があります（例: 元がUTF-8として不可逆に壊れている）。',
                'No restoration found. This may not be a byte-recoverable mojibake (e.g. the original bytes were irreversibly lost).',
              )}
            </CardContent>
          </Card>
        )}

        {mojibake.candidates.length > 1 && (
          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="border-b bg-muted/30 py-4">
              <CardTitle className="text-sm font-medium">
                {t('他の候補', 'Other candidates')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {mojibake.candidates.slice(1).map((candidate) => (
                <div
                  key={`${candidate.encoding}-${candidate.text}`}
                  className="flex items-start justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="mb-1 font-mono text-xs text-muted-foreground">
                      {candidate.label}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm">{candidate.text}</p>
                  </div>
                  <CopyButton value={candidate.text} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </WorkspaceShell>
  )
}
