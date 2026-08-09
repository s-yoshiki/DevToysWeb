import { generatedEmojiCatalog } from './emoji-catalog.generated'
import type { EmojiCategory, EmojiEntry } from './emoji-types'

export type { EmojiCategory, EmojiEntry }

export const ZERO_WIDTH_JOINER = '\u200d'

/**
 * Every base emoji from the current Unicode emoji standard (one entry per
 * emoji, skin-tone variants excluded), with Japanese names sourced from
 * CLDR's short annotations. See scripts/generate-emoji-catalog.mjs.
 */
export const emojiCatalog: readonly EmojiEntry[] = generatedEmojiCatalog

export const emojiCategories: readonly (EmojiCategory | 'all')[] = [
  'all',
  'smileys',
  'people',
  'animals',
  'food',
  'travel',
  'activities',
  'objects',
  'symbols',
  'flags',
]

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim()

export const filterEmojis = (
  entries: readonly EmojiEntry[],
  query: string,
  category: EmojiCategory | 'all',
) => {
  const normalizedQuery = normalize(query)
  return entries.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!normalizedQuery) return true
    const searchable = [
      item.emoji,
      item.name.ja,
      item.name.en,
      getEmojiCodePoints(item.emoji),
      getEmojiHtml(item.emoji),
      getEmojiHtmlDecimal(item.emoji),
      ...item.keywords,
    ]
      .map(normalize)
      .join(' ')
    return searchable.includes(normalizedQuery)
  })
}

export const getEmojiCodePoints = (value: string) =>
  Array.from(value)
    .map((character) => `U+${character.codePointAt(0)?.toString(16).toUpperCase()}`)
    .join(' ')

export const isZwjSequence = (value: string) => value.includes(ZERO_WIDTH_JOINER)

export const getEmojiHtml = (value: string) =>
  Array.from(value)
    .map((character) => `&#x${character.codePointAt(0)?.toString(16)};`)
    .join('')

export const getEmojiHtmlDecimal = (value: string) =>
  Array.from(value)
    .map((character) => `&#${character.codePointAt(0)};`)
    .join('')

export const formatEmojiList = (entries: readonly EmojiEntry[], locale: 'ja' | 'en') =>
  entries
    .map((item) =>
      [
        item.emoji,
        item.name[locale],
        getEmojiCodePoints(item.emoji),
        getEmojiHtml(item.emoji),
      ].join('\t'),
    )
    .join('\n')

export const generateEmojis = (
  entries: readonly EmojiEntry[],
  count: number,
  random: () => number = Math.random,
) => {
  const total = Math.max(1, Math.min(30, Math.floor(count) || 1))
  if (entries.length === 0) return []
  return Array.from({ length: total }, () => entries[Math.floor(random() * entries.length)])
}
