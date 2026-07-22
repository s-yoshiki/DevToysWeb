import type {
  GmailAgeUnit,
  GmailCategory,
  GmailLocation,
  GmailState,
} from '@/features/gmail-search/functions/gmail-search'
import type { Bilingual } from '@/features/tools/components/search/types'

export const gmailCategories: { value: GmailCategory; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any category' } },
  { value: 'primary', label: { ja: 'メイン', en: 'Primary' } },
  { value: 'social', label: { ja: 'ソーシャル', en: 'Social' } },
  { value: 'promotions', label: { ja: 'プロモーション', en: 'Promotions' } },
  { value: 'updates', label: { ja: '新着', en: 'Updates' } },
  { value: 'forums', label: { ja: 'フォーラム', en: 'Forums' } },
  { value: 'reservations', label: { ja: '予約', en: 'Reservations' } },
  { value: 'purchases', label: { ja: '購入', en: 'Purchases' } },
]

export const gmailLocations: { value: GmailLocation; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Default' } },
  { value: 'anywhere', label: { ja: '全メール', en: 'All mail' } },
  { value: 'inbox', label: { ja: '受信トレイ', en: 'Inbox' } },
  { value: 'sent', label: { ja: '送信済み', en: 'Sent' } },
  { value: 'draft', label: { ja: '下書き', en: 'Drafts' } },
  { value: 'snoozed', label: { ja: 'スヌーズ中', en: 'Snoozed' } },
  { value: 'trash', label: { ja: 'ゴミ箱', en: 'Trash' } },
  { value: 'spam', label: { ja: '迷惑メール', en: 'Spam' } },
]

export const gmailStates: { value: GmailState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any state' } },
  { value: 'unread', label: { ja: '未読', en: 'Unread' } },
  { value: 'read', label: { ja: '既読', en: 'Read' } },
  { value: 'starred', label: { ja: 'スター付き', en: 'Starred' } },
  { value: 'important', label: { ja: '重要', en: 'Important' } },
  { value: 'muted', label: { ja: 'ミュート', en: 'Muted' } },
]

export const gmailAgeUnits: { value: GmailAgeUnit; label: Bilingual }[] = [
  { value: 'd', label: { ja: '日', en: 'Days' } },
  { value: 'm', label: { ja: 'か月', en: 'Months' } },
  { value: 'y', label: { ja: '年', en: 'Years' } },
]
