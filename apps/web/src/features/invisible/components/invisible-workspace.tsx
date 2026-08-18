'use client'

import { Eye, Search, Sparkles, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import type { InvisibleCharacter } from '../functions/invisible'
import { type InvisibleMode, useInvisible } from '../hooks/use-invisible'

const StatTile = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border bg-muted/20 p-4">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
  </div>
)

const CharacterRow = ({
  item,
  locale,
  t,
}: {
  item: InvisibleCharacter
  locale: 'ja' | 'en'
  t: (ja: string, en: string) => string
}) => (
  <div className="grid gap-3 px-5 py-4 sm:grid-cols-[5rem_8.5rem_minmax(12rem,1fr)_minmax(12rem,1fr)_auto] sm:items-center">
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono">
        {item.marker}
      </Badge>
    </div>
    <div className="space-y-1 font-mono text-xs">
      <div>{item.unicode}</div>
      <div className="text-muted-foreground">{item.javascript}</div>
    </div>
    <div className="min-w-0">
      <p className="font-medium">{item.name[locale]}</p>
      <p className="mt-1 text-xs text-muted-foreground">{item.description[locale]}</p>
    </div>
    <div className="text-xs text-muted-foreground">
      {t('実体の1文字をコピー', 'Copy the actual character')}
    </div>
    <CopyButton value={item.character} />
  </div>
)

export const InvisibleWorkspace = ({ tool }: WorkspaceProps) => {
  const fieldId = useId()
  const { locale } = useLocale()
  const t = useTranslate()
  const invisible = useInvisible()
  const modeOptions: { value: InvisibleMode; label: string }[] = [
    { value: 'inspect', label: t('検出・可視化', 'Inspect & visualize') },
    { value: 'catalog', label: t('文字一覧', 'Character catalog') },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={invisible.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Eye className="size-4 text-primary" />
              {t('見えない文字ツール', 'Invisible character toolkit')}
            </CardTitle>
            <SegmentedControl
              value={invisible.mode}
              onChange={invisible.setMode}
              label={t('見えない文字ツールのモード', 'Invisible character tool mode')}
              options={modeOptions}
            />
          </div>
        </CardHeader>

        {invisible.mode === 'inspect' ? (
          <div className="space-y-5 p-5">
            <Card className="overflow-hidden border-border/70">
              <CardHeader className="border-b py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-sm font-medium">
                    {t('調べるテキスト', 'Text to inspect')}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={invisible.loadSample}>
                    <Sparkles className="size-4" />
                    {t('サンプル', 'Sample')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Textarea
                  value={invisible.input}
                  onChange={(event) => invisible.setInput(event.target.value)}
                  aria-label={t('調べるテキスト', 'Text to inspect')}
                  placeholder={t('テキストを貼り付け…', 'Paste text to inspect…')}
                  className="min-h-44 resize-y rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label={t('検出数', 'Detected')} value={invisible.occurrences.length} />
              <StatTile
                label={t('種類数', 'Unique types')}
                value={new Set(invisible.occurrences.map((item) => item.unicode)).size}
              />
              <StatTile
                label={t('空白文字', 'Whitespace')}
                value={
                  invisible.occurrences.filter((item) => item.category === 'whitespace').length
                }
              />
              <StatTile
                label={t('制御・その他', 'Controls & other')}
                value={
                  invisible.occurrences.filter((item) => item.category !== 'whitespace').length
                }
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="overflow-hidden border-border/70">
                <CardHeader className="border-b py-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-medium">
                      {t('可視化プレビュー', 'Visualized preview')}
                    </CardTitle>
                    <CopyButton value={invisible.visualized} />
                  </div>
                </CardHeader>
                <CardContent className="min-h-32 p-5">
                  <pre className="whitespace-pre-wrap break-all rounded-lg border bg-muted/20 p-4 font-mono text-sm leading-7">
                    {invisible.visualized || t('入力なし', 'No input')}
                  </pre>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t(
                      '空白や制御文字を記号・名前に置き換えて表示しています。',
                      'Whitespace and control characters are shown as visible markers.',
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-border/70">
                <CardHeader className="border-b py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-sm font-medium">
                      {t('検出文字を除いた結果', 'Text without detected characters')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <CopyButton value={invisible.cleaned} />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!invisible.occurrences.length}
                        onClick={invisible.removeDetected}
                      >
                        <Trash2 className="size-4" />
                        {t('反映', 'Apply')}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <Textarea
                    readOnly
                    value={invisible.cleaned}
                    aria-label={t('検出文字を除いた結果', 'Text without detected characters')}
                    className="min-h-24 resize-y font-mono text-sm"
                  />
                  <p className="mt-3 text-xs text-destructive/80">
                    {t(
                      '注意: 結合文字・方向制御・絵文字に必要な文字まで削除すると表示や意味が壊れることがあります。',
                      'Caution: removing joiners or direction controls can break text, language shaping, or emoji.',
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden border-border/70">
              <CardHeader className="border-b bg-muted/20 py-3">
                <CardTitle className="text-sm font-medium">
                  {t('検出した文字', 'Detected characters')}
                </CardTitle>
              </CardHeader>
              {invisible.occurrences.length ? (
                <CardContent className="divide-y divide-border/60 p-0">
                  {invisible.occurrences.map((item) => (
                    <div
                      key={`${item.index}-${item.codePoint}`}
                      className="grid gap-3 px-5 py-3 sm:grid-cols-[4.5rem_5rem_8.5rem_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {t(`${item.line}行${item.column}列`, `Ln ${item.line}, Col ${item.column}`)}
                      </span>
                      <Badge variant="secondary" className="w-fit font-mono">
                        {item.marker}
                      </Badge>
                      <code className="text-xs">{item.unicode}</code>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{item.name[locale]}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.javascript}</p>
                      </div>
                      <CopyButton value={item.character} />
                    </div>
                  ))}
                </CardContent>
              ) : (
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  {t('見えない文字は検出されませんでした。', 'No invisible characters detected.')}
                </CardContent>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-invisible-search`}>
                  {t('名前・Unicode・用途で検索', 'Search by name, Unicode, or purpose')}
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`${fieldId}-invisible-search`}
                    value={invisible.query}
                    onChange={(event) => invisible.setQuery(event.target.value)}
                    placeholder={t('例：ゼロ幅、U+200B、BOM', 'e.g. zero width, U+200B, BOM')}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('カテゴリ', 'Category')}</Label>
                <SegmentedControl
                  value={invisible.category}
                  onChange={invisible.setCategory}
                  label={t('見えない文字のカテゴリ', 'Invisible character category')}
                  options={[
                    { value: 'all', label: t('すべて', 'All') },
                    { value: 'whitespace', label: t('空白', 'Whitespace') },
                    { value: 'format', label: t('制御', 'Controls') },
                    { value: 'blank', label: t('空白風', 'Blank-looking') },
                  ]}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {invisible.catalogResults.length} / {invisible.total}{' '}
              {t(
                '文字を表示中。コピーはコード表記ではなく実体の1文字です。',
                'characters shown. Copy buttons copy the actual character, not the code notation.',
              )}
            </p>
            <Card className="overflow-hidden border-border/70">
              <CardContent className="divide-y divide-border/60 p-0">
                {invisible.catalogResults.map((item) => (
                  <CharacterRow key={item.unicode} item={item} locale={locale} t={t} />
                ))}
                {!invisible.catalogResults.length && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    {t('一致する文字がありません。', 'No matching characters.')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </WorkspaceShell>
  )
}
