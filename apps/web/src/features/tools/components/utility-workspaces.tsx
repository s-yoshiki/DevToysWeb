'use client'

import { Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { cn } from '@/lib/utils'
import type { ToolDefinition } from '../domain/catalog'
import {
  contrastRatio,
  parseColor,
  type Rgba,
  toHex,
  toHslString,
  toOklchString,
  toRgbString,
  wcagLevels,
} from '../domain/color'
import { generateLorem, type LoremLanguage, type LoremUnit } from '../domain/lorem'
import {
  defaultListOptions,
  type EscapeTarget,
  escapeString,
  escapeTargets,
  formatList,
  type ListOptions,
  unescapeString,
} from '../domain/text-tools'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const Segmented = <T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  label: string
}) => (
  <fieldset className="flex flex-wrap gap-1 rounded-lg border bg-background p-1" aria-label={label}>
    {options.map((option) => (
      <Button
        key={option.value}
        size="sm"
        variant={value === option.value ? 'default' : 'ghost'}
        onClick={() => onChange(option.value)}
        className="h-7 px-3"
      >
        {option.label}
      </Button>
    ))}
  </fieldset>
)

const ToggleRow = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) => (
  <div className="flex items-center justify-between gap-3">
    <Label htmlFor={id} className="text-sm font-normal">
      {label}
    </Label>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
)

/* ---------------------------------------------------------------- colour -- */

const ColorRow = ({ format, value }: { format: string; value: string }) => (
  <div className="flex items-center gap-3 border-b px-5 py-3 last:border-b-0">
    <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {format}
    </span>
    <code className="min-w-0 flex-1 truncate font-mono text-sm">{value}</code>
    <CopyButton value={value} />
  </div>
)

const wcagBadges = (ratio: number, locale: 'ja' | 'en') => {
  const levels = wcagLevels(ratio)
  return [
    { label: locale === 'ja' ? 'AA 通常' : 'AA normal', pass: levels.aaNormal },
    { label: locale === 'ja' ? 'AA 大' : 'AA large', pass: levels.aaLarge },
    { label: locale === 'ja' ? 'AAA 通常' : 'AAA normal', pass: levels.aaaNormal },
    { label: locale === 'ja' ? 'AAA 大' : 'AAA large', pass: levels.aaaLarge },
  ]
}

export const ColorWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState('#3b82f6')
  const [background, setBackground] = useState('#ffffff')

  const parsed = useMemo(() => {
    try {
      return { color: parseColor(input), error: '' }
    } catch (reason) {
      return {
        color: null,
        error: reason instanceof Error ? reason.message : 'Invalid colour',
      }
    }
  }, [input])

  const parsedBackground = useMemo(() => {
    try {
      return parseColor(background)
    } catch {
      return null
    }
  }, [background])

  const color: Rgba | null = parsed.color
  const ratio = color && parsedBackground ? contrastRatio(color, parsedBackground) : null

  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'カラー値' : 'Colour value'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-end gap-3 border-b bg-muted/20 p-5">
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="color-input">
                  {locale === 'ja' ? 'HEX / RGB / HSL' : 'HEX / RGB / HSL'}
                </Label>
                <Input
                  id="color-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="font-mono"
                  placeholder="#3b82f6"
                />
              </div>
              <input
                type="color"
                aria-label={locale === 'ja' ? 'カラーピッカー' : 'Colour picker'}
                value={color ? toHex({ ...color, a: 1 }) : '#000000'}
                onChange={(event) => setInput(event.target.value)}
                className="size-9 shrink-0 cursor-pointer rounded-lg border bg-transparent"
              />
            </div>
            {parsed.error ? (
              <p className="px-5 py-10 text-center text-sm text-destructive">{parsed.error}</p>
            ) : (
              color && (
                <>
                  <div
                    className="h-24 border-b"
                    style={{ backgroundColor: toRgbString(color) }}
                    aria-hidden="true"
                  />
                  <ColorRow format="HEX" value={toHex(color)} />
                  <ColorRow format="RGB" value={toRgbString(color)} />
                  <ColorRow format="HSL" value={toHslString(color)} />
                  <ColorRow format="OKLCH" value={toOklchString(color)} />
                </>
              )
            )}
          </CardContent>
        </Card>

        <Card className="h-fit overflow-hidden border-border/70">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'コントラスト比 (WCAG)' : 'Contrast ratio (WCAG)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="color-background">{locale === 'ja' ? '背景色' : 'Background'}</Label>
              <Input
                id="color-background"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                className="font-mono"
              />
            </div>
            {color && parsedBackground && ratio !== null ? (
              <>
                <div
                  className="flex h-20 items-center justify-center rounded-xl border text-lg font-semibold"
                  style={{
                    backgroundColor: toRgbString(parsedBackground),
                    color: toRgbString(color),
                  }}
                >
                  {locale === 'ja' ? 'サンプル文字' : 'Sample text'}
                </div>
                <p className="text-center font-mono text-2xl font-bold tabular-nums">
                  {ratio.toFixed(2)}:1
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {wcagBadges(ratio, locale).map((level) => (
                    <Badge
                      key={level.label}
                      variant={level.pass ? 'default' : 'outline'}
                      className={cn(
                        'justify-center py-1',
                        level.pass ? 'bg-emerald-600 text-white' : 'text-muted-foreground',
                      )}
                    >
                      {level.pass ? '✓' : '✕'} {level.label}
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {locale === 'ja'
                  ? '有効な2色を入力してください'
                  : 'Enter two valid colours to compare'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SpecializedShell>
  )
}

/* ----------------------------------------------------------------- lorem -- */

export const LoremWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const [unit, setUnit] = useState<LoremUnit>('paragraphs')
  const [count, setCount] = useState(3)
  const [language, setLanguage] = useState<LoremLanguage>('la')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [seed, setSeed] = useState(0)

  const output = useMemo(
    // `seed` is unused on purpose: bumping it is what re-rolls the random text.
    () => (seed >= 0 ? generateLorem({ unit, count, language, startWithLorem }) : ''),
    [unit, count, language, startWithLorem, seed],
  )

  return (
    <SpecializedShell tool={tool} onClear={() => setCount(3)}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? '生成設定' : 'Generator settings'}
            </CardTitle>
            <Button size="sm" onClick={() => setSeed((value) => value + 1)}>
              <Play className="size-4" />
              {dictionary.generate}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '単位' : 'Unit'}</Label>
              <Segmented
                value={unit}
                onChange={setUnit}
                label={locale === 'ja' ? '単位' : 'Unit'}
                options={[
                  { value: 'paragraphs', label: locale === 'ja' ? '段落' : 'Paragraphs' },
                  { value: 'sentences', label: locale === 'ja' ? '文' : 'Sentences' },
                  { value: 'words', label: locale === 'ja' ? '単語' : 'Words' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '言語' : 'Language'}</Label>
              <Segmented
                value={language}
                onChange={setLanguage}
                label={locale === 'ja' ? '言語' : 'Language'}
                options={[
                  { value: 'la', label: 'Lorem Ipsum' },
                  { value: 'ja', label: locale === 'ja' ? '日本語' : 'Japanese' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lorem-count">{locale === 'ja' ? '個数' : 'Count'}</Label>
              <Input
                id="lorem-count"
                type="number"
                min={1}
                max={200}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end pb-1">
              <div className="w-full">
                <ToggleRow
                  id="lorem-start"
                  label={locale === 'ja' ? '"Lorem ipsum" で開始' : 'Start with “Lorem ipsum”'}
                  checked={startWithLorem}
                  onChange={setStartWithLorem}
                />
              </div>
            </div>
          </div>
          <div className="flex min-h-[380px] flex-col bg-muted/15">
            <div className="flex h-11 items-center justify-between border-b px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.output}
              </span>
              <CopyButton value={output} />
            </div>
            <Textarea
              readOnly
              value={output}
              aria-label={dictionary.output}
              className="min-h-72 flex-1 resize-none rounded-none border-0 bg-transparent p-5 text-sm leading-7 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

/* --------------------------------------------------------- string escape -- */

const escapeLabels: Record<EscapeTarget, string> = {
  json: 'JSON',
  javascript: 'JavaScript',
  sql: 'SQL',
  regex: 'RegExp',
  shell: 'Shell',
  csv: 'CSV',
}

export const StringEscapeWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const [target, setTarget] = useState<EscapeTarget>('json')
  const [reverse, setReverse] = useState(false)
  const [input, setInput] = useState('He said "hello"\tand left.\nPath: C:\\tmp')

  const result = useMemo(() => {
    if (!input) return { output: '', error: '' }
    try {
      return {
        output: reverse ? unescapeString(input, target) : escapeString(input, target),
        error: '',
      }
    } catch (reason) {
      return { output: '', error: reason instanceof Error ? reason.message : 'Invalid input' }
    }
  }, [input, reverse, target])

  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'エスケープ対象' : 'Escape target'}
            </CardTitle>
            <Segmented
              value={reverse ? 'unescape' : 'escape'}
              onChange={(value) => setReverse(value === 'unescape')}
              label={locale === 'ja' ? '変換方向' : 'Direction'}
              options={[
                { value: 'escape', label: locale === 'ja' ? 'エスケープ' : 'Escape' },
                { value: 'unescape', label: locale === 'ja' ? '解除' : 'Unescape' },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Segmented
              value={target}
              onChange={setTarget}
              label={locale === 'ja' ? 'エスケープ対象' : 'Escape target'}
              options={escapeTargets.map((value) => ({ value, label: escapeLabels[value] }))}
            />
          </div>
          {result.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {result.error}
            </p>
          )}
          <div className="grid min-h-[400px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.input}
              </div>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label={dictionary.input}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {dictionary.output}
                </span>
                <CopyButton value={result.output} />
              </div>
              <Textarea
                readOnly
                value={result.output}
                aria-label={dictionary.output}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

/* ------------------------------------------------------------ list utils -- */

const sampleList = `banana
apple
Cherry
apple

item 10
item 2`

export const ListUtilsWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const [input, setInput] = useState(sampleList)
  const [options, setOptions] = useState<ListOptions>(defaultListOptions)
  const update = (patch: Partial<ListOptions>) =>
    setOptions((previous) => ({ ...previous, ...patch }))

  const output = useMemo(() => formatList(input, options), [input, options])
  const lineCount = output ? output.split(options.separator).length : 0

  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {locale === 'ja' ? '整形オプション' : 'Formatting options'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '並べ替え' : 'Sort'}</Label>
              <Segmented
                value={options.sort}
                onChange={(sort) => update({ sort })}
                label={locale === 'ja' ? '並べ替え' : 'Sort'}
                options={[
                  { value: 'none', label: locale === 'ja' ? 'なし' : 'None' },
                  { value: 'asc', label: 'A→Z' },
                  { value: 'desc', label: 'Z→A' },
                  { value: 'natural', label: locale === 'ja' ? '自然順' : 'Natural' },
                  { value: 'length', label: locale === 'ja' ? '長さ' : 'Length' },
                ]}
              />
            </div>
            <div className="space-y-3">
              <ToggleRow
                id="list-trim"
                label={locale === 'ja' ? '前後の空白を除去' : 'Trim whitespace'}
                checked={options.trim}
                onChange={(trim) => update({ trim })}
              />
              <ToggleRow
                id="list-empty"
                label={locale === 'ja' ? '空行を削除' : 'Drop empty lines'}
                checked={options.dropEmpty}
                onChange={(dropEmpty) => update({ dropEmpty })}
              />
            </div>
            <div className="space-y-3">
              <ToggleRow
                id="list-unique"
                label={locale === 'ja' ? '重複を除去' : 'Remove duplicates'}
                checked={options.unique}
                onChange={(unique) => update({ unique })}
              />
              <ToggleRow
                id="list-reverse"
                label={locale === 'ja' ? '逆順にする' : 'Reverse order'}
                checked={options.reverse}
                onChange={(reverse) => update({ reverse })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-prefix">{locale === 'ja' ? '各行の前' : 'Prefix'}</Label>
              <Input
                id="list-prefix"
                value={options.prefix}
                onChange={(event) => update({ prefix: event.target.value })}
                className="font-mono"
                placeholder="'"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-suffix">{locale === 'ja' ? '各行の後' : 'Suffix'}</Label>
              <Input
                id="list-suffix"
                value={options.suffix}
                onChange={(event) => update({ suffix: event.target.value })}
                className="font-mono"
                placeholder="',"
              />
            </div>
            <div className="space-y-3">
              <ToggleRow
                id="list-numbered"
                label={locale === 'ja' ? '連番を振る' : 'Number the lines'}
                checked={options.numbered}
                onChange={(numbered) => update({ numbered })}
              />
              <div className="space-y-2">
                <Label htmlFor="list-separator">{locale === 'ja' ? '区切り' : 'Join with'}</Label>
                <Segmented
                  value={options.separator}
                  onChange={(separator) => update({ separator })}
                  label={locale === 'ja' ? '区切り' : 'Join with'}
                  options={[
                    { value: '\n', label: locale === 'ja' ? '改行' : 'Newline' },
                    { value: ', ', label: ', ' },
                    { value: ' ', label: locale === 'ja' ? '空白' : 'Space' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="grid min-h-[400px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.input}
              </div>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label={dictionary.input}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {dictionary.output} ({lineCount})
                </span>
                <CopyButton value={output} />
              </div>
              <Textarea
                readOnly
                value={output}
                aria-label={dictionary.output}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
