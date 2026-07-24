'use client'

import { CalendarClock, Info } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/copy-button'
import { ToggleRow } from '@/components/segmented-control'
import { ErrorBanner } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cronFieldValues } from '../functions/cron'
import { listTimeZones, useCron } from '../hooks/use-cron'
import { CronFieldBuilder } from './cron-field-builder'

const zoneListId = 'cron-timezone-options'

const presets = [
  { expression: '* * * * *', ja: '毎分', en: 'Every minute' },
  { expression: '*/5 * * * *', ja: '5分ごと', en: 'Every 5 minutes' },
  { expression: '0 * * * *', ja: '毎時0分', en: 'Hourly' },
  { expression: '0 9 * * 1-5', ja: '平日9時', en: 'Weekdays at 9' },
  { expression: '30 8 * * 1', ja: '毎週月曜 8:30', en: 'Mondays at 8:30' },
  { expression: '0 0 1 * *', ja: '毎月1日', en: 'Monthly' },
  { expression: '0 0 L * *', ja: '月末', en: 'Last day of month' },
  { expression: '@daily', ja: '@daily', en: '@daily' },
]

export const CronWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { locale } = useLocale()
  const cron = useCron()
  const { analysis } = cron

  return (
    <WorkspaceShell tool={tool} onClear={cron.clear}>
      <datalist id={zoneListId}>
        {listTimeZones().map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cron-expression">{t('Cron式', 'Cron expression')}</Label>
                <CopyButton value={cron.expression} />
              </div>
              <Input
                id="cron-expression"
                value={cron.expression}
                spellCheck={false}
                autoComplete="off"
                onChange={(event) => cron.setExpression(event.target.value)}
                className="h-12 font-mono text-lg tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cron-timezone">{t('タイムゾーン', 'Time zone')}</Label>
              <Input
                id="cron-timezone"
                list={zoneListId}
                value={cron.timezone}
                spellCheck={false}
                onChange={(event) => cron.setTimezone(event.target.value)}
                className="font-mono"
              />
            </div>
          </CardContent>
          <div className="flex flex-wrap gap-1.5 border-t border-border bg-muted/30 px-5 py-3">
            {presets.map((preset) => (
              <Button
                key={preset.expression}
                size="sm"
                variant={cron.expression === preset.expression ? 'secondary' : 'ghost'}
                className="h-7 px-2.5 text-xs"
                onClick={() => cron.setExpression(preset.expression)}
              >
                {t(preset.ja, preset.en)}
                <code className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                  {preset.expression}
                </code>
              </Button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden border-border/70">
          {cron.error && <ErrorBanner message={cron.error} />}
          <CardContent className="p-5">
            {analysis ? (
              <>
                <p className="text-lg font-medium leading-relaxed sm:text-xl">
                  {analysis.description[locale]}
                </p>
                {analysis.normalized !== cron.expression.trim() && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {t('展開後', 'Expands to')}: {analysis.normalized}
                  </p>
                )}
                {analysis.note && (
                  <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    {analysis.note[locale]}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t(
                  'Cron式を入力すると、その意味を文章で表示します。',
                  'Enter a cron expression to see what it means.',
                )}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden border-border/70">
            <CardHeader className="border-b bg-muted/30 py-3">
              <CardTitle className="text-sm">{t('フィールド', 'Fields')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {analysis ? (
                <ul className="divide-y">
                  {analysis.fields.map((field) => (
                    <li key={field.name} className="space-y-1 px-5 py-3">
                      <div className="flex items-start gap-2">
                        <span className="w-16 shrink-0 pt-0.5 text-xs text-muted-foreground">
                          {field.label[locale]}
                        </span>
                        <code className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs">
                          {field.token}
                        </code>
                        <span className="min-w-0 text-sm">{field.description[locale]}</span>
                      </div>
                      <p className="pl-18 font-mono text-[11px] text-muted-foreground">
                        {cronFieldValues(field, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/70">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarClock className="size-4" />
                {t('次回の実行日時', 'Next runs')}
              </CardTitle>
              <CopyButton value={cron.runs.map((run) => run.iso).join('\n')} />
            </CardHeader>
            {cron.scheduleError && (
              <ErrorBanner
                title={t(
                  'この記法の実行予定は計算できません',
                  'Upcoming runs are not available for this syntax',
                )}
                message={cron.scheduleError}
              />
            )}
            <CardContent className="p-0">
              {cron.runs.length ? (
                <ol className="divide-y">
                  {cron.runs.map((run) => (
                    <li
                      key={run.iso}
                      className="flex flex-wrap items-baseline justify-between gap-x-3 px-5 py-2.5"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-sm tabular-nums">{run.time}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{run.date}</span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{run.relative}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                  {cron.ready
                    ? t('実行予定はありません', 'No upcoming runs')
                    : t('計算中…', 'Calculating…')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">{t('ビルダー', 'Builder')}</CardTitle>
            <div className="w-40">
              <ToggleRow
                id="cron-seconds"
                label={t('秒フィールド', 'Seconds field')}
                checked={cron.hasSeconds}
                onChange={cron.toggleSeconds}
              />
            </div>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {cron.builder.map((field) => (
              <CronFieldBuilder key={field.name} field={field} onChange={cron.setField} />
            ))}
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
