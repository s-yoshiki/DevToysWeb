import { type CronFieldName, cronFieldSpec, fiveFieldNames, sixFieldNames } from './cron'

/**
 * The builder never keeps state of its own: every control reads its position
 * from the current expression and writes a replacement token back. That keeps
 * typing in the text field and clicking in the builder from drifting apart.
 */

export type CronFieldMode = 'every' | 'specific' | 'step' | 'range' | 'list' | 'blank' | 'advanced'

export type CronFieldSpec = {
  mode: CronFieldMode
  /** Selected value for `specific`, or the comma-separated set for `list`. */
  value: string
  from: string
  to: string
  step: string
  /** Raw token, shown verbatim for syntax the mode buttons cannot express. */
  raw: string
}

const emptySpec: CronFieldSpec = { mode: 'every', value: '', from: '', to: '', step: '', raw: '' }

/** Plain values only: `L`, `W` and `#` tokens belong to the advanced mode. */
const isValue = (name: CronFieldName, text: string) =>
  /^\d+$/.test(text) || (cronFieldSpec(name).names?.includes(text.toUpperCase()) ?? false)

export const readCronFieldSpec = (name: CronFieldName, token: string): CronFieldSpec => {
  const spec = cronFieldSpec(name)
  const base = { ...emptySpec, raw: token }

  if (token === '*') return { ...base, mode: 'every' }
  if (token === '?') return { ...base, mode: 'blank' }

  const wholeStep = token.match(/^\*\/(\d+)$/)
  if (wholeStep) return { ...base, mode: 'step', from: '', step: wholeStep[1] }

  // `a-max/n` is how this builder writes a step that starts partway through.
  const rangeStep = token.match(/^(\w+)-(\w+)\/(\d+)$/)
  if (rangeStep && isValue(name, rangeStep[1]) && Number(rangeStep[2]) === spec.max)
    return { ...base, mode: 'step', from: rangeStep[1], step: rangeStep[3] }

  const range = token.match(/^(\w+)-(\w+)$/)
  if (range && isValue(name, range[1]) && isValue(name, range[2]))
    return { ...base, mode: 'range', from: range[1], to: range[2] }

  if (token.includes(',') && token.split(',').every((part) => isValue(name, part)))
    return { ...base, mode: 'list', value: token }

  if (isValue(name, token)) return { ...base, mode: 'specific', value: token }

  return { ...base, mode: 'advanced' }
}

export const writeCronFieldSpec = (name: CronFieldName, spec: CronFieldSpec): string => {
  const bounds = cronFieldSpec(name)
  const fallbackFrom = String(bounds.min)

  switch (spec.mode) {
    case 'every':
      return '*'
    case 'blank':
      return '?'
    case 'specific':
      return spec.value || fallbackFrom
    case 'step': {
      const step = spec.step || '1'
      return spec.from ? `${spec.from}-${bounds.max}/${step}` : `*/${step}`
    }
    case 'range':
      return `${spec.from || fallbackFrom}-${spec.to || String(bounds.max)}`
    case 'list':
      return spec.value || fallbackFrom
    case 'advanced':
      return spec.raw || '*'
  }
}

/**
 * Splits an expression into editable tokens. Anything the builder cannot line
 * up with five or six fields (a macro, a typo) restarts from "every minute".
 */
export const readCronTokens = (expression: string) => {
  const tokens = expression.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 5 || tokens.length === 6)
    return { names: tokens.length === 6 ? sixFieldNames : fiveFieldNames, tokens }
  return { names: fiveFieldNames, tokens: ['*', '*', '*', '*', '*'] }
}

export const replaceCronToken = (expression: string, name: CronFieldName, token: string) => {
  const { names, tokens } = readCronTokens(expression)
  const index = names.indexOf(name)
  if (index < 0) return tokens.join(' ')
  return tokens.map((current, position) => (position === index ? token : current)).join(' ')
}

/** Adds or drops the leading seconds field, keeping the other tokens intact. */
export const setCronSeconds = (expression: string, enabled: boolean) => {
  const { names, tokens } = readCronTokens(expression)
  const hasSeconds = names.length === 6
  if (enabled === hasSeconds) return tokens.join(' ')
  return enabled ? ['0', ...tokens].join(' ') : tokens.slice(1).join(' ')
}
