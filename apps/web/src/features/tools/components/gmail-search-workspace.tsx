'use client'

import { useMemo, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import {
  buildGmailSearchQuery,
  buildGmailSearchUrl,
  emptyGmailSearchCondition,
  type GmailAgeUnit,
  type GmailCategory,
  type GmailLocation,
  type GmailSearchCondition,
  type GmailState,
} from '../domain/gmail-search'
import {
  type Bilingual,
  DateField,
  FiltersCard,
  NumberField,
  SearchPreview,
  SectionHeading,
  SelectField,
  SwitchField,
  TextField,
  useTranslate,
} from './search-fields'
import { SpecializedShell } from './specialized-workspaces'

const gmailCategories: { value: GmailCategory; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any category' } },
  { value: 'primary', label: { ja: 'メイン', en: 'Primary' } },
  { value: 'social', label: { ja: 'ソーシャル', en: 'Social' } },
  { value: 'promotions', label: { ja: 'プロモーション', en: 'Promotions' } },
  { value: 'updates', label: { ja: '新着', en: 'Updates' } },
  { value: 'forums', label: { ja: 'フォーラム', en: 'Forums' } },
  { value: 'reservations', label: { ja: '予約', en: 'Reservations' } },
  { value: 'purchases', label: { ja: '購入', en: 'Purchases' } },
]

const gmailLocations: { value: GmailLocation; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Default' } },
  { value: 'anywhere', label: { ja: '全メール', en: 'All mail' } },
  { value: 'inbox', label: { ja: '受信トレイ', en: 'Inbox' } },
  { value: 'sent', label: { ja: '送信済み', en: 'Sent' } },
  { value: 'draft', label: { ja: '下書き', en: 'Drafts' } },
  { value: 'snoozed', label: { ja: 'スヌーズ中', en: 'Snoozed' } },
  { value: 'trash', label: { ja: 'ゴミ箱', en: 'Trash' } },
  { value: 'spam', label: { ja: '迷惑メール', en: 'Spam' } },
]

const gmailStates: { value: GmailState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any state' } },
  { value: 'unread', label: { ja: '未読', en: 'Unread' } },
  { value: 'read', label: { ja: '既読', en: 'Read' } },
  { value: 'starred', label: { ja: 'スター付き', en: 'Starred' } },
  { value: 'important', label: { ja: '重要', en: 'Important' } },
  { value: 'muted', label: { ja: 'ミュート', en: 'Muted' } },
]

const gmailAgeUnits: { value: GmailAgeUnit; label: Bilingual }[] = [
  { value: 'd', label: { ja: '日', en: 'Days' } },
  { value: 'm', label: { ja: 'か月', en: 'Months' } },
  { value: 'y', label: { ja: '年', en: 'Years' } },
]

export const GmailSearchWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const t = useTranslate()
  const [condition, setCondition] = useState<GmailSearchCondition>(emptyGmailSearchCondition)

  const set = <Key extends keyof GmailSearchCondition>(
    key: Key,
    value: GmailSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGmailSearchQuery(condition), [condition])
  const url = useMemo(() => buildGmailSearchUrl(condition), [condition])

  return (
    <SpecializedShell tool={tool} onClear={() => setCondition(emptyGmailSearchCondition)}>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <FiltersCard>
          <section className="space-y-4">
            <SectionHeading>{t('送受信者', 'People')}</SectionHeading>
            <TextField
              id="m-from"
              label={t('送信者', 'From')}
              placeholder="amy@example.com"
              hint={t(
                '複数はスペースかカンマで区切り、いずれかに一致します',
                'Separate multiple addresses with spaces or commas',
              )}
              value={condition.from}
              onChange={(value) => set('from', value)}
            />
            <TextField
              id="m-to"
              label={t('宛先', 'To')}
              placeholder="me@example.com"
              value={condition.to}
              onChange={(value) => set('to', value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="m-cc"
                label="Cc"
                placeholder="team@example.com"
                value={condition.cc}
                onChange={(value) => set('cc', value)}
              />
              <TextField
                id="m-bcc"
                label="Bcc"
                placeholder="team@example.com"
                value={condition.bcc}
                onChange={(value) => set('bcc', value)}
              />
            </div>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('キーワード', 'Words')}</SectionHeading>
            <TextField
              id="m-subject"
              label={t('件名', 'Subject')}
              placeholder={t('例: 請求書', 'e.g. invoice')}
              value={condition.subject}
              onChange={(value) => set('subject', value)}
            />
            <TextField
              id="m-all-words"
              label={t('次のキーワードをすべて含む', 'All of these words')}
              placeholder={t('例: 請求 支払い', 'e.g. invoice payment')}
              value={condition.allWords}
              onChange={(value) => set('allWords', value)}
            />
            <TextField
              id="m-exact-phrase"
              label={t('次のフレーズを含む', 'This exact phrase')}
              placeholder={t('例: お支払いのお願い', 'e.g. past due')}
              value={condition.exactPhrase}
              onChange={(value) => set('exactPhrase', value)}
            />
            <TextField
              id="m-any-words"
              label={t('次のキーワードのいずれかを含む', 'Any of these words')}
              placeholder={t('例: 至急 期限', 'e.g. urgent overdue')}
              value={condition.anyWords}
              onChange={(value) => set('anyWords', value)}
            />
            <TextField
              id="m-none-words"
              label={t('次のキーワードを含まない', 'None of these words')}
              placeholder={t('例: 広告 メルマガ', 'e.g. newsletter')}
              value={condition.noneWords}
              onChange={(value) => set('noneWords', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('保存場所と状態', 'Mailbox and state')}</SectionHeading>
            <TextField
              id="m-label"
              label={t('ラベル', 'Label')}
              placeholder={t('例: 仕事', 'e.g. work')}
              value={condition.label}
              onChange={(value) => set('label', value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="m-location"
                label={t('検索範囲', 'Search in')}
                value={condition.location}
                options={gmailLocations}
                onChange={(value) => set('location', value)}
              />
              <SelectField
                id="m-category"
                label={t('カテゴリ', 'Category')}
                value={condition.category}
                options={gmailCategories}
                onChange={(value) => set('category', value)}
              />
            </div>
            <SelectField
              id="m-state"
              label={t('状態', 'State')}
              value={condition.state}
              options={gmailStates}
              onChange={(value) => set('state', value)}
            />
            <SwitchField
              id="m-exclude-chats"
              label={t('チャットを除外', 'Exclude chats')}
              checked={condition.excludeChats}
              onChange={(value) => set('excludeChats', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('添付とサイズ', 'Attachments and size')}</SectionHeading>
            <SwitchField
              id="m-has-attachment"
              label={t('添付ファイルあり', 'Has attachment')}
              checked={condition.hasAttachment}
              onChange={(value) => set('hasAttachment', value)}
            />
            <TextField
              id="m-filename"
              label={t('添付ファイル名', 'Attachment filename')}
              placeholder={t('例: report.pdf', 'e.g. report.pdf')}
              value={condition.filename}
              onChange={(value) => set('filename', value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="m-larger"
                label={t('サイズ下限 (MB)', 'Larger than (MB)')}
                placeholder="10"
                value={condition.largerThanMb}
                onChange={(value) => set('largerThanMb', value)}
              />
              <NumberField
                id="m-smaller"
                label={t('サイズ上限 (MB)', 'Smaller than (MB)')}
                placeholder="25"
                value={condition.smallerThanMb}
                onChange={(value) => set('smallerThanMb', value)}
              />
            </div>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('期間', 'Dates')}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="m-after"
                label={t('次の日付以降', 'After date')}
                value={condition.after}
                onChange={(value) => set('after', value)}
              />
              <DateField
                id="m-before"
                label={t('次の日付以前', 'Before date')}
                value={condition.before}
                onChange={(value) => set('before', value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <NumberField
                  id="m-older-than"
                  label={t('これより古い', 'Older than')}
                  placeholder="1"
                  value={condition.olderThan}
                  onChange={(value) => set('olderThan', value)}
                />
                <SelectField
                  id="m-older-unit"
                  label={t('単位', 'Unit')}
                  value={condition.olderThanUnit}
                  options={gmailAgeUnits}
                  onChange={(value) => set('olderThanUnit', value)}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <NumberField
                  id="m-newer-than"
                  label={t('これより新しい', 'Newer than')}
                  placeholder="7"
                  value={condition.newerThan}
                  onChange={(value) => set('newerThan', value)}
                />
                <SelectField
                  id="m-newer-unit"
                  label={t('単位', 'Unit')}
                  value={condition.newerThanUnit}
                  options={gmailAgeUnits}
                  onChange={(value) => set('newerThanUnit', value)}
                />
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('アカウント', 'Account')}</SectionHeading>
            <NumberField
              id="m-account-index"
              label={t('アカウント番号', 'Account index')}
              placeholder="0"
              value={condition.accountIndex}
              onChange={(value) => set('accountIndex', value)}
            />
            <p className="text-xs text-muted-foreground">
              {t(
                'Gmailに複数ログインしている場合、URLの /u/0/ に当たる番号です',
                'The /u/0/ position in the URL when several accounts are signed in',
              )}
            </p>
          </section>
        </FiltersCard>
        <SearchPreview
          query={query}
          url={url}
          queryId="m-query"
          actionLabel={t('Gmailで検索', 'Search in Gmail')}
        />
      </div>
    </SpecializedShell>
  )
}
