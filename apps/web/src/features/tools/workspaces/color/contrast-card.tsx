'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { toRgbString, wcagLevels } from '../../domain/color'
import type { useColor } from './use-color'

/** WCAG pass/fail badges for the four text-size and level combinations. */
const ContrastLevels = ({ ratio }: { ratio: number }) => {
  const t = useTranslate()
  const levels = wcagLevels(ratio)
  const badges = [
    { label: t('AA 通常', 'AA normal'), pass: levels.aaNormal },
    { label: t('AA 大', 'AA large'), pass: levels.aaLarge },
    { label: t('AAA 通常', 'AAA normal'), pass: levels.aaaNormal },
    { label: t('AAA 大', 'AAA large'), pass: levels.aaaLarge },
  ]
  return (
    <div className="grid grid-cols-2 gap-2">
      {badges.map((level) => (
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
  )
}

export const ContrastCard = ({ color }: { color: ReturnType<typeof useColor> }) => {
  const t = useTranslate()
  return (
    <Card className="h-fit overflow-hidden border-border/70">
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="text-sm font-medium">
          {t('コントラスト比 (WCAG)', 'Contrast ratio (WCAG)')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="color-background">{t('背景色', 'Background')}</Label>
          <Input
            id="color-background"
            value={color.background}
            onChange={(event) => color.setBackground(event.target.value)}
            className="font-mono"
          />
        </div>
        {color.color && color.backgroundColor && color.ratio !== null ? (
          <>
            <div
              className="flex h-20 items-center justify-center rounded-xl border text-lg font-semibold"
              style={{
                backgroundColor: toRgbString(color.backgroundColor),
                color: toRgbString(color.color),
              }}
            >
              {t('サンプル文字', 'Sample text')}
            </div>
            <p className="text-center font-mono text-2xl font-bold tabular-nums">
              {color.ratio.toFixed(2)}:1
            </p>
            <ContrastLevels ratio={color.ratio} />
          </>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t('有効な2色を入力してください', 'Enter two valid colours to compare')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
