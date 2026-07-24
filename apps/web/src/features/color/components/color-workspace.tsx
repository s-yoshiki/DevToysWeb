'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toHex, toHslString, toOklchString, toRgbString } from '@/features/color/functions/color'
import { CopyButton } from '@/components/copy-button'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useColor } from '../hooks/use-color'
import { ContrastCard } from './contrast-card'

const ColorRow = ({ format, value }: { format: string; value: string }) => (
  <div className="flex items-center gap-3 border-b px-5 py-3 last:border-b-0">
    <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {format}
    </span>
    <code className="min-w-0 flex-1 truncate font-mono text-sm">{value}</code>
    <CopyButton value={value} />
  </div>
)

export const ColorWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const color = useColor()

  return (
    <WorkspaceShell tool={tool} onClear={color.clear}>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">{t('カラー値', 'Colour value')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-end gap-3 border-b bg-muted/20 p-5">
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="color-input">HEX / RGB / HSL</Label>
                <Input
                  id="color-input"
                  value={color.input}
                  onChange={(event) => color.setInput(event.target.value)}
                  className="font-mono"
                  placeholder="#3b82f6"
                />
              </div>
              <input
                type="color"
                aria-label={t('カラーピッカー', 'Colour picker')}
                value={color.color ? toHex({ ...color.color, a: 1 }) : '#000000'}
                onChange={(event) => color.setInput(event.target.value)}
                className="size-9 shrink-0 cursor-pointer rounded-lg border bg-transparent"
              />
            </div>
            {color.error ? (
              <p className="px-5 py-10 text-center text-sm text-destructive">{color.error}</p>
            ) : (
              color.color && (
                <>
                  <div
                    className="h-24 border-b"
                    style={{ backgroundColor: toRgbString(color.color) }}
                    aria-hidden="true"
                  />
                  <ColorRow format="HEX" value={toHex(color.color)} />
                  <ColorRow format="RGB" value={toRgbString(color.color)} />
                  <ColorRow format="HSL" value={toHslString(color.color)} />
                  <ColorRow format="OKLCH" value={toOklchString(color.color)} />
                </>
              )
            )}
          </CardContent>
        </Card>
        <ContrastCard color={color} />
      </div>
    </WorkspaceShell>
  )
}
