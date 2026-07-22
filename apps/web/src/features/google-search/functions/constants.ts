import type { GoogleTimeRange } from '@/features/google-search/functions/google-search'
import type { Bilingual } from '@/features/tools/components/search/types'

export const googleLanguages: { value: string; label: Bilingual }[] = [
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
  { value: 'zh-CN', label: { ja: '中国語', en: 'Chinese' } },
]

export const fileTypes: { value: string; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any format' } },
  { value: 'pdf', label: { ja: 'PDF (.pdf)', en: 'PDF (.pdf)' } },
  { value: 'doc', label: { ja: 'Word (.doc)', en: 'Word (.doc)' } },
  { value: 'docx', label: { ja: 'Word (.docx)', en: 'Word (.docx)' } },
  { value: 'xls', label: { ja: 'Excel (.xls)', en: 'Excel (.xls)' } },
  { value: 'xlsx', label: { ja: 'Excel (.xlsx)', en: 'Excel (.xlsx)' } },
  { value: 'ppt', label: { ja: 'PowerPoint (.ppt)', en: 'PowerPoint (.ppt)' } },
  { value: 'pptx', label: { ja: 'PowerPoint (.pptx)', en: 'PowerPoint (.pptx)' } },
  { value: 'csv', label: { ja: 'CSV (.csv)', en: 'CSV (.csv)' } },
  { value: 'txt', label: { ja: 'テキスト (.txt)', en: 'Text (.txt)' } },
  { value: 'rtf', label: { ja: 'リッチテキスト (.rtf)', en: 'Rich text (.rtf)' } },
  { value: 'xml', label: { ja: 'XML (.xml)', en: 'XML (.xml)' } },
]

export const timeRanges: { value: GoogleTimeRange; label: Bilingual }[] = [
  { value: '', label: { ja: '全期間', en: 'Any time' } },
  { value: 'h', label: { ja: '1時間', en: 'Hour' } },
  { value: 'd', label: { ja: '24時間', en: 'Day' } },
  { value: 'w', label: { ja: '1週間', en: 'Week' } },
  { value: 'm', label: { ja: '1か月', en: 'Month' } },
  { value: 'y', label: { ja: '1年', en: 'Year' } },
]
