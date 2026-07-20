'use client'

import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { cn } from '@/lib/utils'
import type { ToolDefinition } from '../domain/catalog'
import {
  buildGoogleSearchQuery,
  buildGoogleSearchUrl,
  emptyGoogleSearchCondition,
  type GoogleSearchCondition,
  type GoogleTimeRange,
} from '../domain/google-search'
import {
  buildXSearchQuery,
  buildXSearchUrl,
  emptyXSearchCondition,
  type XSearchCondition,
  type XSearchFilterMode,
  type XSearchResultTab,
} from '../domain/x-search'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

type Bilingual = { ja: string; en: string }

const useTranslate = () => {
  const { locale } = useLocale()
  return (ja: string, en: string) => (locale === 'ja' ? ja : en)
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    {children}
  </h2>
)

const Field = ({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)

const TextField = ({
  id,
  label,
  placeholder,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder?: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label} hint={hint}>
    <Input
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
)

const NumberField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label}>
    <Input
      id={id}
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
)

const DateField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label}>
    <Input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} />
  </Field>
)

const SelectField = <Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: Value
  options: { value: Value; label: Bilingual }[]
  onChange: (value: Value) => void
}) => {
  const { locale } = useLocale()
  return (
    <Field id={id} label={label}>
      <Select
        items={options.map((option) => ({ value: option.value, label: option.label[locale] }))}
        value={value}
        onValueChange={(next) => onChange((next as Value) ?? ('' as Value))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

/** Segmented control for a small, fixed set of choices such as filters and tabs. */
const OptionGroup = <Value extends string>({
  label,
  value,
  options,
  inline,
  onChange,
}: {
  label: string
  value: Value
  options: { value: Value; label: Bilingual }[]
  inline?: boolean
  onChange: (value: Value) => void
}) => {
  const { locale } = useLocale()
  return (
    <div className={cn(inline ? 'flex flex-wrap items-center justify-between gap-2' : 'space-y-2')}>
      <span className="text-sm font-medium">{label}</span>
      <fieldset
        className="flex flex-wrap gap-1 rounded-lg border bg-background p-1"
        aria-label={label}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={value === option.value ? 'default' : 'ghost'}
            onClick={() => onChange(option.value)}
            className="h-7 px-3"
          >
            {option.label[locale]}
          </Button>
        ))}
      </fieldset>
    </div>
  )
}

/** Query preview, target URL and the button that leaves for the search engine. */
const SearchPreview = ({
  query,
  url,
  queryId,
  actionLabel,
  children,
}: {
  query: string
  url: string
  queryId: string
  actionLabel: string
  children?: React.ReactNode
}) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:sticky lg:top-6 lg:col-span-2">
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="text-sm font-medium">{t('プレビュー', 'Preview')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={queryId}>{t('検索クエリ', 'Search query')}</Label>
            <CopyButton value={query} />
          </div>
          <Textarea
            id={queryId}
            readOnly
            value={query}
            placeholder={t(
              '条件を入力するとクエリが表示されます',
              'The query appears as you fill in filters',
            )}
            className="min-h-24 resize-none font-mono text-sm"
          />
        </div>
        {children}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('検索URL', 'Search URL')}</span>
            <CopyButton value={url} />
          </div>
          <p className="min-h-10 break-all rounded-lg border bg-muted/20 p-3 font-mono text-xs text-muted-foreground">
            {url || t('条件を入力するとURLが表示されます', 'The URL appears once a query exists')}
          </p>
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), 'w-full')}
          >
            <ExternalLink className="size-4" />
            {actionLabel}
          </a>
        ) : (
          <Button className="w-full" disabled>
            <ExternalLink className="size-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

const FiltersCard = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:col-span-3">
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="text-sm font-medium">{t('検索条件', 'Search filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-5">{children}</CardContent>
    </Card>
  )
}

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
