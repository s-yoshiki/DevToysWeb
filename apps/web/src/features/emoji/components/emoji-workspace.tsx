'use client'

import { Dices, Search, Sparkles } from 'lucide-react'
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
import type { EmojiCategory, EmojiEntry } from '../functions/emoji'
import { emojiCategories, getEmojiCodePoints, getEmojiHtml } from '../functions/emoji'
import { type EmojiMode, useEmoji } from '../hooks/use-emoji'

const categoryLabel = (category: EmojiCategory | 'all', t: (ja: string, en: string) => string) => {
  const labels: Record<EmojiCategory | 'all', string> = {
    all: t('すべて', 'All'),
    smileys: t('顔・感情', 'Smileys & emotion'),
    people: t('人・体', 'People & body'),
    animals: t('動物・自然', 'Animals & nature'),
    food: t('食べ物・飲み物', 'Food & drink'),
    travel: t('旅行・場所', 'Travel & places'),
    activities: t('活動', 'Activities'),
    objects: t('物', 'Objects'),
    symbols: t('記号・旗', 'Symbols & flags'),
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

const EmojiTile = ({
  item,
  selected,
  onSelect,
  locale,
}: {
  item: EmojiEntry
  selected: boolean
  onSelect: (item: EmojiEntry) => void
  locale: 'ja' | 'en'
}) => (
  <button
    type="button"
    onClick={() => onSelect(item)}
    className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-colors hover:border-primary/60 hover:bg-accent/60 ${selected ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
    title={item.name[locale]}
  >
    <span className="text-3xl leading-none" aria-hidden="true">
      {item.emoji}
    </span>
    <span className="max-w-full truncate text-[11px] text-muted-foreground">
      {item.name[locale]}
    </span>
  </button>
)

export const EmojiWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const emoji = useEmoji()

  const modeOptions: { value: EmojiMode; label: string }[] = [
    { value: 'list', label: t('一覧・検索', 'Browse & search') },
    { value: 'generate', label: t('ランダム生成', 'Random generate') },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={emoji.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              {t('絵文字ツール', 'Emoji toolkit')}
            </CardTitle>
            <SegmentedControl
              value={emoji.mode}
              onChange={emoji.setMode}
              label={t('絵文字ツールのモード', 'Emoji tool mode')}
              options={modeOptions}
            />
          </div>
        </CardHeader>

        {emoji.mode === 'list' ? (
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <CardContent className="min-w-0 space-y-5 p-5 lg:border-r">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem]">
                <div className="space-y-2">
                  <Label htmlFor="emoji-search">
                    {t('名前・キーワード・絵文字で検索', 'Search by name, keyword, or emoji')}
                  </Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="emoji-search"
                      value={emoji.query}
                      onChange={(event) => emoji.setQuery(event.target.value)}
                      placeholder={t('例：犬、rocket、❤️', 'e.g. dog, rocket, ❤️')}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('カテゴリ', 'Category')}</Label>
                  <Select
                    value={emoji.category}
                    onValueChange={(value) =>
                      value && emoji.setCategory(value as EmojiCategory | 'all')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{categoryLabel(emoji.category, t)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {emojiCategories.map((category) => (
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
                  {emoji.results.length} / {emoji.total} {t('件', 'matches')}
                </p>
                <Badge variant="secondary">{categoryLabel(emoji.category, t)}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {emoji.results.map((item) => (
                  <EmojiTile
                    key={`${item.category}-${item.emoji}`}
                    item={item}
                    selected={item.emoji === emoji.selected.emoji}
                    onSelect={emoji.select}
                    locale={locale}
                  />
                ))}
              </div>
              {emoji.results.length === 0 && (
                <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t(
                    '一致する絵文字がありません。検索語やカテゴリを変えてください。',
                    'No matching emoji. Try another query or category.',
                  )}
                </p>
              )}
            </CardContent>

            <div className="min-w-0 border-t bg-muted/10 lg:border-t-0">
              <div className="border-b px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('選択中', 'Selected')}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-5xl leading-none" aria-hidden="true">
                    {emoji.selected.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{emoji.selected.name[locale]}</p>
                    <Badge variant="outline" className="mt-1">
                      {categoryLabel(emoji.selected.category, t)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <OutputRow label={t('テキスト', 'Text')} value={emoji.selected.emoji} />
                <OutputRow label="Unicode" value={getEmojiCodePoints(emoji.selected.emoji)} />
                <OutputRow label="HTML" value={getEmojiHtml(emoji.selected.emoji)} />
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
                    value={emoji.category}
                    onValueChange={(value) =>
                      value && emoji.setCategory(value as EmojiCategory | 'all')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{categoryLabel(emoji.category, t)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {emojiCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabel(category, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji-count">{t('個数', 'Count')}</Label>
                  <Input
                    id="emoji-count"
                    type="number"
                    min={1}
                    max={30}
                    value={emoji.count}
                    onChange={(event) => emoji.setCount(Number(event.target.value))}
                  />
                </div>
              </div>
              <Button onClick={emoji.generate}>
                <Dices className="size-4" />
                {t('絵文字を生成', 'Generate emoji')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Unicode絵文字をカテゴリからランダムに選びます。',
                  'Randomly pick Unicode emoji from the selected category.',
                )}
              </p>
            </div>

            <Card className="overflow-hidden border-border/70 bg-muted/10">
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm font-medium">
                    {t('生成結果', 'Generated result')}
                  </CardTitle>
                  <CopyButton value={emoji.generatedOutput} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="flex min-h-28 items-center justify-center rounded-lg border bg-background p-4 text-center text-4xl leading-relaxed">
                  {emoji.generatedOutput}
                </div>
                <Textarea
                  readOnly
                  value={emoji.generatedOutput}
                  aria-label={t('生成結果', 'Generated result')}
                  className="min-h-20 resize-none bg-background text-center text-lg"
                />
                <div className="flex flex-wrap gap-2">
                  {emoji.generatedTiles.map(({ item, key }) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      title={item.name[locale]}
                      onClick={() => emoji.select(item)}
                    >
                      <span className="text-lg" aria-hidden="true">
                        {item.emoji}
                      </span>
                      {item.name[locale]}
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
