'use client'

import { Check, CircleAlert, LoaderCircle, Play, X } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorBanner } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { usePageReport } from '@/features/tools/hooks/use-page-report'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { auditSeo, type CheckLevel, countByLevel, scoreOf } from '../functions/seo-audit'

const levelIcon: Record<CheckLevel, React.ReactNode> = {
  pass: <Check className="size-4 text-success" />,
  warn: <CircleAlert className="size-4 text-warning" />,
  fail: <X className="size-4 text-destructive" />,
}

const groupOrder = ['basics', 'content', 'social', 'technical'] as const

export const SeoCheckWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { locale } = useLocale()
  const page = usePageReport('SEO check failed')

  const checks = page.report ? auditSeo(page.report) : []
  const totals = countByLevel(checks)
  const score = scoreOf(checks)

  const groupLabels = {
    basics: t('基本', 'Basics'),
    content: t('コンテンツ', 'Content'),
    social: t('シェア', 'Social'),
    technical: t('技術', 'Technical'),
  }

  return (
    <WorkspaceShell tool={tool} onClear={page.clear}>
      <div className="space-y-4">
        <Card className="border-border/70">
          <CardContent className="space-y-3 p-5">
            <Label htmlFor="seo-check-url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="seo-check-url"
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
                {t('診断', 'Audit')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                '1回のリクエストで取得できる範囲の基本的なオンページSEOを点検します。',
                'Checks the on-page SEO signals available from a single request.',
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
            <Card className="border-border/70">
              <CardContent className="flex flex-wrap items-center gap-6 p-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      'font-mono text-5xl font-semibold tabular-nums',
                      score >= 80
                        ? 'text-success'
                        : score >= 60
                          ? 'text-warning'
                          : 'text-destructive',
                    )}
                  >
                    {score}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {t(`合格 ${totals.pass}`, `${totals.pass} passed`)}
                  </Badge>
                  <Badge variant="outline">
                    {t(`要確認 ${totals.warn}`, `${totals.warn} warnings`)}
                  </Badge>
                  <Badge variant="destructive">
                    {t(`要修正 ${totals.fail}`, `${totals.fail} failed`)}
                  </Badge>
                </div>
                <p className="ml-auto min-w-0 break-all font-mono text-xs text-muted-foreground">
                  {page.report.http.finalUrl}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              {groupOrder.map((group) => {
                const entries = checks.filter((item) => item.group === group)
                return (
                  <Card key={group} className="overflow-hidden border-border/70">
                    <CardHeader className="border-b bg-muted/30 py-3">
                      <CardTitle className="text-sm">{groupLabels[group]}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {entries.map((item) => (
                          <li key={item.id} className="flex items-start gap-3 px-5 py-3">
                            <span className="mt-0.5 shrink-0">{levelIcon[item.level]}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{item.label[locale]}</p>
                              <p className="mt-0.5 break-words text-xs text-muted-foreground">
                                {item.detail}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </WorkspaceShell>
  )
}
