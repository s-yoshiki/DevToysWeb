export type EmojiCategory =
  | 'smileys'
  | 'people'
  | 'animals'
  | 'food'
  | 'travel'
  | 'activities'
  | 'objects'
  | 'symbols'
  | 'flags'

export type EmojiEntry = {
  emoji: string
  name: { ja: string; en: string }
  keywords: string[]
  category: EmojiCategory
}
