'use client'

import { Check, Dices, Search, Smile } from 'lucide-react'
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
import type { Locale } from '@/i18n/dictionaries'
import type { WorkspaceProps } from '@/workspaces/types'
import type { KaomojiCategory, KaomojiEntry } from '../functions/kaomoji'
import {
  getKaomojiCodePoints,
  getKaomojiDisplayWidth,
  getKaomojiHtml,
  getKaomojiUnicodeEscape,
  kaomojiCategories,
} from '../functions/kaomoji'
import type { PairPart, SinglePart } from '../functions/kaomoji-parts'
import {
  kaomojiArms,
  kaomojiBrackets,
  kaomojiDecorations,
  kaomojiEyes,
  kaomojiMouths,
} from '../functions/kaomoji-parts'
import { type KaomojiMode, useKaomoji } from '../hooks/use-kaomoji'
import { useKaomojiGrid } from '../hooks/use-kaomoji-grid'

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
    celebrate: t('祝う・応援', 'Celebration & cheering'),
    trouble: t('困る・謝る', 'Trouble & apology'),
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

/*
 * Kaomoji range from 3 to over 25 columns wide. Rather than clip the art, wide
 * entries shrink a step and claim a double-width cell so the whole face stays
 * on one line. Thresholds are in columns, not characters, because a short run
 * of full-width glyphs is far wider than the same number of ASCII ones.
 */
const tileLayout = (kaomoji: string) => {
  const width = getKaomojiDisplayWidth(kaomoji)
  if (width > 16) return { span: 'col-span-2', font: 'text-xs' }
  if (width > 10) return { span: '', font: 'text-sm' }
  return { span: '', font: 'text-base' }
}

const KaomojiTile = ({
  item,
  index,
  focused,
  registerRef,
  onFocus,
  selected,
  copied,
  onPick,
  locale,
  copiedLabel,
}: {
  item: KaomojiEntry
  index: number
  focused: boolean
  registerRef: (element: HTMLButtonElement | null) => void
  onFocus: (index: number) => void
  selected: boolean
  copied: boolean
  onPick: (item: KaomojiEntry) => void
  locale: Locale
  copiedLabel: string
}) => {
  const { span, font } = tileLayout(item.kaomoji)
  return (
    <button
      type="button"
      ref={registerRef}
      // Roving tabindex: the grid is a single tab stop, arrows move inside it.
      tabIndex={focused ? 0 : -1}
      onFocus={() => onFocus(index)}
      onClick={() => onPick(item)}
      className={`relative flex min-h-20 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border p-2 text-center transition-colors hover:border-primary/60 hover:bg-accent/60 ${span} ${selected ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
      title={item.name[locale]}
    >
      <span className={`max-w-full whitespace-nowrap leading-none ${font}`}>{item.kaomoji}</span>
      <span className="max-w-full truncate text-[11px] text-muted-foreground">
        {item.name[locale]}
      </span>
      {copied && (
        <span className="absolute inset-0 flex items-center justify-center gap-1 bg-primary/90 text-xs font-medium text-primary-foreground">
          <Check className="size-3.5" />
          {copiedLabel}
        </span>
      )}
    </button>
  )
}

const PartSelect = <Part extends PairPart | SinglePart>({
  id,
  label,
  parts,
  value,
  onChange,
  locale,
}: {
  id: string
  label: string
  parts: readonly Part[]
  value: string
  onChange: (value: string) => void
  locale: Locale
}) => {
  const active = parts.find((part) => part.id === value) ?? parts[0]
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{active.label[locale]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {parts.map((part) => (
            <SelectItem key={part.id} value={part.id}>
              {part.label[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const KaomojiWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const kaomoji = useKaomoji()
  const grid = useKaomojiGrid(kaomoji.results.length)

  const modeOptions: { value: KaomojiMode; label: string }[] = [
    { value: 'list', label: t('一覧・検索', 'Browse & search') },
    { value: 'build', label: t('パーツ組み立て', 'Parts builder') },
  ]

  const copiedLabel = t('コピーしました', 'Copied')

  return (
    <WorkspaceShell tool={tool} onClear={kaomoji.clear}>
      {/*
       * `overflow-clip` rather than `overflow-hidden`: both clip to the rounded
       * corners, but only `hidden` establishes a scroll container, which would
       * leave the sticky selection panel below pinned to a box that never
       * scrolls — that is, not sticky at all.
       */}
      <Card className="overflow-clip border-border/70 shadow-xl shadow-foreground/[0.03]">
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
          /*
           * One column on small screens ordered controls -> selection -> grid, so
           * the outputs are not stranded behind 250 tiles. From `lg` it becomes
           * two columns with the selection pinned beside the scrolling grid.
           */
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_20rem]">
            <CardContent className="order-1 min-w-0 space-y-4 p-5 pb-0 lg:col-start-1 lg:row-start-1 lg:border-r">
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
                    placeholder={t('例：泣く、ネコ、shrug', 'e.g. cry, cat, shrug')}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">{t('カテゴリ', 'Category')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {kaomojiCategories.map((category) => {
                    const count = kaomoji.counts.get(category) ?? 0
                    const active = category === kaomoji.category
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={active}
                        disabled={count === 0 && !active}
                        onClick={() => kaomoji.setCategory(category)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border/70 bg-background hover:border-primary/60 hover:bg-accent/60'
                        }`}
                      >
                        {categoryLabel(category, t)}
                        <span
                          className={
                            active ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }
                        >
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {t(
                  'タイルをクリックするとコピーします。矢印キーで移動できます。',
                  'Click a tile to copy it. Arrow keys move around the grid.',
                )}
              </p>
            </CardContent>

            {/* Arrow keys are routed here and delegated to the focusable tiles inside. */}
            <CardContent
              className="order-3 min-w-0 space-y-5 p-5 pt-4 lg:col-start-1 lg:row-start-2 lg:border-r"
              onKeyDown={grid.onKeyDown}
            >
              {kaomoji.groups.map((group) => (
                <section key={group.category} className="space-y-2">
                  {kaomoji.category === 'all' && (
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {categoryLabel(group.category, t)}
                      <span className="ml-2 font-normal normal-case tracking-normal">
                        {group.entries.length}
                      </span>
                    </h2>
                  )}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {group.entries.map((item, index) => (
                      <KaomojiTile
                        key={`${item.category}-${item.kaomoji}`}
                        item={item}
                        index={group.offset + index}
                        focused={group.offset + index === grid.focusedIndex}
                        registerRef={grid.register(group.offset + index)}
                        onFocus={grid.setFocusedIndex}
                        selected={item.kaomoji === kaomoji.selected.kaomoji}
                        copied={item.kaomoji === kaomoji.copiedValue}
                        onPick={(picked) => void kaomoji.pick(picked)}
                        locale={locale}
                        copiedLabel={copiedLabel}
                      />
                    ))}
                  </div>
                </section>
              ))}
              {kaomoji.results.length === 0 && (
                <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t(
                    '一致する顔文字がありません。検索語やカテゴリを変えてください。',
                    'No matching kaomoji. Try another query or category.',
                  )}
                </p>
              )}
            </CardContent>

            <div className="order-2 min-w-0 border-t bg-muted/10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start lg:border-t-0 lg:sticky lg:top-4">
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
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <CardContent className="min-w-0 space-y-5 p-5 lg:border-r">
              <div className="grid gap-4 sm:grid-cols-2">
                <PartSelect
                  id="kaomoji-eyes"
                  label={t('目', 'Eyes')}
                  parts={kaomojiEyes}
                  value={kaomoji.parts.eyes}
                  onChange={(value) => kaomoji.setPart('eyes', value)}
                  locale={locale}
                />
                <PartSelect
                  id="kaomoji-mouth"
                  label={t('口', 'Mouth')}
                  parts={kaomojiMouths}
                  value={kaomoji.parts.mouth}
                  onChange={(value) => kaomoji.setPart('mouth', value)}
                  locale={locale}
                />
                <PartSelect
                  id="kaomoji-brackets"
                  label={t('輪郭・括弧', 'Outline')}
                  parts={kaomojiBrackets}
                  value={kaomoji.parts.brackets}
                  onChange={(value) => kaomoji.setPart('brackets', value)}
                  locale={locale}
                />
                <PartSelect
                  id="kaomoji-arms"
                  label={t('腕', 'Arms')}
                  parts={kaomojiArms}
                  value={kaomoji.parts.arms}
                  onChange={(value) => kaomoji.setPart('arms', value)}
                  locale={locale}
                />
                <PartSelect
                  id="kaomoji-decoration"
                  label={t('飾り', 'Decoration')}
                  parts={kaomojiDecorations}
                  value={kaomoji.parts.decoration}
                  onChange={(value) => kaomoji.setPart('decoration', value)}
                  locale={locale}
                />
              </div>

              <Button variant="outline" onClick={kaomoji.randomize}>
                <Dices className="size-4" />
                {t('ランダムに組み立てる', 'Randomise the parts')}
              </Button>

              <p className="text-xs leading-5 text-muted-foreground">
                {t(
                  'パーツは内側から順に、目・口・目を括弧で囲み、その外側に腕と飾りを付けて組み立てます。',
                  'Parts nest outward: eyes and mouth sit inside the outline, then the arms and decoration wrap around it.',
                )}
              </p>
            </CardContent>

            <div className="min-w-0 border-t bg-muted/10 lg:border-t-0">
              <div className="border-b px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t('組み立て結果', 'Built kaomoji')}
                  </p>
                  <CopyButton value={kaomoji.built} />
                </div>
                <p className="mt-4 min-h-12 break-all text-2xl leading-snug">{kaomoji.built}</p>
                <Badge variant="secondary" className="mt-2">
                  {Array.from(kaomoji.built).length} {t('文字', 'chars')}
                </Badge>
              </div>
              <div>
                <OutputRow label={t('テキスト', 'Text')} value={kaomoji.built} />
                <OutputRow label="Unicode" value={getKaomojiCodePoints(kaomoji.built)} />
                <OutputRow
                  label={t('HTMLエンティティ', 'HTML entities')}
                  value={getKaomojiHtml(kaomoji.built)}
                />
                <OutputRow
                  label={t('JS・JSONエスケープ', 'JS / JSON escape')}
                  value={getKaomojiUnicodeEscape(kaomoji.built)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </WorkspaceShell>
  )
}
