'use client'

import { Download, Pipette } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleRow } from '@/components/segmented-control'
import { ErrorBanner } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import { usePngTransparent } from '../hooks/use-png-transparent'

const transparencyPattern =
  'bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%),linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]'

export const PngTransparentWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const png = usePngTransparent()

  return (
    <WorkspaceShell tool={tool} onClear={png.clear}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">{t('プレビュー', 'Preview')}</CardTitle>
            {png.source && (
              <Badge variant="outline" className="font-mono text-[11px]">
                {png.source.width}×{png.source.height} · {t('透過', 'cleared')}{' '}
                {png.clearedRatio.toFixed(1)}%
              </Badge>
            )}
          </CardHeader>
          {png.error && <ErrorBanner message={png.error} />}
          <CardContent className="p-3">
            {png.source ? (
              <div className={cn('overflow-hidden rounded-xl border', transparencyPattern)}>
                <canvas
                  ref={png.canvasRef}
                  onClick={png.pick}
                  aria-label={t('クリックで色を選択', 'Click to sample a colour')}
                  className="block max-h-[32rem] w-full cursor-crosshair object-contain"
                />
              </div>
            ) : (
              <p className="px-5 py-24 text-center text-sm text-muted-foreground">
                {png.busy
                  ? t('読み込み中…', 'Loading…')
                  : t('画像を選択してください', 'Choose an image to begin')}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <Label htmlFor="png-transparent-file">{t('画像ファイル', 'Image file')}</Label>
                <Input
                  id="png-transparent-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => png.load(event.target.files?.[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="png-transparent-color">
                  {t('透明にする色', 'Colour to clear')}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="png-transparent-color"
                    type="color"
                    value={png.color}
                    onChange={(event) => png.setColor(event.target.value)}
                    className="h-9 w-16 p-1"
                  />
                  <Input
                    value={png.color}
                    spellCheck={false}
                    onChange={(event) => png.setColor(event.target.value)}
                    className="font-mono"
                  />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Pipette className="size-3.5" />
                  {t(
                    'プレビューをクリックしても色を選べます。',
                    'You can also click the preview to sample a colour.',
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="png-transparent-tolerance">
                  {t(`許容差 (${png.tolerance}%)`, `Tolerance (${png.tolerance}%)`)}
                </Label>
                <Input
                  id="png-transparent-tolerance"
                  type="range"
                  min={0}
                  max={100}
                  value={png.tolerance}
                  onChange={(event) => png.setTolerance(Number(event.target.value))}
                />
              </div>

              <ToggleRow
                id="png-transparent-soften"
                label={t('境界をなめらかにする', 'Soften the edges')}
                checked={png.soften}
                onChange={png.setSoften}
              />

              <Button onClick={png.download} disabled={!png.source}>
                <Download className="size-4" />
                {t('PNGで保存', 'Save PNG')}
              </Button>
            </CardContent>
          </Card>

          <p className="px-1 text-xs text-muted-foreground">
            {t(
              '処理はすべてブラウザ内で行われ、画像はアップロードされません。',
              'Everything runs in your browser — the image is never uploaded.',
            )}
          </p>
        </div>
      </div>
    </WorkspaceShell>
  )
}
