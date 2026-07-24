'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BatchFileList } from '@/components/batch-file-list'
import { SegmentedControl } from '@/components/segmented-control'
import { WorkspaceShell } from '@/components/workspace-shell'
import { formatBytes } from '@/libs/domain/bytes'
import { type ImageFormat, imageFormatLabels, imageFormats } from '@/libs/domain/image'
import { maxBatchFiles } from '@/hooks/use-image-batch'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useImageFormat } from '../hooks/use-image-format'

const formatOptions = imageFormats.map((value) => ({ value, label: imageFormatLabels[value] }))

export const ImageFormatWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const images = useImageFormat()

  return (
    <WorkspaceShell tool={tool} onClear={images.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {t('変換設定', 'Conversion settings')}
          </CardTitle>
          {images.totalSaved > 0 && (
            <Badge variant="outline" className="font-mono text-[11px]">
              −{formatBytes(images.totalSaved)}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image-format-files">
                {t(
                  `画像ファイル（最大${maxBatchFiles}件・各15MBまで）`,
                  `Image files (up to ${maxBatchFiles}, 15 MB each)`,
                )}
              </Label>
              <Input
                id="image-format-files"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => images.select(event.target.files)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('出力形式', 'Output format')}</Label>
              <SegmentedControl<ImageFormat>
                value={images.format}
                options={formatOptions}
                onChange={images.setFormat}
                label={t('出力形式', 'Output format')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-format-quality">
                {t(`品質 (${images.quality}%)`, `Quality (${images.quality}%)`)}
              </Label>
              <Input
                id="image-format-quality"
                type="range"
                min={10}
                max={100}
                value={images.quality}
                disabled={images.format === 'image/png'}
                onChange={(event) => images.setQuality(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={images.convert} disabled={!images.items.length || images.busy}>
                {images.busy
                  ? t('変換中…', 'Converting…')
                  : t(`${images.items.length}件を変換`, `Convert ${images.items.length} file(s)`)}
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
