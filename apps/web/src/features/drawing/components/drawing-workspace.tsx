'use client'

import { Download, Eraser, Pencil, Redo2, Trash2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/segmented-control'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { Background } from '../functions/canvas'
import { brushColors, useDrawing } from '../hooks/use-drawing'

/** Checkerboard so a transparent canvas reads as transparent, not as white. */
const transparencyPattern =
  'bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%),linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]'

export const DrawingWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const drawing = useDrawing()

  return (
    <WorkspaceShell tool={tool} onClear={drawing.clear}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card className="overflow-hidden border-border/70">
          <CardContent className="p-3">
            <div className={cn('overflow-hidden rounded-xl border', transparencyPattern)}>
              <canvas
                ref={drawing.canvasRef}
                width={drawing.canvasWidth}
                height={drawing.canvasHeight}
                onPointerDown={drawing.begin}
                onPointerMove={drawing.extend}
                onPointerUp={drawing.end}
                onPointerCancel={drawing.end}
                onPointerLeave={drawing.end}
                aria-label={t('キャンバス', 'Drawing canvas')}
                className="block aspect-[8/5] w-full cursor-crosshair touch-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <Label>{t('ツール', 'Tool')}</Label>
                <SegmentedControl<'brush' | 'eraser'>
                  value={drawing.erasing ? 'eraser' : 'brush'}
                  options={[
                    { value: 'brush', label: t('ペン', 'Brush') },
                    { value: 'eraser', label: t('消しゴム', 'Eraser') },
                  ]}
                  onChange={(value) => drawing.setErasing(value === 'eraser')}
                  label={t('ツール', 'Tool')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawing-size">
                  {t(`太さ (${drawing.size}px)`, `Size (${drawing.size}px)`)}
                </Label>
                <Input
                  id="drawing-size"
                  type="range"
                  min={1}
                  max={72}
                  value={drawing.size}
                  onChange={(event) => drawing.setSize(Number(event.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawing-color">{t('色', 'Colour')}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {brushColors.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => {
                        drawing.setColor(swatch)
                        drawing.setErasing(false)
                      }}
                      aria-label={swatch}
                      aria-pressed={!drawing.erasing && drawing.color === swatch}
                      style={{ backgroundColor: swatch }}
                      className={cn(
                        'size-7 rounded-full border transition-transform',
                        !drawing.erasing && drawing.color === swatch
                          ? 'scale-110 border-primary ring-2 ring-primary/40'
                          : 'border-border/70 hover:scale-105',
                      )}
                    />
                  ))}
                </div>
                <Input
                  id="drawing-color"
                  type="color"
                  value={drawing.color}
                  onChange={(event) => {
                    drawing.setColor(event.target.value)
                    drawing.setErasing(false)
                  }}
                  className="h-9 w-full p-1"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('背景', 'Background')}</Label>
                <SegmentedControl<Background>
                  value={drawing.background}
                  options={[
                    { value: 'white', label: t('白', 'White') },
                    { value: 'dark', label: t('黒', 'Dark') },
                    { value: 'transparent', label: t('透明', 'None') },
                  ]}
                  onChange={drawing.setBackground}
                  label={t('背景', 'Background')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="flex flex-wrap gap-2 p-5">
              <Button
                variant="outline"
                size="sm"
                onClick={drawing.undo}
                disabled={!drawing.canUndo}
              >
                <Undo2 className="size-4" />
                {t('元に戻す', 'Undo')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={drawing.redo}
                disabled={!drawing.canRedo}
              >
                <Redo2 className="size-4" />
                {t('やり直す', 'Redo')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={drawing.clear}
                disabled={!drawing.canUndo}
              >
                <Trash2 className="size-4" />
                {t('全消去', 'Clear')}
              </Button>
              <Button size="sm" onClick={drawing.download}>
                <Download className="size-4" />
                {t('PNGで保存', 'Save PNG')}
              </Button>
            </CardContent>
          </Card>

          <p className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
            {drawing.erasing ? (
              <Eraser className="mt-0.5 size-3.5 shrink-0" />
            ) : (
              <Pencil className="mt-0.5 size-3.5 shrink-0" />
            )}
            {t(
              '描いた内容は端末の外に送信されません。ページを離れると消えます。',
              'Nothing leaves your device, and the drawing is lost when you leave the page.',
            )}
          </p>
        </div>
      </div>
    </WorkspaceShell>
  )
}
