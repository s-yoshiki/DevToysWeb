'use client'

import { Play } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslate } from '@/hooks/use-translate'
import { CopyButton } from '../../components/copy-button'
import { SegmentedControl, ToggleRow } from '../../components/segmented-control'
import { WorkspaceShell } from '../../components/workspace-shell'
import type { LoremLanguage, LoremUnit } from '../../domain/lorem'
import type { WorkspaceProps } from '../types'
import { useLorem } from './use-lorem'

export const LoremWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const lorem = useLorem()

  return (
    <WorkspaceShell tool={tool} onClear={lorem.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('生成設定', 'Generator settings')}
            </CardTitle>
            <Button size="sm" onClick={lorem.regenerate}>
              <Play className="size-4" />
              {dictionary.generate}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('単位', 'Unit')}</Label>
              <SegmentedControl<LoremUnit>
                value={lorem.unit}
                onChange={lorem.setUnit}
                label={t('単位', 'Unit')}
                options={[
                  { value: 'paragraphs', label: t('段落', 'Paragraphs') },
                  { value: 'sentences', label: t('文', 'Sentences') },
                  { value: 'words', label: t('単語', 'Words') },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('言語', 'Language')}</Label>
              <SegmentedControl<LoremLanguage>
                value={lorem.language}
                onChange={lorem.setLanguage}
                label={t('言語', 'Language')}
                options={[
                  { value: 'la', label: 'Lorem Ipsum' },
                  { value: 'ja', label: t('日本語', 'Japanese') },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lorem-count">{t('個数', 'Count')}</Label>
              <Input
                id="lorem-count"
                type="number"
                min={1}
                max={200}
                value={lorem.count}
                onChange={(event) => lorem.setCount(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end pb-1">
              <div className="w-full">
                <ToggleRow
                  id="lorem-start"
                  label={t('"Lorem ipsum" で開始', 'Start with “Lorem ipsum”')}
                  checked={lorem.startWithLorem}
                  onChange={lorem.setStartWithLorem}
                />
              </div>
            </div>
          </div>
          <div className="flex min-h-[380px] flex-col bg-muted/15">
            <div className="flex h-11 items-center justify-between border-b px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.output}
              </span>
              <CopyButton value={lorem.output} />
            </div>
            <Textarea
              readOnly
              value={lorem.output}
              aria-label={dictionary.output}
              className="min-h-72 flex-1 resize-none rounded-none border-0 bg-transparent p-5 text-sm leading-7 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
