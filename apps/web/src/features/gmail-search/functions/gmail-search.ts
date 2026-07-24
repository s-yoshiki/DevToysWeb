import {
  naturalNumber,
  negate,
  orGroup,
  quotePhrase,
  splitTerms,
} from '@/libs/domain/search-operators'

/** Mailbox scope, matching Gmail's `in:` operator. */
export type GmailLocation =
  | ''
  | 'anywhere'
  | 'inbox'
  | 'sent'
  | 'draft'
  | 'snoozed'
  | 'trash'
  | 'spam'

/** Message state, matching Gmail's `is:` operator. */
export type GmailState = '' | 'unread' | 'read' | 'starred' | 'important' | 'muted'

/** Inbox category, matching Gmail's `category:` operator. */
export type GmailCategory =
  | ''
  | 'primary'
  | 'social'
  | 'promotions'
  | 'updates'
  | 'forums'
  | 'reservations'
  | 'purchases'

/** Unit for the `older_than:` and `newer_than:` operators. */
export type GmailAgeUnit = 'd' | 'm' | 'y'

export type GmailSearchCondition = {
  from: string
  to: string
  cc: string
  bcc: string
  subject: string
  allWords: string
  exactPhrase: string
  anyWords: string
  noneWords: string
  label: string
  category: GmailCategory
  location: GmailLocation
  state: GmailState
  hasAttachment: boolean
  filename: string
  largerThanMb: string
  smallerThanMb: string
  after: string
  before: string
  olderThan: string
  olderThanUnit: GmailAgeUnit
  newerThan: string
  newerThanUnit: GmailAgeUnit
  excludeChats: boolean
  accountIndex: string
}

export const emptyGmailSearchCondition: GmailSearchCondition = {
  from: '',
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  allWords: '',
  exactPhrase: '',
  anyWords: '',
  noneWords: '',
  label: '',
  category: '',
  location: '',
  state: '',
  hasAttachment: false,
  filename: '',
  largerThanMb: '',
  smallerThanMb: '',
  after: '',
  before: '',
  olderThan: '',
  olderThanUnit: 'y',
  newerThan: '',
  newerThanUnit: 'd',
  excludeChats: false,
  accountIndex: '0',
}

/** Gmail documents dates as `YYYY/MM/DD`, while date inputs produce ISO values. */
const gmailDate = (value: string) => {
  const date = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.replace(/-/g, '/') : ''
}

/** A label containing spaces has to be quoted, as Gmail would otherwise split it. */
const labelOperator = (value: string) => {
  const label = value.trim().replace(/"/g, '')
  if (!label) return ''
  return label.includes(' ') ? `label:"${label}"` : `label:${label}`
}

const addressGroup = (value: string, operator: string) =>
  orGroup(splitTerms(value).map((term) => `${operator}:${term}`))

const ageOperator = (operator: string, value: string, unit: GmailAgeUnit) => {
  const amount = naturalNumber(value)
  return amount ? `${operator}:${amount}${unit}` : ''
}

/**
 * Assembles the operator string Gmail's advanced search panel produces, in the
 * order the panel presents it: people, subject, words, then the refinements.
 */
export const buildGmailSearchQuery = (condition: GmailSearchCondition) => {
  const parts: string[] = []

  parts.push(addressGroup(condition.from, 'from'))
  parts.push(addressGroup(condition.to, 'to'))
  parts.push(addressGroup(condition.cc, 'cc'))
  parts.push(addressGroup(condition.bcc, 'bcc'))

  const subject = condition.subject.trim().replace(/"/g, '')
  if (subject) parts.push(subject.includes(' ') ? `subject:"${subject}"` : `subject:${subject}`)

  parts.push(...splitTerms(condition.allWords))
  parts.push(quotePhrase(condition.exactPhrase))
  parts.push(orGroup(splitTerms(condition.anyWords)))
  parts.push(...splitTerms(condition.noneWords).map(negate))

  parts.push(labelOperator(condition.label))
  if (condition.category) parts.push(`category:${condition.category}`)
  if (condition.location) parts.push(`in:${condition.location}`)
  if (condition.state) parts.push(`is:${condition.state}`)

  if (condition.hasAttachment) parts.push('has:attachment')
  const filename = condition.filename.trim()
  if (filename) parts.push(`filename:${filename}`)

  const larger = naturalNumber(condition.largerThanMb)
  if (larger) parts.push(`larger:${larger}M`)
  const smaller = naturalNumber(condition.smallerThanMb)
  if (smaller) parts.push(`smaller:${smaller}M`)

  const after = gmailDate(condition.after)
  if (after) parts.push(`after:${after}`)
  const before = gmailDate(condition.before)
  if (before) parts.push(`before:${before}`)
  parts.push(ageOperator('older_than', condition.olderThan, condition.olderThanUnit))
  parts.push(ageOperator('newer_than', condition.newerThan, condition.newerThanUnit))

  if (condition.excludeChats) parts.push('-is:chat')

  return parts.filter(Boolean).join(' ')
}

/**
 * Gmail carries the search in the URL fragment, so the query is percent-encoded
 * rather than passed through URLSearchParams.
 */
export const buildGmailSearchUrl = (condition: GmailSearchCondition) => {
  const query = buildGmailSearchQuery(condition)
  if (!query) return ''
  const account = /^\d+$/.test(condition.accountIndex.trim()) ? condition.accountIndex.trim() : '0'
  return `https://mail.google.com/mail/u/${account}/#search/${encodeURIComponent(query)}`
}
