'use client'

import { Check, ImageOff, LoaderCircle, Minus, Play, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/copy-button'
import { ErrorBanner } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import { usePageReport } from '@/hooks/use-page-report'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import {
  cardFields,
  type OgpField,
  openGraphFields,
  resolveAgainst,
  sharePreview,
} from '../functions/ogp'

const statusIcon = {
  ok: <Check className="size-3.5 text-success" />,
  missing: <X className="size-3.5 text-destructive" />,
  optional: <Minus className="size-3.5 text-muted-foreground" />,
}

const FieldTable = ({ title, fields }: { title: string; fields: OgpField[] }) => (
  <Card className="overflow-hidden border-border/70">
    <CardHeader className="border-b bg-muted/30 py-3">
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <ul className="divide-y">
        {fields.map((field) => (
          <li key={field.key} className="flex items-start gap-3 px-5 py-2.5">
            <span className="mt-1 shrink-0">{statusIcon[field.status]}</span>
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
              {field.key}
            </span>
            <span
              className={cn(
                'min-w-0 flex-1 break-words text-sm',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ?? (field.required ? '—' : '')}
            </span>
            {field.value && <CopyButton value={field.value} />}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

export const OgpCheckWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const page = usePageReport('OGP check failed')

  const metadata = page.report?.page ?? {}
  const preview = sharePreview(metadata)
  const base = page.report?.http.finalUrl ?? page.report?.target ?? ''
  const imageUrl = resolveAgainst(preview.image, base)
  const missing = openGraphFields(metadata).filter((field) => field.status === 'missing')
  const hostname = URL.canParse(base) ? new URL(base).hostname : base

  return (
    <WorkspaceShell tool={tool} onClear={page.clear}>
      <div className="space-y-4">
        <Card className="border-border/70">
          <CardContent className="space-y-3 p-5">
            <Label htmlFor="ogp-check-url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="ogp-check-url"
                value={page.url}
                spellCheck={false}
                onChange={(event) => page.setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') page.run()
                }}
              />
              <Button onClick={page.run} disabled={page.loading || !page.url.trim()}>
                {page.loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {t('確認', 'Check')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                'OGPとX Cardのタグを取得し、SNSでの見え方を再現します。',
                'Fetches the Open Graph and X Card tags and reproduces how the page will look when shared.',
              )}
            </p>
          </CardContent>
        </Card>

        {page.error && (
          <Card className="overflow-hidden border-border/70">
            <ErrorBanner message={page.error} />
          </Card>
        )}

        {page.report && (
          <>
            <Card className="overflow-hidden border-border/70">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/30 py-3">
                <CardTitle className="text-sm">{t('シェアプレビュー', 'Share preview')}</CardTitle>
                {missing.length ? (
                  <Badge variant="destructive">
                    {t(
                      `必須タグ ${missing.length}件が未設定`,
                      `${missing.length} required tag(s) missing`,
                    )}
                  </Badge>
                ) : (
                  <Badge>{t('必須タグはすべて設定済み', 'All required tags present')}</Badge>
                )}
              </CardHeader>
              <CardContent className="p-5">
                <div className="mx-auto max-w-xl overflow-hidden rounded-xl border bg-card">
                  <div className="flex aspect-[1.91/1] items-center justify-center bg-muted/40">
                    {imageUrl ? (
                      // biome-ignore lint/performance/noImgElement: the preview must load a remote image exactly as a scraper would
                      <img
                        src={imageUrl}
                        alt={metadata['og:image:alt'] ?? ''}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                        <ImageOff className="size-6" />
                        {t('og:imageが未設定です', 'No og:image set')}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 border-t p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {preview.siteName ?? hostname}
                    </p>
                    <p className="font-semibold leading-snug">
                      {preview.title ?? t('（タイトルなし）', '(no title)')}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {preview.description ?? t('（説明なし）', '(no description)')}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {t('カード種別', 'Card type')}: {preview.card ?? '—'}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <FieldTable title="Open Graph" fields={openGraphFields(metadata)} />
              <FieldTable title="X (Twitter) Card" fields={cardFields(metadata)} />
            </div>
          </>
        )}
      </div>
    </WorkspaceShell>
  )
}
