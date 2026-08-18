'use client'

import { Search } from 'lucide-react'
import { useId } from 'react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import type { HttpStatusClass } from '../functions/http-status'
import { httpStatusClasses } from '../functions/http-status'
import { useHttpStatus } from '../hooks/use-http-status'

const classLabel = (
  statusClass: HttpStatusClass | 'all',
  t: (ja: string, en: string) => string,
) => {
  const labels: Record<HttpStatusClass | 'all', string> = {
    all: t('すべて', 'All'),
    '1xx': t('1xx 情報', '1xx Informational'),
    '2xx': t('2xx 成功', '2xx Success'),
    '3xx': t('3xx リダイレクト', '3xx Redirection'),
    '4xx': t('4xx クライアントエラー', '4xx Client error'),
    '5xx': t('5xx サーバーエラー', '5xx Server error'),
  }
  return labels[statusClass]
}

/** Colour carries the class at a glance; the badge text still names it. */
const classTone: Record<HttpStatusClass, string> = {
  '1xx': 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  '2xx': 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  '3xx': 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  '4xx': 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  '5xx': 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
}

export const HttpStatusWorkspace = ({ tool }: WorkspaceProps) => {
  const fieldId = useId()
  const { locale } = useLocale()
  const t = useTranslate()
  const httpStatus = useHttpStatus()

  return (
    <WorkspaceShell tool={tool} onClear={httpStatus.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('ステータスコード', 'Status codes')}
            </CardTitle>
            <SegmentedControl
              value={httpStatus.statusClass}
              onChange={httpStatus.setStatusClass}
              label={t('クラスで絞り込み', 'Filter by class')}
              options={httpStatusClasses.map((value) => ({
                value,
                label: value === 'all' ? t('すべて', 'All') : value,
              }))}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor={`${fieldId}-http-status-search`}>
              {t('コード・名称・説明で検索', 'Search by code, phrase, or description')}
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`${fieldId}-http-status-search`}
                value={httpStatus.query}
                onChange={(event) => httpStatus.setQuery(event.target.value)}
                placeholder={t('例：404、rate limit、RFC 9110', 'e.g. 404, rate limit, RFC 9110')}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {httpStatus.results.length} / {httpStatus.total} {t('件', 'matches')}
            </p>
            <Badge variant="secondary">{classLabel(httpStatus.statusClass, t)}</Badge>
          </div>

          {httpStatus.groups.map(([statusClass, statuses]) => (
            <section key={statusClass} className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {classLabel(statusClass, t)}
              </h2>
              <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
                {statuses.map((status) => (
                  <li
                    key={status.code}
                    className="flex items-start justify-between gap-4 bg-background px-4 py-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="flex min-w-0 gap-3">
                      <span
                        className={`mt-0.5 h-fit shrink-0 rounded-md border px-2 py-0.5 font-mono text-sm font-semibold ${classTone[statusClass]}`}
                      >
                        {status.code}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 font-medium">
                          {status.phrase}
                          {status.bodyless && (
                            <Badge variant="outline" className="font-normal">
                              {t('ボディなし', 'No body')}
                            </Badge>
                          )}
                          {status.deprecated && (
                            <Badge variant="outline" className="font-normal">
                              {t('非推奨', 'Deprecated')}
                            </Badge>
                          )}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {status.summary[locale]}
                        </p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {status.reference}
                        </p>
                      </div>
                    </div>
                    <CopyButton value={`${status.code} ${status.phrase}`} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {httpStatus.results.length === 0 && (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t(
                '一致するステータスコードがありません。検索語やクラスを変えてください。',
                'No matching status code. Try another query or class.',
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
