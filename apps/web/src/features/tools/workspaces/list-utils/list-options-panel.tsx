'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { SegmentedControl, ToggleRow } from '../../components/segmented-control'
import type { ListOptions } from '../../domain/text-tools'

export const ListOptionsPanel = ({
  options,
  update,
}: {
  options: ListOptions
  update: (patch: Partial<ListOptions>) => void
}) => {
  const t = useTranslate()
  return (
    <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <Label>{t('並べ替え', 'Sort')}</Label>
        <SegmentedControl
          value={options.sort}
          onChange={(sort) => update({ sort })}
          label={t('並べ替え', 'Sort')}
          options={[
            { value: 'none', label: t('なし', 'None') },
            { value: 'asc', label: 'A→Z' },
            { value: 'desc', label: 'Z→A' },
            { value: 'natural', label: t('自然順', 'Natural') },
            { value: 'length', label: t('長さ', 'Length') },
          ]}
        />
      </div>
      <div className="space-y-3">
        <ToggleRow
          id="list-trim"
          label={t('前後の空白を除去', 'Trim whitespace')}
          checked={options.trim}
          onChange={(trim) => update({ trim })}
        />
        <ToggleRow
          id="list-empty"
          label={t('空行を削除', 'Drop empty lines')}
          checked={options.dropEmpty}
          onChange={(dropEmpty) => update({ dropEmpty })}
        />
      </div>
      <div className="space-y-3">
        <ToggleRow
          id="list-unique"
          label={t('重複を除去', 'Remove duplicates')}
          checked={options.unique}
          onChange={(unique) => update({ unique })}
        />
        <ToggleRow
          id="list-reverse"
          label={t('逆順にする', 'Reverse order')}
          checked={options.reverse}
          onChange={(reverse) => update({ reverse })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="list-prefix">{t('各行の前', 'Prefix')}</Label>
        <Input
          id="list-prefix"
          value={options.prefix}
          onChange={(event) => update({ prefix: event.target.value })}
          className="font-mono"
          placeholder="'"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="list-suffix">{t('各行の後', 'Suffix')}</Label>
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
          label={t('連番を振る', 'Number the lines')}
          checked={options.numbered}
          onChange={(numbered) => update({ numbered })}
        />
        <div className="space-y-2">
          <Label htmlFor="list-separator">{t('区切り', 'Join with')}</Label>
          <SegmentedControl
            value={options.separator}
            onChange={(separator) => update({ separator })}
            label={t('区切り', 'Join with')}
            options={[
              { value: '\n', label: t('改行', 'Newline') },
              { value: ', ', label: ', ' },
              { value: ' ', label: t('空白', 'Space') },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
