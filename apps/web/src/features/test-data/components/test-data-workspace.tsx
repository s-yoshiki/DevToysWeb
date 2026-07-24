'use client'

import { RefreshCw } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { FIELD_DEFS, type OutputFormat, type TestDataLocale } from '../functions/test-data'
import { useTestData } from '../hooks/use-test-data'

export const TestDataWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale, dictionary } = useLocale()
  const t = useTranslate()
  const data = useTestData()

  return (
    <WorkspaceShell tool={tool} onClear={data.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">
                {t('生成設定', 'Generator settings')}
              </CardTitle>
              <Button size="sm" onClick={data.regenerate}>
                <RefreshCw className="size-4" />
                {t('再生成', 'Regenerate')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div>
              <Label className="mb-2 block">{t('フィールド', 'Fields')}</Label>
              <div className="flex flex-wrap gap-2">
                {FIELD_DEFS.map((field) => {
                  const active = data.selected.includes(field.key)
                  return (
                    <button
                      type="button"
                      key={field.key}
                      onClick={() => data.toggleField(field.key)}
                      aria-pressed={active}
                      className={cn(
                        'rounded-full border px-3 py-1 text-sm transition-colors',
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted',
                      )}
                    >
                      {field.label[locale]}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="td-count">{t('行数', 'Rows')}</Label>
                <Input
                  id="td-count"
                  type="number"
                  min={1}
                  max={1000}
                  value={data.count}
                  onChange={(event) =>
                    data.setCount(Math.max(1, Math.min(Number(event.target.value) || 1, 1000)))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t('言語', 'Locale')}</Label>
                <SegmentedControl<TestDataLocale>
                  value={data.locale}
                  onChange={data.setLocale}
                  label={t('言語', 'Locale')}
                  options={[
                    { value: 'ja', label: t('日本語', 'Japanese') },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('形式', 'Format')}</Label>
                <SegmentedControl<OutputFormat>
                  value={data.format}
                  onChange={data.setFormat}
                  label={t('形式', 'Format')}
                  options={[
                    { value: 'json', label: 'JSON' },
                    { value: 'csv', label: 'CSV' },
                    { value: 'tsv', label: 'TSV' },
                    { value: 'sql', label: 'SQL' },
                    { value: 'markdown', label: 'MD' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {data.selected.length > 0 && (
          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="border-b bg-muted/30 py-4">
              <CardTitle className="text-sm font-medium">
                {t('プレビュー', 'Preview')}
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {t(`先頭${data.preview.length}行`, `first ${data.preview.length} rows`)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-muted/60 backdrop-blur">
                    <tr>
                      {data.selected.map((key) => (
                        <th
                          key={key}
                          className="whitespace-nowrap border-b border-border px-3 py-2 text-left font-medium"
                        >
                          {FIELD_DEFS.find((f) => f.key === key)?.label[locale]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.preview.map((item) => (
                      <tr key={item.key} className="odd:bg-muted/10">
                        {data.selected.map((key) => (
                          <td
                            key={key}
                            className="whitespace-nowrap border-b border-border/50 px-3 py-1.5 font-mono text-xs"
                          >
                            {String(item.row[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">{dictionary.output}</CardTitle>
            <CopyButton value={data.output} />
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              readOnly
              value={data.output}
              aria-label={dictionary.output}
              className="min-h-64 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-xs shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
