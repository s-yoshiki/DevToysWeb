import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  filterInvisibleCharacters,
  findInvisibleCharacter,
  inspectInvisibleText,
  invisibleCharacters,
  removeInvisibleCharacters,
  visualizeInvisibleText,
} from './invisible'

describe('invisible character catalog', () => {
  it('contains the 25 Unicode White_Space characters', () => {
    assert.equal(invisibleCharacters.filter((item) => item.category === 'whitespace').length, 25)
    assert.equal(findInvisibleCharacter('\u00a0')?.unicode, 'U+00A0')
  })

  it('keeps zero-width joiners distinguishable from zero-width spaces', () => {
    assert.equal(findInvisibleCharacter('\u200b')?.name.en, 'ZERO WIDTH SPACE')
    assert.equal(findInvisibleCharacter('\u200d')?.name.en, 'ZERO WIDTH JOINER')
  })

  it('filters by code point and category', () => {
    assert.equal(filterInvisibleCharacters('U+200B', 'all').length, 1)
    assert.equal(filterInvisibleCharacters('zero width', 'format').length, 4)
    assert.equal(filterInvisibleCharacters('U+200B', 'whitespace').length, 0)
  })
})

describe('inspectInvisibleText', () => {
  it('returns code-point-aware occurrences in input order', () => {
    const occurrences = inspectInvisibleText('A\u200b B\u00a0C')
    assert.deepEqual(
      occurrences.map((item) => [item.index, item.unicode]),
      [
        [1, 'U+200B'],
        [2, 'U+0020'],
        [4, 'U+00A0'],
      ],
    )
  })

  it('visualizes and removes only catalogued characters', () => {
    assert.equal(visualizeInvisibleText('A\u200b B'), 'AZWSP·B')
    assert.equal(removeInvisibleCharacters('A\u200b B'), 'AB')
  })
})
