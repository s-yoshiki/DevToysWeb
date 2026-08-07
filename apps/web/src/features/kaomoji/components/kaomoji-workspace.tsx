'use client'

import { Dices, Search, Smile } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import type { KaomojiCategory, KaomojiEntry } from '../functions/kaomoji'
import {
  getKaomojiCodePoints,
  getKaomojiHtml,
  getKaomojiUnicodeEscape,
  kaomojiCategories,
} from '../functions/kaomoji'
import { type KaomojiMode, useKaomoji } from '../hooks/use-kaomoji'

const categoryLabel = (
  category: KaomojiCategory | 'all',
  t: (ja: string, en: string) => string,
) => {
  const labels: Record<KaomojiCategory | 'all', string> = {
    all: t('すべて', 'All'),
    joy: t('喜び・笑い', 'Joy & laughter'),
    love: t('愛情・照れ', 'Love & bashful'),
    sad: t('悲しみ・涙', 'Sadness & tears'),
    anger: t('怒り', 'Anger'),
    surprise: t('驚き', 'Surprise'),
    greeting: t('挨拶・お辞儀', 'Greetings & bows'),
    action: t('動作・リアクション', 'Actions & reactions'),
    animal: t('動物', 'Animals'),
    misc: t('その他・装飾', 'Misc & decorated'),
  }
  return labels[category]
}

const OutputRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b last:border-b-0">
    <div className="flex h-10 items-center justify-between gap-3 px-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <CopyButton value={value} />
    </div>
    <Textarea
      readOnly
      value={value}
      aria-label={label}
      className="min-h-14 resize-none rounded-none border-x-0 border-b-0 bg-muted/15 px-4 py-3 font-mono text-xs shadow-none focus-visible:ring-0"
    />
  </div>
)

const KaomojiTile = ({
  item,
  selected,
  onSelect,
  locale,
}: {
  item: KaomojiEntry
  selected: boolean
  onSelect: (item: KaomojiEntry) => void
  locale: 'ja' | 'en'
}) => (
  <button
    type="button"
    onClick={() => onSelect(item)}
    className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center transition-colors hover:border-primary/60 hover:bg-accent/60 ${selected ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
    title={item.name[locale]}
  >
    <span className="max-w-full truncate text-base leading-none">{item.kaomoji}</span>
    <span className="max-w-full truncate text-[11px] text-muted-foreground">
      {item.name[locale]}
    </span>
  </button>
)

export const KaomojiWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const kaomoji = useKaomoji()

  const modeOptions: { value: KaomojiMode; label: string }[] = [
    { value: 'list', label: t('一覧・検索', 'Browse & search') },
    { value: 'generate', label: t('ランダム生成', 'Random generate') },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={kaomoji.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Smile className="size-4 text-primary" />
              {t('顔文字ツール', 'Kaomoji toolkit')}
            </CardTitle>
            <SegmentedControl
              value={kaomoji.mode}
              onChange={kaomoji.setMode}
              label={t('顔文字ツールのモード', 'Kaomoji tool mode')}
              options={modeOptions}
            />
          </div>
        </CardHeader>

        {kaomoji.mode === 'list' ? (
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <CardContent className="min-w-0 space-y-5 p-5 lg:border-r">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem]">
                <div className="space-y-2">
                  <Label htmlFor="kaomoji-search">
                    {t('名前・キーワード・顔文字で検索', 'Search by name, keyword, or kaomoji')}
                  </Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="kaomoji-search"
                      value={kaomoji.query}
                      onChange={(event) => kaomoji.setQuery(event.target.value)}
                      placeholder={t('例：泣く、shrug、(^_^)', 'e.g. cry, shrug, (^_^)')}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('カテゴリ', 'Category')}</Label>
                  <Select
                    value={kaomoji.category}
                    onValueChange={(value) =>
                      value && kaomoji.setCategory(value as KaomojiCategory | 'all')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{categoryLabel(kaomoji.category, t)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {kaomojiCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabel(category, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {kaomoji.results.length} / {kaomoji.total} {t('件', 'matches')}
                </p>
                <Badge variant="secondary">{categoryLabel(kaomoji.category, t)}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {kaomoji.results.map((item) => (
                  <KaomojiTile
                    key={`${item.category}-${item.kaomoji}`}
                    item={item}
                    selected={item.kaomoji === kaomoji.selected.kaomoji}
                    onSelect={kaomoji.select}
                    locale={locale}
                  />
                ))}
              </div>
              {kaomoji.results.length === 0 && (
                <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t(
                    '一致する顔文字がありません。検索語やカテゴリを変えてください。',
                    'No matching kaomoji. Try another query or category.',
                  )}
                </p>
              )}
            </CardContent>

            <div className="min-w-0 border-t bg-muted/10 lg:border-t-0">
              <div className="border-b px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('選択中', 'Selected')}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="break-all text-2xl leading-snug">{kaomoji.selected.kaomoji}</p>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{kaomoji.selected.name[locale]}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge variant="outline">{categoryLabel(kaomoji.selected.category, t)}</Badge>
                      <Badge variant="secondary">
                        {Array.from(kaomoji.selected.kaomoji).length} {t('文字', 'chars')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  {t(
                    '顔文字は通常の文字の並びです。表示が崩れる場合はエスケープした出力を使ってください。',
                    'Kaomoji are ordinary character sequences. Use an escaped output when the raw text does not survive transport.',
                  )}
                </p>
              </div>
              <div>
                <OutputRow label={t('テキスト', 'Text')} value={kaomoji.selected.kaomoji} />
                <OutputRow label="Unicode" value={getKaomojiCodePoints(kaomoji.selected.kaomoji)} />
                <OutputRow
                  label={t('HTMLエンティティ', 'HTML entities')}
                  value={getKaomojiHtml(kaomoji.selected.kaomoji)}
                />
                <OutputRow
                  label={t('JS・JSONエスケープ', 'JS / JSON escape')}
                  value={getKaomojiUnicodeEscape(kaomoji.selected.kaomoji)}
                />
              </div>
            </div>
          </div>
        ) : (
          <CardContent className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
                <div className="space-y-2">
                  <Label>{t('生成するカテゴリ', 'Generation category')}</Label>
                  <Select
                    value={kaomoji.category}
                    onValueChange={(value) =>
                      value && kaomoji.setCategory(value as KaomojiCategory | 'all')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{categoryLabel(kaomoji.category, t)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {kaomojiCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabel(category, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kaomoji-count">{t('個数', 'Count')}</Label>
                  <Input
                    id="kaomoji-count"
                    type="number"
                    min={1}
                    max={30}
                    value={kaomoji.count}
                    onChange={(event) => kaomoji.setCount(Number(event.target.value))}
                  />
                </div>
              </div>
              <Button onClick={kaomoji.generate}>
                <Dices className="size-4" />
                {t('顔文字を生成', 'Generate kaomoji')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t(
                  'カテゴリから顔文字をランダムに選び、1行に1つずつ出力します。',
                  'Randomly pick kaomoji from the selected category, one per line.',
                )}
              </p>
            </div>

            <Card className="overflow-hidden border-border/70 bg-muted/10">
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm font-medium">
                    {t('生成結果', 'Generated result')}
                  </CardTitle>
                  <CopyButton value={kaomoji.generatedOutput} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <Textarea
                  readOnly
                  value={kaomoji.generatedOutput}
                  aria-label={t('生成結果', 'Generated result')}
                  className="min-h-40 resize-none bg-background text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {kaomoji.generatedTiles.map(({ item, key }) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      title={item.name[locale]}
                      onClick={() => kaomoji.select(item)}
                    >
                      {item.kaomoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        )}
      </Card>
    </WorkspaceShell>
  )
}
