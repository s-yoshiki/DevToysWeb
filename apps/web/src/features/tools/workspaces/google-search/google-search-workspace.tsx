'use client'

import { useTranslate } from '@/hooks/use-translate'
import { DateField, NumberField, SelectField, TextField } from '../../components/search/fields'
import {
  FiltersCard,
  OptionGroup,
  SearchPreview,
  SectionHeading,
} from '../../components/search/search-layout'
import { WorkspaceShell } from '../../components/workspace-shell'
import type { WorkspaceProps } from '../types'
import { fileTypes, googleLanguages, timeRanges } from './constants'
import { useGoogleSearch } from './use-google-search'

export const GoogleSearchWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { condition, set, query, url, reset } = useGoogleSearch()

  return (
    <WorkspaceShell tool={tool} onClear={reset}>
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
    </WorkspaceShell>
  )
}
