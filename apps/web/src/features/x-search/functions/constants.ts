import type { Bilingual } from '@/features/tools/components/search/types'
import type { XSearchFilterMode, XSearchResultTab } from '@/features/x-search/functions/x-search'

export const xLanguages: { value: string; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any language' } },
  { value: 'ja', label: { ja: '日本語', en: 'Japanese' } },
  { value: 'en', label: { ja: '英語', en: 'English' } },
  { value: 'ar', label: { ja: 'アラビア語', en: 'Arabic' } },
  { value: 'de', label: { ja: 'ドイツ語', en: 'German' } },
  { value: 'es', label: { ja: 'スペイン語', en: 'Spanish' } },
  { value: 'fr', label: { ja: 'フランス語', en: 'French' } },
  { value: 'hi', label: { ja: 'ヒンディー語', en: 'Hindi' } },
  { value: 'id', label: { ja: 'インドネシア語', en: 'Indonesian' } },
  { value: 'it', label: { ja: 'イタリア語', en: 'Italian' } },
  { value: 'ko', label: { ja: '韓国語', en: 'Korean' } },
  { value: 'nl', label: { ja: 'オランダ語', en: 'Dutch' } },
  { value: 'pl', label: { ja: 'ポーランド語', en: 'Polish' } },
  { value: 'pt', label: { ja: 'ポルトガル語', en: 'Portuguese' } },
  { value: 'ru', label: { ja: 'ロシア語', en: 'Russian' } },
  { value: 'th', label: { ja: 'タイ語', en: 'Thai' } },
  { value: 'tr', label: { ja: 'トルコ語', en: 'Turkish' } },
  { value: 'vi', label: { ja: 'ベトナム語', en: 'Vietnamese' } },
  { value: 'zh', label: { ja: '中国語', en: 'Chinese' } },
]

export const filterModes: { value: XSearchFilterMode; label: Bilingual }[] = [
  { value: 'any', label: { ja: 'すべて', en: 'Any' } },
  { value: 'exclude', label: { ja: '除外', en: 'Exclude' } },
  { value: 'only', label: { ja: 'のみ', en: 'Only' } },
]

export const resultTabs: { value: XSearchResultTab; label: Bilingual }[] = [
  { value: 'top', label: { ja: '話題', en: 'Top' } },
  { value: 'live', label: { ja: '最新', en: 'Latest' } },
  { value: 'user', label: { ja: 'アカウント', en: 'People' } },
  { value: 'media', label: { ja: 'メディア', en: 'Media' } },
]
