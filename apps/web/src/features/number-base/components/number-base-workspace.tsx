'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/features/tools/components/copy-button'
import { ToggleRow } from '@/features/tools/components/segmented-control'
import { ErrorBanner } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { maxBase, minBase } from '../functions/number-base'
import { useNumberBase } from '../hooks/use-number-base'

export const NumberBaseWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const numbers = useNumberBase()

  return (
    <WorkspaceShell tool={tool} onClear={numbers.clear}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">
              {t('どの欄を編集しても連動します', 'Edit any field and the rest follow')}
            </CardTitle>
          </CardHeader>
          {numbers.error && (
            <ErrorBanner
              title={t('変換できませんでした', 'Conversion failed')}
              message={numbers.error}
            />
          )}
          <CardContent className="space-y-4 p-5">
            {numbers.rows.map((row) => (
              <div key={row.base} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`base-${row.base}`} className="font-mono text-xs tracking-widest">
                    {row.label}
                    <span className="ml-2 text-muted-foreground">base {row.base}</span>
                  </Label>
                  <CopyButton value={row.value} />
                </div>
                <Input
                  id={`base-${row.base}`}
                  value={row.value}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) => numbers.edit(row.base, event.target.value)}
                  className="h-11 font-mono text-base"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="custom-base">{t('任意の基数', 'Custom base')}</Label>
                <Input
                  id="custom-base"
                  type="number"
                  min={minBase}
                  max={maxBase}
                  value={numbers.customBase}
                  onChange={(event) => numbers.setCustomBase(Number(event.target.value))}
                />
              </div>
              <ToggleRow
                id="group-digits"
                label={t('桁を区切って表示', 'Group digits')}
                checked={numbers.grouped}
                onChange={numbers.setGrouped}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/70">
            <CardHeader className="border-b bg-muted/30 py-3">
              <CardTitle className="text-sm">{t('ビット表現', 'Bit representation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('ビット長', 'Bit length')}</span>
                <Badge variant="outline" className="font-mono">
                  {numbers.bits}
                </Badge>
              </div>
              {numbers.complements.map((complement) => (
                <div key={complement.bits} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {t(`${complement.bits}ビット`, `${complement.bits}-bit`)}
                  </span>
                  <span className="truncate font-mono text-xs">
                    {complement.value ? (
                      `0x${complement.value}`
                    ) : (
                      <span className="text-muted-foreground/70">
                        {t('範囲外', 'out of range')}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
