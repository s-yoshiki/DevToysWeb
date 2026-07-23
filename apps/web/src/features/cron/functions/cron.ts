import type { Locale } from '@/i18n/dictionaries'

/**
 * Cron parsing and explanation. The parser is deliberately separate from
 * `cron-parser` (which only computes upcoming runs): describing an expression
 * needs the shape of each field, not the instants it expands to.
 *
 * Supported syntax is Vixie cron plus the widely implemented extensions:
 * five fields, an optional leading seconds field, `@` macros, name aliases,
 * `?`, `L`, `W` and `#`.
 */

export type CronFieldName = 'second' | 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

export type CronTerm =
  | { kind: 'all' }
  | { kind: 'blank' }
  | { kind: 'single'; value: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'step'; from: number; to: number; step: number; whole: boolean }
  | { kind: 'lastDayOfMonth'; offset: number }
  | { kind: 'nearestWeekday'; value: number }
  | { kind: 'lastWeekday'; value: number }
  | { kind: 'nthWeekday'; value: number; nth: number }

export type CronField = {
  name: CronFieldName
  token: string
  terms: CronTerm[]
  label: Record<Locale, string>
  description: Record<Locale, string>
}

export type CronAnalysis = {
  /** The expression with macros expanded, as the parser understood it. */
  normalized: string
  hasSeconds: boolean
  fields: CronField[]
  description: Record<Locale, string>
  /** Set when day-of-month and day-of-week both restrict the schedule. */
  note: Record<Locale, string> | null
}

type FieldSpec = {
  min: number
  max: number
  names?: string[]
  label: Record<Locale, string>
  noun: Record<Locale, string>
  /** Unit used by "every Nth ..." phrasing, which differs in Japanese. */
  stepUnit: string
}

const specs: Record<CronFieldName, FieldSpec> = {
  second: {
    min: 0,
    max: 59,
    label: { ja: '秒', en: 'Second' },
    noun: { ja: '秒', en: 'second' },
    stepUnit: '秒',
  },
  minute: {
    min: 0,
    max: 59,
    label: { ja: '分', en: 'Minute' },
    noun: { ja: '分', en: 'minute' },
    stepUnit: '分',
  },
  hour: {
    min: 0,
    max: 23,
    label: { ja: '時', en: 'Hour' },
    noun: { ja: '時', en: 'hour' },
    stepUnit: '時間',
  },
  dayOfMonth: {
    min: 1,
    max: 31,
    label: { ja: '日', en: 'Day of month' },
    noun: { ja: '日', en: 'day-of-month' },
    stepUnit: '日',
  },
  month: {
    min: 1,
    max: 12,
    names: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    label: { ja: '月', en: 'Month' },
    noun: { ja: '月', en: 'month' },
    stepUnit: 'か月',
  },
  dayOfWeek: {
    min: 0,
    max: 7,
    names: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    label: { ja: '曜日', en: 'Day of week' },
    noun: { ja: '曜日', en: 'day-of-week' },
    stepUnit: '',
  },
}

export const cronFieldSpec = (name: CronFieldName) => specs[name]

export const fiveFieldNames: CronFieldName[] = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
]

export const sixFieldNames: CronFieldName[] = ['second', ...fiveFieldNames]

/** `@`-style shorthands accepted by Vixie cron and most schedulers. */
export const cronMacros: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
}

const monthNames: Record<Locale, string[]> = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
}

const dayNames: Record<Locale, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ja: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
}

const pad = (value: number) => String(value).padStart(2, '0')

const ordinal = (value: number) => {
  const rest = value % 100
  if (rest >= 11 && rest <= 13) return `${value}th`
  const suffix = ['th', 'st', 'nd', 'rd'][value % 10] ?? 'th'
  return `${value}${suffix}`
}

const fail = (message: string): never => {
  throw new Error(message)
}

/** Resolves a numeric literal or a three-letter alias to a field value. */
const readValue = (name: CronFieldName, text: string) => {
  const spec = specs[name]
  const index = spec.names?.indexOf(text.toUpperCase()) ?? -1
  const value = index >= 0 ? index + spec.min : Number(text)
  if (!/^\d+$/.test(text) && index < 0) fail(`"${text}" is not a valid ${spec.noun.en}`)
  if (!Number.isInteger(value) || value < spec.min || value > spec.max)
    fail(`${spec.noun.en} "${text}" is out of the ${spec.min}-${spec.max} range`)
  return value
}

const readStep = (name: CronFieldName, text: string) => {
  const spec = specs[name]
  const step = Number(text)
  if (!/^\d+$/.test(text) || step < 1) fail(`"${text}" is not a valid step for the ${spec.noun.en}`)
  if (step > spec.max) fail(`step "${text}" is larger than the ${spec.noun.en} range`)
  return step
}

const readTerm = (name: CronFieldName, token: string): CronTerm => {
  const spec = specs[name]

  if (token === '*') return { kind: 'all' }
  if (token === '?') {
    if (name !== 'dayOfMonth' && name !== 'dayOfWeek')
      fail(`"?" is only allowed in the day-of-month and day-of-week fields`)
    return { kind: 'blank' }
  }

  const stepMatch = token.match(/^(.+)\/(\w+)$/)
  if (stepMatch) {
    const [, base, stepText] = stepMatch
    const step = readStep(name, stepText)
    if (base === '*') return { kind: 'step', from: spec.min, to: spec.max, step, whole: true }
    const range = base.match(/^(\w+)-(\w+)$/)
    if (range) {
      const from = readValue(name, range[1])
      const to = readValue(name, range[2])
      if (to < from) fail(`range "${base}" ends before it starts`)
      return { kind: 'step', from, to, step, whole: false }
    }
    // `5/10` is the Quartz spelling of "from 5 to the end of the field".
    const from = readValue(name, base)
    return { kind: 'step', from, to: spec.max, step, whole: false }
  }

  if (name === 'dayOfMonth') {
    if (token === 'L' || token === 'l') return { kind: 'lastDayOfMonth', offset: 0 }
    const lastOffset = token.match(/^[Ll]-(\d+)$/)
    if (lastOffset) {
      const offset = Number(lastOffset[1])
      if (offset > 30) fail(`"${token}" offsets past the start of a month`)
      return { kind: 'lastDayOfMonth', offset }
    }
    const weekday = token.match(/^(\d+)[Ww]$/)
    if (weekday) return { kind: 'nearestWeekday', value: readValue(name, weekday[1]) }
  }

  if (name === 'dayOfWeek') {
    const last = token.match(/^(\w+)[Ll]$/)
    if (last) return { kind: 'lastWeekday', value: readValue(name, last[1]) }
    const nth = token.match(/^(\w+)#(\d+)$/)
    if (nth) {
      const position = Number(nth[2])
      if (position < 1 || position > 5) fail(`"${token}" must select the 1st through 5th weekday`)
      return { kind: 'nthWeekday', value: readValue(name, nth[1]), nth: position }
    }
  }

  const range = token.match(/^(\w+)-(\w+)$/)
  if (range) {
    const from = readValue(name, range[1])
    const to = readValue(name, range[2])
    if (to < from) fail(`range "${token}" ends before it starts`)
    return { kind: 'range', from, to }
  }

  return { kind: 'single', value: readValue(name, token) }
}

export const parseCronField = (name: CronFieldName, token: string): CronTerm[] => {
  if (!token) fail(`the ${specs[name].noun.en} field is empty`)
  return token.split(',').map((part) => {
    if (!part) fail(`"${token}" has an empty list entry`)
    return readTerm(name, part.trim())
  })
}

/** Day-of-week 7 and 0 both mean Sunday; normalize before naming it. */
const dayName = (value: number, locale: Locale) => dayNames[locale][value % 7]

const valueLabel = (name: CronFieldName, value: number, locale: Locale) => {
  if (name === 'month') return monthNames[locale][value - specs.month.min]
  if (name === 'dayOfWeek') return dayName(value, locale)
  if (locale === 'en') return String(value)
  return `${value}${specs[name].noun.ja}`
}

const termPhraseEn = (name: CronFieldName, term: CronTerm): string => {
  const noun = specs[name].noun.en
  const label = (value: number) => valueLabel(name, value, 'en')
  switch (term.kind) {
    case 'all':
    case 'blank':
      return `every ${noun}`
    case 'single':
      return name === 'month' || name === 'dayOfWeek' ? label(term.value) : `${noun} ${term.value}`
    case 'range':
      return `every ${noun} from ${label(term.from)} through ${label(term.to)}`
    case 'step':
      if (term.step === 1)
        return term.whole
          ? `every ${noun}`
          : `every ${noun} from ${label(term.from)} through ${label(term.to)}`
      return term.whole
        ? `every ${ordinal(term.step)} ${noun}`
        : `every ${ordinal(term.step)} ${noun} from ${label(term.from)} through ${label(term.to)}`
    case 'lastDayOfMonth':
      return term.offset === 0
        ? 'the last day of the month'
        : `${term.offset} day${term.offset === 1 ? '' : 's'} before the last day of the month`
    case 'nearestWeekday':
      return `the weekday nearest day-of-month ${term.value}`
    case 'lastWeekday':
      return `the last ${dayName(term.value, 'en')} of the month`
    case 'nthWeekday':
      return `the ${ordinal(term.nth)} ${dayName(term.value, 'en')} of the month`
  }
}

const termPhraseJa = (name: CronFieldName, term: CronTerm): string => {
  const spec = specs[name]
  const label = (value: number) => valueLabel(name, value, 'ja')
  switch (term.kind) {
    case 'all':
    case 'blank':
      return name === 'dayOfWeek' ? '毎日' : `毎${spec.noun.ja}`
    case 'single':
      return label(term.value)
    case 'range':
      return `${label(term.from)}から${label(term.to)}`
    case 'step':
      if (term.step === 1)
        return term.whole
          ? `毎${spec.noun.ja}`
          : `${label(term.from)}から${label(term.to)}のあいだ毎${spec.noun.ja}`
      return term.whole
        ? `${term.step}${spec.stepUnit}ごと`
        : `${label(term.from)}から${label(term.to)}まで${term.step}${spec.stepUnit}ごと`
    case 'lastDayOfMonth':
      return term.offset === 0 ? '月末' : `月末の${term.offset}日前`
    case 'nearestWeekday':
      return `${term.value}日に最も近い平日`
    case 'lastWeekday':
      return `最終${dayName(term.value, 'ja')}`
    case 'nthWeekday':
      return `第${term.nth}${dayName(term.value, 'ja')}`
  }
}

const joinEn = (parts: string[]) =>
  parts.length < 2 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`

const fieldPhrase = (name: CronFieldName, terms: CronTerm[], locale: Locale) => {
  const phrases = terms.map((term) =>
    locale === 'ja' ? termPhraseJa(name, term) : termPhraseEn(name, term),
  )
  return locale === 'ja' ? phrases.join('、') : joinEn(phrases)
}

/** True when the field places no restriction on the schedule. */
const isOpen = (terms: CronTerm[]) =>
  terms.length === 1 &&
  (terms[0].kind === 'all' ||
    terms[0].kind === 'blank' ||
    (terms[0].kind === 'step' && terms[0].whole && terms[0].step === 1))

const singleValue = (terms: CronTerm[]) =>
  terms.length === 1 && terms[0].kind === 'single' ? terms[0].value : null

type Parsed = Record<CronFieldName, CronTerm[] | undefined>

const clockTime = (parsed: Parsed, hasSeconds: boolean) => {
  const hour = singleValue(parsed.hour ?? [])
  const minute = singleValue(parsed.minute ?? [])
  if (hour === null || minute === null) return null
  if (!hasSeconds) return `${pad(hour)}:${pad(minute)}`
  const second = singleValue(parsed.second ?? [])
  return second === null ? null : `${pad(hour)}:${pad(minute)}:${pad(second)}`
}

const describeEn = (parsed: Parsed, hasSeconds: boolean) => {
  const clock = clockTime(parsed, hasSeconds)
  const smallest: CronFieldName = hasSeconds ? 'second' : 'minute'
  const larger: CronFieldName[] = hasSeconds ? ['minute', 'hour'] : ['hour']

  let sentence = clock ? `At ${clock}` : `At ${fieldPhrase(smallest, parsed[smallest] ?? [], 'en')}`
  if (!clock)
    for (const name of larger) {
      const terms = parsed[name] ?? []
      if (!isOpen(terms)) sentence += ` past ${fieldPhrase(name, terms, 'en')}`
    }

  const dayOfMonth = parsed.dayOfMonth ?? []
  const dayOfWeek = parsed.dayOfWeek ?? []
  const month = parsed.month ?? []
  const bothDays = !isOpen(dayOfMonth) && !isOpen(dayOfWeek)

  if (!isOpen(dayOfMonth)) sentence += ` on ${fieldPhrase('dayOfMonth', dayOfMonth, 'en')}`
  if (!isOpen(dayOfWeek))
    sentence += `${bothDays ? ' or on ' : ' on '}${fieldPhrase('dayOfWeek', dayOfWeek, 'en')}`
  if (!isOpen(month)) sentence += ` in ${fieldPhrase('month', month, 'en')}`

  return `${sentence}.`
}

const describeJa = (parsed: Parsed, hasSeconds: boolean) => {
  const clock = clockTime(parsed, hasSeconds)
  const order: CronFieldName[] = hasSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute']
  const timePhrase =
    clock ??
    (() => {
      const parts = order
        .filter((name) => !isOpen(parsed[name] ?? []))
        .map((name) => fieldPhrase(name, parsed[name] ?? [], 'ja'))
      return parts.length
        ? parts.join('の')
        : `毎${specs[hasSeconds ? 'second' : 'minute'].noun.ja}`
    })()

  const dayOfMonth = parsed.dayOfMonth ?? []
  const dayOfWeek = parsed.dayOfWeek ?? []
  const month = parsed.month ?? []
  const openMonth = isOpen(month)
  const openDayOfMonth = isOpen(dayOfMonth)
  const openDayOfWeek = isOpen(dayOfWeek)

  const dayParts: string[] = []
  // "1月" and "1日" read as one date, so keep them together when both are fixed.
  const mergedDate =
    !openMonth && !openDayOfMonth && singleValue(month) !== null && singleValue(dayOfMonth) !== null

  if (mergedDate) {
    dayParts.push(
      `${fieldPhrase('month', month, 'ja')}${fieldPhrase('dayOfMonth', dayOfMonth, 'ja')}`,
    )
  } else {
    if (!openMonth) dayParts.push(fieldPhrase('month', month, 'ja'))
    if (!openDayOfMonth) dayParts.push(fieldPhrase('dayOfMonth', dayOfMonth, 'ja'))
  }
  if (!openDayOfWeek) {
    const phrase = fieldPhrase('dayOfWeek', dayOfWeek, 'ja')
    // Both day fields restricted means "either matches", not "both match".
    if (!openDayOfMonth) dayParts.push(`または${phrase}`)
    else dayParts.push(phrase)
  }

  let prefix = ''
  if (!openMonth) prefix = '毎年'
  else if (!openDayOfMonth) prefix = '毎月'
  else if (!openDayOfWeek) prefix = '毎週'
  else if (clock) prefix = '毎日'

  // "毎日" reads as an adverb on its own, but "毎月1日" needs the connecting の.
  const subject = [prefix, ...dayParts].filter(Boolean).join('')
  const head = dayParts.length ? `${subject}の${timePhrase}` : `${subject}${timePhrase}`
  return `${head}に実行`
}

const expandValues = (name: CronFieldName, terms: CronTerm[], locale: Locale) => {
  const spec = specs[name]
  const numbers = new Set<number>()
  const specials: string[] = []
  let everything = false

  for (const term of terms) {
    switch (term.kind) {
      case 'all':
      case 'blank':
        everything = true
        break
      case 'single':
        numbers.add(term.value)
        break
      case 'range':
        for (let value = term.from; value <= term.to; value += 1) numbers.add(value)
        break
      case 'step':
        for (let value = term.from; value <= term.to; value += term.step) numbers.add(value)
        break
      default:
        specials.push(locale === 'ja' ? termPhraseJa(name, term) : termPhraseEn(name, term))
    }
  }

  if (everything && !specials.length)
    return locale === 'ja'
      ? `すべて (${spec.min}-${spec.max})`
      : `every value (${spec.min}-${spec.max})`

  // 7 and 0 are the same weekday; showing both would overstate the schedule.
  const listed = [...numbers]
    .map((value) => (name === 'dayOfWeek' ? value % 7 : value))
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort((left, right) => left - right)
    .map((value) =>
      name === 'month' || name === 'dayOfWeek' ? valueLabel(name, value, locale) : String(value),
    )

  const shown = listed.length > 12 ? [...listed.slice(0, 12), '…'] : listed
  return [...shown, ...specials].join(locale === 'ja' ? '、' : ', ')
}

export const expandCronExpression = (input: string) => {
  const trimmed = input.trim()
  const macro = cronMacros[trimmed.toLowerCase()]
  return macro ?? trimmed
}

export const analyzeCron = (input: string): CronAnalysis => {
  const trimmed = input.trim()
  if (!trimmed) fail('Enter a cron expression')
  if (trimmed.toLowerCase() === '@reboot')
    fail('@reboot runs once at startup, so it has no schedule to describe')

  const normalized = expandCronExpression(trimmed)
  const tokens = normalized.split(/\s+/)
  if (tokens.length !== 5 && tokens.length !== 6)
    fail(`Expected 5 fields (or 6 with seconds), got ${tokens.length}`)

  const hasSeconds = tokens.length === 6
  const names = hasSeconds ? sixFieldNames : fiveFieldNames
  const parsed: Parsed = {
    second: undefined,
    minute: undefined,
    hour: undefined,
    dayOfMonth: undefined,
    month: undefined,
    dayOfWeek: undefined,
  }

  const fields = names.map((name, index) => {
    const token = tokens[index]
    const terms = parseCronField(name, token)
    parsed[name] = terms
    return {
      name,
      token,
      terms,
      label: specs[name].label,
      description: {
        ja: fieldPhrase(name, terms, 'ja'),
        en: fieldPhrase(name, terms, 'en'),
      },
    } satisfies CronField
  })

  const bothDays = !isOpen(parsed.dayOfMonth ?? []) && !isOpen(parsed.dayOfWeek ?? [])

  return {
    normalized,
    hasSeconds,
    fields,
    description: { ja: describeJa(parsed, hasSeconds), en: describeEn(parsed, hasSeconds) },
    note: bothDays
      ? {
          ja: '日と曜日の両方を指定した場合、cronは「どちらかに一致した日」に実行します。',
          en: 'When both day-of-month and day-of-week are restricted, cron runs on days matching either field.',
        }
      : null,
  }
}

/** Locale-aware expansion for the field table, which the UI renders per locale. */
export const cronFieldValues = (field: CronField, locale: Locale) =>
  expandValues(field.name, field.terms, locale)
