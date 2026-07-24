'use client'

import { ArrowRight, CalendarClock } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { type DurationParts, dayOfYear, formatLong, isoWeekNumber } from '../functions/date-calc'
import { type DateCalcMode, useDateCalc } from '../hooks/use-date-calc'

export const DateCalcWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const calc = useDateCalc()

  return (
    <WorkspaceShell tool={tool} onClear={calc.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('日付計算', 'Date calculation')}
            </CardTitle>
            <SegmentedControl<DateCalcMode>
              value={calc.mode}
              onChange={calc.setMode}
              label={t('モード', 'Mode')}
              options={[
                { value: 'difference', label: t('期間・年齢', 'Duration & age') },
                { value: 'add', label: t('加算・減算', 'Add & subtract') },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {calc.mode === 'difference' ? (
            <DifferenceView calc={calc} locale={locale} t={t} />
          ) : (
            <AddView calc={calc} locale={locale} t={t} />
          )}
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}

type Calc = ReturnType<typeof useDateCalc>
type T = (ja: string, en: string) => string

const DifferenceView = ({ calc, locale, t }: { calc: Calc; locale: 'ja' | 'en'; t: T }) => {
  const diff = calc.difference?.result

  return (
    <div>
      <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date-from">{t('開始日時', 'From')}</Label>
          <Input
            id="date-from"
            type="datetime-local"
            value={calc.from}
            onChange={(event) => calc.setFrom(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="date-to">{t('終了日時', 'To')}</Label>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={calc.setToNow}>
              {t('現在', 'Now')}
            </Button>
          </div>
          <Input
            id="date-to"
            type="datetime-local"
            value={calc.to}
            onChange={(event) => calc.setTo(event.target.value)}
          />
        </div>
      </div>
      {diff ? (
        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-border bg-accent/40 p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {diff.direction < 0 ? t('過去', 'In the past') : t('期間', 'Duration')}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {formatBreakdown(diff, locale, t)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label={t('合計日数', 'Total days')} value={diff.totalDays.toLocaleString()} />
            <Stat label={t('合計週数', 'Total weeks')} value={diff.totalWeeks.toLocaleString()} />
            <Stat label={t('平日数', 'Weekdays')} value={diff.businessDays.toLocaleString()} />
            <Stat label={t('合計時間', 'Total hours')} value={diff.totalHours.toLocaleString()} />
            <Stat label={t('合計分', 'Total minutes')} value={diff.totalMinutes.toLocaleString()} />
            <Stat label={t('合計秒', 'Total seconds')} value={diff.totalSeconds.toLocaleString()} />
          </div>
        </div>
      ) : (
        <p className="p-5 text-sm text-destructive">{t('日時が不正です', 'Invalid date input')}</p>
      )}
    </div>
  )
}

const AddView = ({ calc, locale, t }: { calc: Calc; locale: 'ja' | 'en'; t: T }) => {
  const fields: { key: keyof DurationParts; label: string }[] = [
    { key: 'years', label: t('年', 'Years') },
    { key: 'months', label: t('月', 'Months') },
    { key: 'weeks', label: t('週', 'Weeks') },
    { key: 'days', label: t('日', 'Days') },
    { key: 'hours', label: t('時', 'Hours') },
    { key: 'minutes', label: t('分', 'Minutes') },
  ]
  const added = calc.added
  const result = added?.result

  return (
    <div>
      <div className="space-y-5 border-b bg-muted/20 p-5">
        <div className="space-y-2 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Label htmlFor="date-base">{t('基準日時', 'Base date')}</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={calc.setBaseNow}
            >
              {t('現在', 'Now')}
            </Button>
          </div>
          <Input
            id="date-base"
            type="datetime-local"
            value={calc.base}
            onChange={(event) => calc.setBase(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('演算', 'Operation')}</Label>
          <SegmentedControl<'1' | '-1'>
            value={calc.sign === 1 ? '1' : '-1'}
            onChange={(value) => calc.setSign(value === '1' ? 1 : -1)}
            label={t('演算', 'Operation')}
            options={[
              { value: '1', label: t('加算 (+)', 'Add (+)') },
              { value: '-1', label: t('減算 (−)', 'Subtract (−)') },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={`dur-${field.key}`} className="text-xs">
                {field.label}
              </Label>
              <Input
                id={`dur-${field.key}`}
                type="number"
                value={calc.duration[field.key]}
                onChange={(event) => calc.setDurationField(field.key, Number(event.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
      {result && added ? (
        <div className="p-5">
          <div className="rounded-xl border border-border bg-accent/40 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <CalendarClock className="size-4" />
              {t('結果', 'Result')}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xl font-bold tracking-tight sm:text-2xl">
                {formatLong(result, locale)}
              </p>
              <CopyButton value={formatLong(result, locale)} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{formatLong(added.baseDate, locale)}</span>
              <ArrowRight className="size-4" />
              <span className="font-mono text-foreground">{formatLong(result, locale)}</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={t('曜日', 'Weekday')} value={formatLong(result, locale).slice(-2, -1)} />
            <Stat label={t('通算日', 'Day of year')} value={String(dayOfYear(result))} />
            <Stat label={t('週番号', 'ISO week')} value={String(isoWeekNumber(result))} />
            <Stat label="Unix" value={String(Math.floor(result.getTime() / 1000))} />
          </div>
        </div>
      ) : (
        <p className="p-5 text-sm text-destructive">{t('日時が不正です', 'Invalid date input')}</p>
      )}
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{value}</p>
  </div>
)

const formatBreakdown = (
  diff: NonNullable<Calc['difference']>['result'],
  locale: 'ja' | 'en',
  t: T,
) => {
  if (diff.direction === 0) return t('同じ日時', 'Same moment')
  const units =
    locale === 'ja'
      ? [
          [diff.years, '年'],
          [diff.months, 'か月'],
          [diff.days, '日'],
        ]
      : [
          [diff.years, diff.years === 1 ? ' year' : ' years'],
          [diff.months, diff.months === 1 ? ' month' : ' months'],
          [diff.days, diff.days === 1 ? ' day' : ' days'],
        ]
  const parts = units.filter(([value]) => (value as number) !== 0)
  const shown = parts.length > 0 ? parts : [units[units.length - 1]]
  return shown.map(([value, unit]) => `${value}${unit}`).join(locale === 'ja' ? '' : ', ')
}
