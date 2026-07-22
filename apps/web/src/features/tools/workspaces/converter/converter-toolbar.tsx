'use client'

import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import type { Converter } from './use-converter'

const DirectionSwitch = ({ converter }: { converter: Converter }) => {
  const t = useTranslate()
  const [from, to] = converter.formats
  return (
    <fieldset
      className="flex rounded-lg border bg-background p-1"
      aria-label={t('変換方向', 'Conversion direction')}
    >
      <Button
        size="sm"
        variant={converter.reverse ? 'ghost' : 'default'}
        onClick={() => converter.changeDirection(false)}
        className="h-7 px-3"
      >
        {from} <ArrowRight className="size-3" /> {to}
      </Button>
      <Button
        size="sm"
        variant={converter.reverse ? 'default' : 'ghost'}
        onClick={() => converter.changeDirection(true)}
        className="h-7 px-3"
      >
        {to} <ArrowRight className="size-3" /> {from}
      </Button>
    </fieldset>
  )
}

/** Card header: what the workspace does, plus its direction or run control. */
export const ConverterToolbar = ({ converter }: { converter: Converter }) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  return (
    <CardHeader className="border-b bg-muted/30 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <CardTitle className="text-sm font-semibold">
            {converter.isGenerator
              ? t('生成設定', 'Generator settings')
              : t('変換ワークスペース', 'Conversion workspace')}
          </CardTitle>
          {!converter.isGenerator && (
            <p className="mt-1 text-xs text-muted-foreground">
              {converter.inputFormat} <ArrowRight className="mx-1 inline size-3" />{' '}
              {converter.outputFormat}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {converter.supportsReverse && <DirectionSwitch converter={converter} />}
          {converter.isGenerator && (
            <Button size="sm" onClick={converter.run}>
              <Play className="size-4" />
              {dictionary.generate}
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
