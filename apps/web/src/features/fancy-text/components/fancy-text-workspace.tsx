'use client'

import { Type } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useFancyText } from '../hooks/use-fancy-text'

export const FancyTextWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const fancyText = useFancyText()

  return (
    <WorkspaceShell tool={tool} onClear={fancyText.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Type className="size-4 text-primary" />
              {t('変換したいテキスト', 'Text to decorate')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              value={fancyText.input}
              onChange={(event) => fancyText.setInput(event.target.value)}
              aria-label={t('変換したいテキスト', 'Text to decorate')}
              placeholder={fancyText.placeholder}
              className="min-h-24 resize-none rounded-none border-0 bg-transparent p-5 text-base shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">
                {t('装飾スタイル', 'Decorated styles')}
              </CardTitle>
              <div className="flex items-center gap-2">
                {fancyText.isPlaceholder && (
                  <Badge variant="secondary">{t('プレビュー', 'Preview')}</Badge>
                )}
                <CopyButton value={fancyText.allOutput} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 p-0">
            {fancyText.results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {result.name[locale]}
                  </p>
                  <p className="break-all text-lg leading-relaxed">{result.output}</p>
                </div>
                <CopyButton value={result.output} />
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs leading-5 text-muted-foreground">
          {t(
            '装飾文字はフォントではなく別のUnicode文字です。読み上げソフトでは正しく読まれず、検索にも一致しません。見出しや本文には使わないでください。',
            'These are different Unicode characters, not a font. Screen readers will not announce them correctly and search will not match them, so avoid using them for headings or body copy.',
          )}
        </p>
      </div>
    </WorkspaceShell>
  )
}
