'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BatchFileList } from '@/features/tools/components/batch-file-list'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { formatBytes } from '@/features/tools/domain/bytes'
import { imageFormatLabels, imageFormats } from '@/features/tools/domain/image'
import { maxBatchFiles } from '@/features/tools/hooks/use-image-batch'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import type { CompressTarget } from '../hooks/use-image-compress'
import { useImageCompress } from '../hooks/use-image-compress'

export const ImageCompressWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const images = useImageCompress()

  const targetOptions: { value: CompressTarget; label: string }[] = [
    { value: 'source', label: t('元の形式', 'Keep format') },
    ...imageFormats.map((value) => ({ value, label: imageFormatLabels[value] })),
  ]

  const lossless = images.target === 'image/png'

  return (
    <WorkspaceShell tool={tool} onClear={images.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">{t('圧縮設定', 'Compression')}</CardTitle>
          {images.savedRatio > 0 && (
            <Badge variant="outline" className="font-mono text-[11px]">
              {formatBytes(images.originalBytes)} → {formatBytes(images.compressedBytes)} (−
              {Math.round(images.savedRatio)}%)
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image-compress-files">
                {t(
                  `画像ファイル（最大${maxBatchFiles}件・各15MBまで）`,
                  `Image files (up to ${maxBatchFiles}, 15 MB each)`,
                )}
              </Label>
              <Input
                id="image-compress-files"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => images.select(event.target.files)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('出力形式', 'Output format')}</Label>
              <SegmentedControl<CompressTarget>
                value={images.target}
                options={targetOptions}
                onChange={images.setTarget}
                label={t('出力形式', 'Output format')}
              />
              <p className="text-xs text-muted-foreground">
                {t(
                  'WebPやAVIFにするとより小さくなります。',
                  'WebP and AVIF usually compress the hardest.',
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-compress-quality">
                {t(`品質 (${images.quality}%)`, `Quality (${images.quality}%)`)}
              </Label>
              <Input
                id="image-compress-quality"
                type="range"
                min={10}
                max={100}
                value={images.quality}
                disabled={lossless}
                onChange={(event) => images.setQuality(Number(event.target.value))}
              />
              {lossless && (
                <p className="text-xs text-muted-foreground">
                  {t(
                    'PNGは可逆圧縮のため品質設定は効きません。',
                    'PNG is lossless, so quality has no effect.',
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>{t('最大幅', 'Maximum width')}</Label>
              <div className="flex flex-wrap gap-1.5">
                {images.widthPresets.map((width) => (
                  <Button
                    key={width}
                    size="sm"
                    variant={images.maxWidth === width ? 'default' : 'outline'}
                    onClick={() => images.setMaxWidth(width)}
                  >
                    {width === 0 ? t('変更しない', 'Original') : `${width}px`}
                  </Button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <Button onClick={images.compress} disabled={!images.items.length || images.busy}>
                {images.busy
                  ? t('圧縮中…', 'Compressing…')
                  : t(`${images.items.length}件を圧縮`, `Compress ${images.items.length} file(s)`)}
              </Button>
            </div>
          </div>
          <BatchFileList
            items={images.items}
            rejected={images.rejected}
            emptyMessage={t('画像を選択すると一覧に並びます', 'Selected images are listed here')}
          />
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
