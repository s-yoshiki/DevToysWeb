import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildGmailSearchQuery,
  buildGmailSearchUrl,
  emptyGmailSearchCondition,
  type GmailSearchCondition,
} from './gmail-search'

const condition = (overrides: Partial<GmailSearchCondition>): GmailSearchCondition => ({
  ...emptyGmailSearchCondition,
  ...overrides,
})

describe('buildGmailSearchQuery', () => {
  it('returns an empty query for the empty condition', () => {
    assert.equal(buildGmailSearchQuery(emptyGmailSearchCondition), '')
  })

  it('groups multiple addresses per operator', () => {
    assert.equal(
      buildGmailSearchQuery(
        condition({ from: 'amy@example.com, bob@example.com', to: 'me@example.com' }),
      ),
      '(from:amy@example.com OR from:bob@example.com) to:me@example.com',
    )
  })

  it('combines word operators in panel order', () => {
    assert.equal(
      buildGmailSearchQuery(
        condition({
          allWords: 'invoice payment',
          exactPhrase: 'past due',
          anyWords: 'urgent overdue',
          noneWords: 'newsletter',
        }),
      ),
      'invoice payment "past due" (urgent OR overdue) -newsletter',
    )
  })

  it('quotes a subject or label only when it contains spaces', () => {
    assert.equal(buildGmailSearchQuery(condition({ subject: 'receipt' })), 'subject:receipt')
    assert.equal(
      buildGmailSearchQuery(condition({ subject: 'monthly report' })),
      'subject:"monthly report"',
    )
    assert.equal(buildGmailSearchQuery(condition({ label: 'work' })), 'label:work')
    assert.equal(buildGmailSearchQuery(condition({ label: 'work stuff' })), 'label:"work stuff"')
  })

  it('adds mailbox, category and state operators', () => {
    assert.equal(
      buildGmailSearchQuery(
        condition({ location: 'anywhere', category: 'updates', state: 'unread' }),
      ),
      'category:updates in:anywhere is:unread',
    )
  })

  it('adds attachment and size operators', () => {
    assert.equal(
      buildGmailSearchQuery(
        condition({
          hasAttachment: true,
          filename: 'report.pdf',
          largerThanMb: '10',
          smallerThanMb: '25',
        }),
      ),
      'has:attachment filename:report.pdf larger:10M smaller:25M',
    )
  })

  it('converts ISO dates to the slashed form Gmail documents', () => {
    assert.equal(
      buildGmailSearchQuery(condition({ after: '2026-01-01', before: '2026-06-30' })),
      'after:2026/01/01 before:2026/06/30',
    )
    assert.equal(buildGmailSearchQuery(condition({ after: '01/01/2026' })), '')
  })

  it('builds relative age operators from an amount and unit', () => {
    assert.equal(
      buildGmailSearchQuery(
        condition({ olderThan: '1', olderThanUnit: 'y', newerThan: '7', newerThanUnit: 'd' }),
      ),
      'older_than:1y newer_than:7d',
    )
    assert.equal(buildGmailSearchQuery(condition({ olderThan: '0' })), '')
  })

  it('excludes chats when asked', () => {
    assert.equal(
      buildGmailSearchQuery(condition({ allWords: 'notes', excludeChats: true })),
      'notes -is:chat',
    )
  })
})

describe('buildGmailSearchUrl', () => {
  it('returns an empty string when there is no query', () => {
    assert.equal(buildGmailSearchUrl(emptyGmailSearchCondition), '')
  })

  it('encodes the query into the Gmail search fragment', () => {
    assert.equal(
      buildGmailSearchUrl(condition({ from: 'amy@example.com', hasAttachment: true })),
      'https://mail.google.com/mail/u/0/#search/from%3Aamy%40example.com%20has%3Aattachment',
    )
  })

  it('targets the selected account index', () => {
    assert.equal(
      buildGmailSearchUrl(condition({ allWords: 'x', accountIndex: '2' })),
      'https://mail.google.com/mail/u/2/#search/x',
    )
  })

  it('falls back to the first account for a non-numeric index', () => {
    assert.equal(
      buildGmailSearchUrl(condition({ allWords: 'x', accountIndex: 'me' })),
      'https://mail.google.com/mail/u/0/#search/x',
    )
  })
})
