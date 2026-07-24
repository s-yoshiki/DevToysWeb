'use client'

import {
  DateField,
  NumberField,
  SelectField,
  SwitchField,
  TextField,
} from '@/components/search/fields'
import {
  FiltersCard,
  SearchPreview,
  SectionHeading,
} from '@/components/search/search-layout'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { gmailAgeUnits, gmailCategories, gmailLocations, gmailStates } from '../functions/constants'
import { useGmailSearch } from '../hooks/use-gmail-search'

export const GmailSearchWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { condition, set, query, url, reset } = useGmailSearch()

  return (
    <WorkspaceShell tool={tool} onClear={reset}>
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
    </WorkspaceShell>
  )
}
