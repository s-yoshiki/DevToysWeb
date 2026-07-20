'use client'

import { useMemo, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import {
  buildGoogleSearchQuery,
  buildGoogleSearchUrl,
  emptyGoogleSearchCondition,
  type GoogleSearchCondition,
  type GoogleTimeRange,
} from '../domain/google-search'
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

const googleLanguages: { value: string; label: Bilingual }[] = [
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

const fileTypes: { value: string; label: Bilingual }[] = [
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

const timeRanges: { value: GoogleTimeRange; label: Bilingual }[] = [
  { value: '', label: { ja: '全期間', en: 'Any time' } },
  { value: 'h', label: { ja: '1時間', en: 'Hour' } },
  { value: 'd', label: { ja: '24時間', en: 'Day' } },
  { value: 'w', label: { ja: '1週間', en: 'Week' } },
  { value: 'm', label: { ja: '1か月', en: 'Month' } },
  { value: 'y', label: { ja: '1年', en: 'Year' } },
]

export const GoogleSearchWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const t = useTranslate()
  const [condition, setCondition] = useState<GoogleSearchCondition>(emptyGoogleSearchCondition)

  const set = <Key extends keyof GoogleSearchCondition>(
    key: Key,
    value: GoogleSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGoogleSearchQuery(condition), [condition])
  const url = useMemo(() => buildGoogleSearchUrl(condition), [condition])

  return (
    <SpecializedShell tool={tool} onClear={() => setCondition(emptyGoogleSearchCondition)}>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <FiltersCard>
          <section className="space-y-4">
            <SectionHeading>{t('キーワード', 'Words')}</SectionHeading>
            <TextField
              id="g-all-words"
              label={t('次のキーワードをすべて含む', 'All of these words')}
              placeholder={t('例: 静的サイト 配信', 'e.g. static export')}
              value={condition.allWords}
              onChange={(value) => set('allWords', value)}
            />
            <TextField
              id="g-exact-phrase"
              label={t('次のフレーズを含む', 'This exact word or phrase')}
              placeholder={t('例: App Router', 'e.g. app router')}
              value={condition.exactPhrase}
              onChange={(value) => set('exactPhrase', value)}
            />
            <TextField
              id="g-any-words"
              label={t('次のキーワードのいずれかを含む', 'Any of these words')}
              placeholder={t('例: Next.js Remix', 'e.g. next remix')}
              value={condition.anyWords}
              onChange={(value) => set('anyWords', value)}
            />
            <TextField
              id="g-none-words"
              label={t('次のキーワードを含まない', 'None of these words')}
              placeholder={t('例: 広告 まとめ', 'e.g. ads roundup')}
              value={condition.noneWords}
              onChange={(value) => set('noneWords', value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="g-number-from"
                label={t('数値の範囲(最小)', 'Numbers ranging from')}
                placeholder="100"
                value={condition.numberFrom}
                onChange={(value) => set('numberFrom', value)}
              />
              <NumberField
                id="g-number-to"
                label={t('数値の範囲(最大)', 'Numbers ranging to')}
                placeholder="500"
                value={condition.numberTo}
                onChange={(value) => set('numberTo', value)}
              />
            </div>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('キーワードの掲載場所', 'Terms appearing')}</SectionHeading>
            <TextField
              id="g-in-title"
              label={t('ページタイトルに含む', 'In the page title')}
              placeholder={t('例: リリースノート', 'e.g. changelog')}
              hint={t(
                '複数はスペースかカンマで区切り、いずれかに一致します',
                'Separate multiple terms with spaces or commas',
              )}
              value={condition.inTitle}
              onChange={(value) => set('inTitle', value)}
            />
            <TextField
              id="g-in-text"
              label={t('本文に含む', 'In the page text')}
              placeholder={t('例: 移行手順', 'e.g. migration')}
              value={condition.inText}
              onChange={(value) => set('inText', value)}
            />
            <TextField
              id="g-in-url"
              label={t('URLに含む', 'In the page URL')}
              placeholder={t('例: docs', 'e.g. docs')}
              value={condition.inUrl}
              onChange={(value) => set('inUrl', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('サイトとファイル', 'Site and file')}</SectionHeading>
            <TextField
              id="g-sites"
              label={t('次のサイトまたはドメイン', 'Site or domain')}
              placeholder="developer.mozilla.org"
              hint={t(
                'URLを貼り付けてもホスト名だけを使います',
                'Pasting a full URL keeps only the host',
              )}
              value={condition.sites}
              onChange={(value) => set('sites', value)}
            />
            <TextField
              id="g-exclude-sites"
              label={t('次のサイトを除外', 'Exclude these sites')}
              placeholder="pinterest.com"
              value={condition.excludeSites}
              onChange={(value) => set('excludeSites', value)}
            />
            <SelectField
              id="g-file-type"
              label={t('ファイル形式', 'File type')}
              value={condition.fileType}
              options={fileTypes}
              onChange={(value) => set('fileType', value)}
            />
            <TextField
              id="g-related"
              label={t('次のサイトに類似', 'Similar to this site')}
              placeholder="github.com"
              value={condition.relatedSite}
              onChange={(value) => set('relatedSite', value)}
            />
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('期間と言語', 'Date and language')}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="g-after"
                label={t('次の日付以降', 'After date')}
                value={condition.after}
                onChange={(value) => set('after', value)}
              />
              <DateField
                id="g-before"
                label={t('次の日付以前', 'Before date')}
                value={condition.before}
                onChange={(value) => set('before', value)}
              />
            </div>
            <OptionGroup
              label={t('最終更新', 'Last update')}
              value={condition.timeRange}
              options={timeRanges}
              onChange={(value) => set('timeRange', value)}
            />
            <SelectField
              id="g-language"
              label={t('言語', 'Language')}
              value={condition.language}
              options={googleLanguages}
              onChange={(value) => set('language', value)}
            />
          </section>
        </FiltersCard>
        <SearchPreview
          query={query}
          url={url}
          queryId="g-query"
          actionLabel={t('Googleで検索', 'Search on Google')}
        />
      </div>
    </SpecializedShell>
  )
}
