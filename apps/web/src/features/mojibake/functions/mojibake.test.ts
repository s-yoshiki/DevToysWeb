import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { analyzeMojibake } from './mojibake'

/** CP1252 rendering of raw bytes — how mojibake usually reaches a user's screen. */
const CP1252_HIGH: Record<number, number> = {
  128: 0x20ac,
  130: 0x201a,
  131: 0x192,
  132: 0x201e,
  133: 0x2026,
  134: 0x2020,
  135: 0x2021,
  136: 0x2c6,
  137: 0x2030,
  138: 0x160,
  139: 0x2039,
  140: 0x152,
  142: 0x17d,
  145: 0x2018,
  146: 0x2019,
  147: 0x201c,
  148: 0x201d,
  149: 0x2022,
  150: 0x2013,
  151: 0x2014,
  152: 0x2dc,
  153: 0x2122,
  154: 0x161,
  155: 0x203a,
  156: 0x153,
  158: 0x17e,
  159: 0x178,
}

const utf8AsCp1252 = (text: string) =>
  Array.from(new TextEncoder().encode(text))
    .map((b) => String.fromCodePoint(b >= 0x80 && b <= 0x9f && CP1252_HIGH[b] ? CP1252_HIGH[b] : b))
    .join('')

describe('analyzeMojibake', () => {
  it('restores UTF-8 Japanese text seen through a CP1252 pipeline', () => {
    const cases = ['日本語が文字化けしました', '文字化けを直す', 'こんにちは、世界！']
    for (const original of cases) {
      const best = analyzeMojibake(utf8AsCp1252(original))[0]
      assert.equal(best?.text, original)
    }
  })

  it('restores Western accented text without over-correcting', () => {
    assert.equal(analyzeMojibake(utf8AsCp1252('café'))[0]?.text, 'café')
    assert.equal(analyzeMojibake(utf8AsCp1252('価格€100'))[0]?.text, '価格€100')
  })

  it('unwinds doubly-encoded text', () => {
    const doubled = utf8AsCp1252(utf8AsCp1252('£100'))
    assert.equal(analyzeMojibake(doubled)[0]?.text, '£100')
  })

  it('returns nothing for text that is not byte-recoverable mojibake', () => {
    assert.deepEqual(analyzeMojibake('普通の日本語テキスト'), [])
    assert.deepEqual(analyzeMojibake(''), [])
  })
})
