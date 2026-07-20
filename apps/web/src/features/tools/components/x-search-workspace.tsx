'use client'

import { useMemo, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import {
  buildXSearchQuery,
  buildXSearchUrl,
  emptyXSearchCondition,
  type XSearchCondition,
  type XSearchFilterMode,
  type XSearchResultTab,
} from '../domain/x-search'
import {
  type Bilingual,
  DateField,
  FiltersCard,
  NumberField,
  OptionGroup,
  SearchPreview,
  SectionHeading,
  SelectField,
  TextField,
  useTranslate,
} from './search-fields'
import { SpecializedShell } from './specialized-workspaces'

const xLanguages: { value: string; label: Bilingual }[] = [
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

const filterModes: { value: XSearchFilterMode; label: Bilingual }[] = [
  { value: 'any', label: { ja: 'すべて', en: 'Any' } },
  { value: 'exclude', label: { ja: '除外', en: 'Exclude' } },
  { value: 'only', label: { ja: 'のみ', en: 'Only' } },
]

const resultTabs: { value: XSearchResultTab; label: Bilingual }[] = [
  { value: 'top', label: { ja: '話題', en: 'Top' } },
  { value: 'live', label: { ja: '最新', en: 'Latest' } },
  { value: 'user', label: { ja: 'アカウント', en: 'People' } },
  { value: 'media', label: { ja: 'メディア', en: 'Media' } },
]

export const XSearchWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const t = useTranslate()
  const [condition, setCondition] = useState<XSearchCondition>(emptyXSearchCondition)
  const [tab, setTab] = useState<XSearchResultTab>('top')

  const set = <Key extends keyof XSearchCondition>(key: Key, value: XSearchCondition[Key]) =>
    setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildXSearchQuery(condition), [condition])
  const url = useMemo(() => buildXSearchUrl(condition, tab), [condition, tab])

  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setCondition(emptyXSearchCondition)
        setTab('top')
      }}
    >
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <FiltersCard>
          <section className="space-y-4">
            <SectionHeading>{t('キーワード', 'Words')}</SectionHeading>
            <TextField
              id="x-all-words"
              label={t('次のキーワードをすべて含む', 'All of these words')}
              placeholder={t('例: 新機能 リリース', 'e.g. release notes')}
              value={condition.allWords}
              onChange={(value) => set('allWords', value)}
            />
            <TextField
              id="x-exact-phrase"
              label={t('次のフレーズを含む', 'This exact phrase')}
              placeholder={t('例: 大切なお知らせ', 'e.g. happy hour')}
              value={condition.exactPhrase}
              onChange={(value) => set('exactPhrase', value)}
            />
            <TextField
              id="x-any-words"
              label={t('次のキーワードのいずれかを含む', 'Any of these words')}
              placeholder={t('例: 猫 犬', 'e.g. cats dogs')}
              value={condition.anyWords}
              onChange={(value) => set('anyWords', value)}
            />
            <TextField
              id="x-none-words"
              label={t('次のキーワードを含まない', 'None of these words')}
              placeholder={t('例: 宣伝 広告', 'e.g. spam ads')}
              value={condition.noneWords}
              onChange={(value) => set('noneWords', value)}
            />
            <TextField
              id="x-hashtags"
              label={t('次のハッシュタグを含む', 'These hashtags')}
              placeholder={t('例: #個人開発', 'e.g. #buildinpublic')}
              value={condition.hashtags}
              onChange={(value) => set('hashtags', value)}
            />
            <SelectField
              id="x-language"
              label={t('言語', 'Language')}
              value={condition.language}
              options={xLanguages}
              onChange={(value) => set('language', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('アカウント', 'Accounts')}</SectionHeading>
            <TextField
              id="x-from"
              label={t('次のアカウントが送信', 'From these accounts')}
              placeholder={t('例: @X', 'e.g. @X')}
              hint={t(
                '複数はスペースかカンマで区切り、いずれかに一致します',
                'Separate multiple accounts with spaces or commas',
              )}
              value={condition.fromAccounts}
              onChange={(value) => set('fromAccounts', value)}
            />
            <TextField
              id="x-to"
              label={t('次のアカウント宛て', 'To these accounts')}
              placeholder={t('例: @Support', 'e.g. @Support')}
              value={condition.toAccounts}
              onChange={(value) => set('toAccounts', value)}
            />
            <TextField
              id="x-mention"
              label={t('次のアカウントへの@ツイート', 'Mentioning these accounts')}
              placeholder={t('例: @XDevelopers', 'e.g. @XDevelopers')}
              value={condition.mentionAccounts}
              onChange={(value) => set('mentionAccounts', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('フィルター', 'Filters')}</SectionHeading>
            <OptionGroup
              inline
              label={t('返信', 'Replies')}
              value={condition.replies}
              options={filterModes}
              onChange={(value) => set('replies', value)}
            />
            <OptionGroup
              inline
              label={t('リンクを含むポスト', 'Posts with links')}
              value={condition.links}
              options={filterModes}
              onChange={(value) => set('links', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('エンゲージメント', 'Engagement')}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                id="x-min-replies"
                label={t('返信の最小数', 'Minimum replies')}
                placeholder="10"
                value={condition.minReplies}
                onChange={(value) => set('minReplies', value)}
              />
              <NumberField
                id="x-min-faves"
                label={t('いいねの最小数', 'Minimum likes')}
                placeholder="10"
                value={condition.minFaves}
                onChange={(value) => set('minFaves', value)}
              />
              <NumberField
                id="x-min-retweets"
                label={t('リポストの最小数', 'Minimum reposts')}
                placeholder="10"
                value={condition.minRetweets}
                onChange={(value) => set('minRetweets', value)}
              />
            </div>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('日付', 'Dates')}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="x-since"
                label={t('次の日付以降', 'From date')}
                value={condition.since}
                onChange={(value) => set('since', value)}
              />
              <DateField
                id="x-until"
                label={t('次の日付以前', 'To date')}
                value={condition.until}
                onChange={(value) => set('until', value)}
              />
            </div>
          </section>
        </FiltersCard>
        <SearchPreview
          query={query}
          url={url}
          queryId="x-query"
          actionLabel={t('Xで検索', 'Search on X')}
        >
          <OptionGroup
            label={t('結果の表示', 'Result tab')}
            value={tab}
            options={resultTabs}
            onChange={setTab}
          />
        </SearchPreview>
      </div>
    </SpecializedShell>
  )
}
