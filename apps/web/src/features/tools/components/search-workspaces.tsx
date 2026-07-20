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
  buildXSearchQuery,
  buildXSearchUrl,
  emptyXSearchCondition,
  type XSearchCondition,
  type XSearchFilterMode,
  type XSearchResultTab,
} from '../domain/x-search'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const languages = [
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

const resultTabs: { value: XSearchResultTab; label: { ja: string; en: string } }[] = [
  { value: 'top', label: { ja: '話題', en: 'Top' } },
  { value: 'live', label: { ja: '最新', en: 'Latest' } },
  { value: 'user', label: { ja: 'アカウント', en: 'People' } },
  { value: 'media', label: { ja: 'メディア', en: 'Media' } },
]

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

const FilterModeToggle = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: XSearchFilterMode
  onChange: (mode: XSearchFilterMode) => void
}) => {
  const { locale } = useLocale()
  const modeLabels: Record<XSearchFilterMode, string> = {
    any: locale === 'ja' ? 'すべて' : 'Any',
    exclude: locale === 'ja' ? '除外' : 'Exclude',
    only: locale === 'ja' ? 'のみ' : 'Only',
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <fieldset className="flex rounded-lg border bg-background p-1" aria-label={label}>
        {(['any', 'exclude', 'only'] as const).map((mode) => (
          <Button
            key={mode}
            size="sm"
            variant={value === mode ? 'default' : 'ghost'}
            onClick={() => onChange(mode)}
            className="h-7 px-3"
          >
            {modeLabels[mode]}
          </Button>
        ))}
      </fieldset>
    </div>
  )
}

export const XSearchWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [condition, setCondition] = useState<XSearchCondition>(emptyXSearchCondition)
  const [tab, setTab] = useState<XSearchResultTab>('top')
  const t = (ja: string, en: string) => (locale === 'ja' ? ja : en)

  const set = <Key extends keyof XSearchCondition>(key: Key, value: XSearchCondition[Key]) =>
    setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildXSearchQuery(condition), [condition])
  const url = useMemo(() => buildXSearchUrl(condition, tab), [condition, tab])

  const textField = (
    key: keyof XSearchCondition,
    label: string,
    placeholder: string,
    hint?: string,
  ) => (
    <Field id={`x-${key}`} label={label} hint={hint}>
      <Input
        id={`x-${key}`}
        value={condition[key]}
        onChange={(event) => set(key, event.target.value)}
        placeholder={placeholder}
      />
    </Field>
  )

  const numberField = (key: keyof XSearchCondition, label: string) => (
    <Field id={`x-${key}`} label={label}>
      <Input
        id={`x-${key}`}
        type="number"
        min={1}
        value={condition[key]}
        onChange={(event) => set(key, event.target.value)}
        placeholder="10"
      />
    </Field>
  )

  const dateField = (key: keyof XSearchCondition, label: string) => (
    <Field id={`x-${key}`} label={label}>
      <Input
        id={`x-${key}`}
        type="date"
        value={condition[key]}
        onChange={(event) => set(key, event.target.value)}
      />
    </Field>
  )

  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setCondition(emptyXSearchCondition)
        setTab('top')
      }}
    >
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:col-span-3">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">{t('検索条件', 'Search filters')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-5">
            <section className="space-y-4">
              <SectionHeading>{t('キーワード', 'Words')}</SectionHeading>
              {textField(
                'allWords',
                t('次のキーワードをすべて含む', 'All of these words'),
                t('例: 新機能 リリース', 'e.g. release notes'),
              )}
              {textField(
                'exactPhrase',
                t('次のフレーズを含む', 'This exact phrase'),
                t('例: 大切なお知らせ', 'e.g. happy hour'),
              )}
              {textField(
                'anyWords',
                t('次のキーワードのいずれかを含む', 'Any of these words'),
                t('例: 猫 犬', 'e.g. cats dogs'),
              )}
              {textField(
                'noneWords',
                t('次のキーワードを含まない', 'None of these words'),
                t('例: 宣伝 広告', 'e.g. spam ads'),
              )}
              {textField(
                'hashtags',
                t('次のハッシュタグを含む', 'These hashtags'),
                t('例: #個人開発', 'e.g. #buildinpublic'),
              )}
              <Field id="x-language" label={t('言語', 'Language')}>
                <Select
                  items={languages.map((language) => ({
                    value: language.value,
                    label: language.label[locale],
                  }))}
                  value={condition.language}
                  onValueChange={(value) => set('language', (value as string) ?? '')}
                >
                  <SelectTrigger id="x-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </section>
            <section className="space-y-4">
              <SectionHeading>{t('アカウント', 'Accounts')}</SectionHeading>
              {textField(
                'fromAccounts',
                t('次のアカウントが送信', 'From these accounts'),
                t('例: @X', 'e.g. @X'),
                t(
                  '複数はスペースかカンマで区切り、いずれかに一致します',
                  'Separate multiple accounts with spaces or commas',
                ),
              )}
              {textField(
                'toAccounts',
                t('次のアカウント宛て', 'To these accounts'),
                t('例: @Support', 'e.g. @Support'),
              )}
              {textField(
                'mentionAccounts',
                t('次のアカウントへの@ツイート', 'Mentioning these accounts'),
                t('例: @XDevelopers', 'e.g. @XDevelopers'),
              )}
            </section>
            <section className="space-y-4">
              <SectionHeading>{t('フィルター', 'Filters')}</SectionHeading>
              <FilterModeToggle
                label={t('返信', 'Replies')}
                value={condition.replies}
                onChange={(mode) => set('replies', mode)}
              />
              <FilterModeToggle
                label={t('リンクを含むポスト', 'Posts with links')}
                value={condition.links}
                onChange={(mode) => set('links', mode)}
              />
            </section>
            <section className="space-y-4">
              <SectionHeading>{t('エンゲージメント', 'Engagement')}</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-3">
                {numberField('minReplies', t('返信の最小数', 'Minimum replies'))}
                {numberField('minFaves', t('いいねの最小数', 'Minimum likes'))}
                {numberField('minRetweets', t('リポストの最小数', 'Minimum reposts'))}
              </div>
            </section>
            <section className="space-y-4">
              <SectionHeading>{t('日付', 'Dates')}</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {dateField('since', t('次の日付以降', 'From date'))}
                {dateField('until', t('次の日付以前', 'To date'))}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:sticky lg:top-6 lg:col-span-2">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">{t('プレビュー', 'Preview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="x-query">{t('検索クエリ', 'Search query')}</Label>
                <CopyButton value={query} />
              </div>
              <Textarea
                id="x-query"
                readOnly
                value={query}
                placeholder={t(
                  '条件を入力するとクエリが表示されます',
                  'The query appears as you fill in filters',
                )}
                className="min-h-24 resize-none font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">{t('結果の表示', 'Result tab')}</span>
              <fieldset
                className="flex flex-wrap gap-1 rounded-lg border bg-background p-1"
                aria-label={t('結果の表示', 'Result tab')}
              >
                {resultTabs.map((resultTab) => (
                  <Button
                    key={resultTab.value}
                    size="sm"
                    variant={tab === resultTab.value ? 'default' : 'ghost'}
                    onClick={() => setTab(resultTab.value)}
                    className="h-7 px-3"
                  >
                    {resultTab.label[locale]}
                  </Button>
                ))}
              </fieldset>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="x-url">{t('検索URL', 'Search URL')}</Label>
                <CopyButton value={url} />
              </div>
              <p
                id="x-url"
                className="min-h-10 break-all rounded-lg border bg-muted/20 p-3 font-mono text-xs text-muted-foreground"
              >
                {url ||
                  t('条件を入力するとURLが表示されます', 'The URL appears once a query exists')}
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
                {t('Xで検索', 'Search on X')}
              </a>
            ) : (
              <Button className="w-full" disabled>
                <ExternalLink className="size-4" />
                {t('Xで検索', 'Search on X')}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </SpecializedShell>
  )
}
