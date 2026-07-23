'use client'

import { Input } from '@/components/ui/input'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { useTranslate } from '@/hooks/use-translate'
import { type CronFieldName, cronFieldSpec } from '../functions/cron'
import type { CronFieldMode, CronFieldSpec } from '../functions/cron-builder'
import type { CronBuilderField } from '../hooks/use-cron'

const modeLabels: Record<CronFieldMode, { ja: string; en: string }> = {
  every: { ja: '毎回', en: 'Every' },
  specific: { ja: '指定', en: 'Specific' },
  step: { ja: '間隔', en: 'Step' },
  range: { ja: '範囲', en: 'Range' },
  list: { ja: 'リスト', en: 'List' },
  blank: { ja: '指定なし', en: 'Blank' },
  advanced: { ja: '自由入力', en: 'Raw' },
}

/** `?` only means anything in the two day fields, so hide it elsewhere. */
const modesFor = (name: CronFieldName): CronFieldMode[] => {
  const base: CronFieldMode[] = ['every', 'specific', 'step', 'range', 'list']
  const days = name === 'dayOfMonth' || name === 'dayOfWeek'
  return days ? [...base, 'blank', 'advanced'] : [...base, 'advanced']
}

const NumberBox = ({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  min: number
  max: number
}) => (
  <Input
    aria-label={label}
    value={value}
    inputMode="numeric"
    spellCheck={false}
    placeholder={`${min}-${max}`}
    onChange={(event) => onChange(event.target.value)}
    className="h-8 w-20 font-mono text-xs"
  />
)

export const CronFieldBuilder = ({
  field,
  onChange,
}: {
  field: CronBuilderField
  onChange: (name: CronFieldName, spec: CronFieldSpec) => void
}) => {
  const t = useTranslate()
  const bounds = cronFieldSpec(field.name)
  const { spec } = field

  const update = (patch: Partial<CronFieldSpec>) => onChange(field.name, { ...spec, ...patch })

  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
      <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5">
        <span className="text-sm font-medium">{t(bounds.label.ja, bounds.label.en)}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {bounds.min}-{bounds.max}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          value={spec.mode}
          label={t(`${bounds.label.ja}の指定方法`, `${bounds.label.en} mode`)}
          options={modesFor(field.name).map((mode) => ({
            value: mode,
            label: t(modeLabels[mode].ja, modeLabels[mode].en),
          }))}
          onChange={(mode) => update({ mode })}
        />

        {spec.mode === 'specific' && (
          <NumberBox
            label={t('値', 'Value')}
            value={spec.value}
            onChange={(value) => update({ value })}
            min={bounds.min}
            max={bounds.max}
          />
        )}

        {spec.mode === 'step' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('間隔', 'Every')}</span>
            <NumberBox
              label={t('間隔', 'Step')}
              value={spec.step}
              onChange={(step) => update({ step })}
              min={1}
              max={bounds.max}
            />
            <span>{t('開始', 'from')}</span>
            <NumberBox
              label={t('開始', 'Start')}
              value={spec.from}
              onChange={(from) => update({ from })}
              min={bounds.min}
              max={bounds.max}
            />
          </div>
        )}

        {spec.mode === 'range' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <NumberBox
              label={t('開始', 'From')}
              value={spec.from}
              onChange={(from) => update({ from })}
              min={bounds.min}
              max={bounds.max}
            />
            <span>–</span>
            <NumberBox
              label={t('終了', 'To')}
              value={spec.to}
              onChange={(to) => update({ to })}
              min={bounds.min}
              max={bounds.max}
            />
          </div>
        )}

        {spec.mode === 'list' && (
          <Input
            aria-label={t('値のリスト', 'Value list')}
            value={spec.value}
            spellCheck={false}
            placeholder={`${bounds.min},${bounds.min + 1}`}
            onChange={(event) => update({ value: event.target.value })}
            className="h-8 w-40 font-mono text-xs"
          />
        )}

        {spec.mode === 'advanced' && (
          <Input
            aria-label={t('式', 'Expression')}
            value={spec.raw}
            spellCheck={false}
            placeholder="L, 15W, 5#2"
            onChange={(event) => update({ raw: event.target.value })}
            className="h-8 w-40 font-mono text-xs"
          />
        )}

        <code className="ml-auto rounded bg-muted px-2 py-1 font-mono text-xs">{field.token}</code>
      </div>
    </div>
  )
}
