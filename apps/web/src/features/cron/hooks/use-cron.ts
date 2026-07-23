'use client'

import { CronExpressionParser } from 'cron-parser'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import type { CronFieldName } from '../functions/cron'
import { analyzeCron } from '../functions/cron'
import {
  type CronFieldSpec,
  readCronFieldSpec,
  readCronTokens,
  replaceCronToken,
  setCronSeconds,
  writeCronFieldSpec,
} from '../functions/cron-builder'

const defaultExpression = '*/15 9-17 * * 1-5'
const runCount = 10

export type CronRun = {
  iso: string
  date: string
  time: string
  relative: string
}

export type CronBuilderField = {
  name: CronFieldName
  token: string
  spec: CronFieldSpec
}

const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

/** Autocomplete suggestions only; an unknown zone is reported by the parser. */
export const listTimeZones = () => {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf?.('timeZone')
  return supported ?? ['UTC', 'Asia/Tokyo', 'America/Los_Angeles', 'Europe/London']
}

const message = (reason: unknown) =>
  reason instanceof Error ? reason.message : 'Invalid cron expression'

const relativeTo = (from: Date, to: Date, locale: string) => {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const seconds = Math.round((to.getTime() - from.getTime()) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 30],
    ['month', 12],
  ]
  let value = seconds
  for (const [unit, size] of units) {
    if (Math.abs(value) < size) return format.format(value, unit)
    value = Math.round(value / size)
  }
  return format.format(value, 'year')
}

/**
 * One expression drives everything on the page: the description, the field
 * table, the upcoming runs and the builder controls. `now` and the time zone
 * stay empty until mount, because the static export has neither.
 */
export const useCron = () => {
  const { locale } = useLocale()
  const [expression, setExpression] = useState(defaultExpression)
  const [timezone, setTimezone] = useState('')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setTimezone(localZone())
    setNow(new Date())
  }, [])

  const analysis = useMemo(() => {
    try {
      return { data: analyzeCron(expression), error: '' }
    } catch (reason) {
      return { data: null, error: message(reason) }
    }
  }, [expression])

  const schedule = useMemo(() => {
    if (!now || !timezone || !analysis.data) return { runs: [] as CronRun[], error: '' }
    try {
      const cron = CronExpressionParser.parse(expression, { tz: timezone, currentDate: now })
      const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: timezone })
      const timeFormat = new Intl.DateTimeFormat(locale, {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone,
      })
      const runs = cron.take(runCount).map((entry) => {
        const date = entry.toDate()
        return {
          iso: date.toISOString(),
          date: dateFormat.format(date),
          time: timeFormat.format(date),
          relative: relativeTo(now, date, locale),
        }
      })
      return { runs, error: '' }
    } catch (reason) {
      return { runs: [] as CronRun[], error: message(reason) }
    }
  }, [analysis.data, expression, locale, now, timezone])

  const builder = useMemo(() => {
    const { names, tokens } = readCronTokens(expression)
    return names.map((name, index) => ({
      name,
      token: tokens[index],
      spec: readCronFieldSpec(name, tokens[index]),
    })) satisfies CronBuilderField[]
  }, [expression])

  return {
    expression,
    setExpression,
    timezone,
    setTimezone,
    analysis: analysis.data,
    error: analysis.error,
    runs: schedule.runs,
    /** Set when the expression parses but no scheduler can preview its runs. */
    scheduleError: schedule.error,
    ready: now !== null,
    builder,
    hasSeconds: builder.length === 6,
    setField: (name: CronFieldName, spec: CronFieldSpec) =>
      setExpression((current) => replaceCronToken(current, name, writeCronFieldSpec(name, spec))),
    toggleSeconds: (enabled: boolean) =>
      setExpression((current) => setCronSeconds(current, enabled)),
    clear: () => setExpression(defaultExpression),
  }
}
