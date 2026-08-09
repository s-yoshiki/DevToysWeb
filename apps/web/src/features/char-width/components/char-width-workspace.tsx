'use client'

import { Sparkles } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl, ToggleRow } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CodeArea, Pane, PaneGrid, PaneHeader } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import type { KanaConversion, WidthDirection, WidthTarget } from '../functions/char-width'
import { widthTargets } from '../functions/char-width'
import { useCharWidth } from '../hooks/use-char-width'

const targetLabel = (target: WidthTarget, t: (ja: string, en: string) => string) => {
  const labels: Record<WidthTarget, string> = {
    alphanumeric: t('英数字', 'Alphanumerics'),
    symbol: t('記号', 'Symbols'),
    katakana: t('カタカナ', 'Katakana'),
    space: t('スペース', 'Space'),
  }
  return labels[target]
}

export const CharWidthWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const charWidth = useCharWidth()

  const directionOptions: { value: WidthDirection; label: string }[] = [
    { value: 'toHalfWidth', label: t('全角 → 半角', 'Full → half') },
    { value: 'toFullWidth', label: t('半角 → 全角', 'Half → full') },
  ]

  const kanaOptions: { value: KanaConversion; label: string }[] = [
    { value: 'none', label: t('変換しない', 'Keep') },
    { value: 'toKatakana', label: t('カタカナへ', 'To katakana') },
    { value: 'toHiragana', label: t('ひらがなへ', 'To hiragana') },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={charWidth.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">{t('変換方向', 'Direction')}</CardTitle>
            <SegmentedControl
              value={charWidth.options.direction}
              onChange={charWidth.setDirection}
              label={t('変換方向', 'Direction')}
              options={directionOptions}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <Label>{t('変換する文字種', 'Character classes to convert')}</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {widthTargets.map((target) => (
                  <ToggleRow
                    key={target}
                    id={`char-width-${target}`}
                    label={targetLabel(target, t)}
                    checked={charWidth.options.targets[target]}
                    onChange={(checked) => charWidth.toggleTarget(target, checked)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>{t('ひらがな・カタカナ', 'Hiragana and katakana')}</Label>
              <SegmentedControl
                value={charWidth.options.kana}
                onChange={charWidth.setKana}
                label={t('かな変換', 'Kana conversion')}
                options={kanaOptions}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                {t(
                  '幅の変換のあとに適用されます。半角カタカナは全角へ寄せてから変換されます。',
                  'Applied after the width conversion, so half-width katakana are widened first.',
                )}
              </p>
            </div>
          </div>
          <PaneGrid>
            <Pane>
              <PaneHeader
                title={dictionary.input}
                actions={
                  <Button variant="ghost" size="sm" onClick={charWidth.loadSample}>
                    <Sparkles className="size-4" />
                    {t('サンプル', 'Sample')}
                  </Button>
                }
              />
              <CodeArea
                value={charWidth.input}
                onChange={(event) => charWidth.setInput(event.target.value)}
                aria-label={dictionary.input}
                placeholder={t('テキストを貼り付け…', 'Paste text…')}
              />
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={dictionary.output}
                actions={<CopyButton value={charWidth.output} />}
              />
              <CodeArea readOnly value={charWidth.output} aria-label={dictionary.output} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 border-t px-5 py-3 text-xs text-muted-foreground">
                <span>
                  {t('入力', 'Input')}: {charWidth.stats.inputLength}
                </span>
                <span>
                  {t('出力', 'Output')}: {charWidth.stats.outputLength}
                </span>
                <span>
                  {t('変化した文字', 'Changed')}: {charWidth.stats.changed}
                </span>
              </div>
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
