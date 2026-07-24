'use client'

import { Clock } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import {
  dayOfYear,
  isoWeek,
  localOffsetLabel,
  relativeTime,
  toLocalIso,
  weekday,
} from '../functions/unix-time'
import { useUnixTime } from '../hooks/use-unix-time'

export const UnixTimeWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const unix = useUnixTime()
  const { date } = unix

  const ms = date.getTime()
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: t('Unix秒', 'Unix seconds'), value: String(Math.floor(ms / 1000)) },
    { label: t('Unixミリ秒', 'Unix milliseconds'), value: String(ms) },
    { label: 'ISO 8601 (UTC)', value: date.toISOString() },
    { label: t('ISO 8601 (ローカル)', 'ISO 8601 (local)'), value: toLocalIso(date) },
    { label: t('UTC 表記', 'UTC string'), value: date.toUTCString() },
    {
      label: t('ローカル日時', 'Local time'),
      value: date.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US'),
    },
    { label: t('曜日', 'Weekday'), value: weekday(date, locale), mono: false },
    { label: t('通算日', 'Day of year'), value: String(dayOfYear(date)) },
    { label: t('ISO週番号', 'ISO week'), value: String(isoWeek(date)) },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={unix.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">
                {t('タイムスタンプ / 日時', 'Timestamp / date')}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={unix.setNow}>
                <Clock className="size-4" />
                {t('現在時刻', 'Now')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-5">
            <Label htmlFor="unix-input">
              {t('Unix time または日時文字列', 'Unix time or a date string')}
            </Label>
            <Input
              id="unix-input"
              value={unix.input}
              onChange={(event) => unix.setInput(event.target.value)}
              className="font-mono text-base"
              placeholder={t(
                '1784170800 / 2026-07-16T12:00:00+09:00',
                '1784170800 / 2026-07-16T12:00:00Z',
              )}
            />
            <p className="text-xs text-muted-foreground">
              {unix.invalid ? (
                <span className="text-destructive">
                  {t('日時として解釈できません', 'Could not parse this as a date')}
                </span>
              ) : unix.showingNow ? (
                t(
                  '入力が空のため現在時刻を表示中（毎秒更新）',
                  'Showing the current time (updates every second)',
                )
              ) : (
                interpretationLabel(unix.parsed?.interpretation, t)
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/30 bg-accent/20 shadow-xl shadow-foreground/[0.03]">
          <CardContent className="p-5 text-center">
            <p className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {date.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {localOffsetLabel(date)} · {relativeTime(date, locale === 'ja' ? 'ja-JP' : 'en-US')}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardContent className="grid gap-px bg-border/60 p-0">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 bg-card px-5 py-2.5"
              >
                <span className="shrink-0 text-sm text-muted-foreground">{row.label}</span>
                <div className="flex min-w-0 items-center gap-1">
                  <span
                    className={
                      row.mono === false ? 'truncate text-sm' : 'truncate font-mono text-sm'
                    }
                  >
                    {row.value}
                  </span>
                  <CopyButton value={row.value} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}

const interpretationLabel = (
  interpretation: 'seconds' | 'milliseconds' | 'date-string' | undefined,
  t: (ja: string, en: string) => string,
) => {
  switch (interpretation) {
    case 'seconds':
      return t('Unix秒として解釈', 'Interpreted as Unix seconds')
    case 'milliseconds':
      return t('Unixミリ秒として解釈', 'Interpreted as Unix milliseconds')
    case 'date-string':
      return t('日時文字列として解釈', 'Interpreted as a date string')
    default:
      return ''
  }
}
