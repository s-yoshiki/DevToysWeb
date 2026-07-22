'use client'

import { CronExpressionParser } from 'cron-parser'
import { useMemo, useState } from 'react'

const previewCount = 8

export const useCronSchedule = () => {
  const [expression, setExpression] = useState('*/15 9-17 * * 1-5')
  const [timezone, setTimezone] = useState('Asia/Tokyo')

  const result = useMemo(() => {
    try {
      const cron = CronExpressionParser.parse(expression, { tz: timezone })
      return {
        value: Array.from({ length: previewCount }, () => cron.next().toISOString()).join('\n'),
        error: false,
      }
    } catch (reason) {
      return {
        value: reason instanceof Error ? reason.message : 'Invalid cron expression',
        error: true,
      }
    }
  }, [expression, timezone])

  return {
    expression,
    setExpression,
    timezone,
    setTimezone,
    ...result,
    clear: () => setExpression(''),
  }
}
