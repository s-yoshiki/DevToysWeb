'use client'

import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/copy-button'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import { unitFamilies } from '../functions/units'
import { useUnitConvert } from '../hooks/use-unit-convert'

export const UnitConvertWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { locale } = useLocale()
  const converter = useUnitConvert()

  return (
    <WorkspaceShell tool={tool} onClear={converter.clear}>
      <div className="space-y-4">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-5">
            <div className="space-y-2">
              <Label>{t('種類', 'Category')}</Label>
              <div className="flex flex-wrap gap-1.5">
                {unitFamilies.map((family) => (
                  <Button
                    key={family.id}
                    size="sm"
                    variant={family.id === converter.familyId ? 'default' : 'outline'}
                    onClick={() => converter.selectFamily(family.id)}
                  >
                    {family.name[locale]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div className="space-y-2">
                <Label htmlFor="unit-convert-value">{t('数値', 'Value')}</Label>
                <Input
                  id="unit-convert-value"
                  value={converter.input}
                  inputMode="decimal"
                  spellCheck={false}
                  onChange={(event) => converter.setInput(event.target.value)}
                  aria-invalid={!converter.valid && converter.input.trim() !== ''}
                  className="font-mono text-lg tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit-convert-unit">{t('単位', 'Unit')}</Label>
                <select
                  id="unit-convert-unit"
                  value={converter.unit.id}
                  onChange={(event) => converter.setUnitId(event.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {converter.family.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name[locale]} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!converter.valid && converter.input.trim() !== '' && (
              <p className="text-xs text-destructive">
                {t('数値を入力してください', 'Enter a number')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70">
          <CardHeader className="border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">
              {t('換算結果', 'Converted values')} — {converter.family.name[locale]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {converter.rows.map((row) => (
                <li
                  key={row.unit.id}
                  className={cn(
                    'flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3',
                    row.current && 'bg-accent/40',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm">{row.unit.name[locale]}</span>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {row.unit.symbol}
                    </Badge>
                    {row.current && (
                      <Badge variant="secondary" className="text-[10px]">
                        {t('入力', 'Input')}
                      </Badge>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="font-mono text-sm tabular-nums">{row.text}</span>
                    <CopyButton value={row.text === '—' ? '' : row.text} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
