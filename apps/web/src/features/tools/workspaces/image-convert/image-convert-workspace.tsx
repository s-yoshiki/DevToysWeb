'use client'

import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { SegmentedControl } from '../../components/segmented-control'
import { Pane, PaneGrid, PaneHeader } from '../../components/workspace-panes'
import { WorkspaceShell } from '../../components/workspace-shell'
import { formatBytes } from '../../domain/bytes'
import { type ImageFormat, imageFormatLabels, imageFormats } from '../../domain/image'
import type { WorkspaceProps } from '../types'
import { useImageConvert } from './use-image-convert'

const formatOptions = imageFormats.map((value) => ({ value, label: imageFormatLabels[value] }))

export const ImageConvertWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const image = useImageConvert()

  return (
    <WorkspaceShell tool={tool} onClear={image.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {t('変換設定', 'Conversion settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image-file">
                {t('画像ファイル（最大15MB）', 'Image file (max 15 MB)')}
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(event) => image.loadFile(event.target.files?.[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('出力形式', 'Output format')}</Label>
              <SegmentedControl<ImageFormat>
                value={image.format}
                options={formatOptions}
                onChange={image.setFormat}
                label={t('出力形式', 'Output format')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-quality">
                {t(`品質 (${image.quality}%)`, `Quality (${image.quality}%)`)}
              </Label>
              <Input
                id="image-quality"
                type="range"
                min={10}
                max={100}
                value={image.quality}
                disabled={image.format === 'image/png'}
                onChange={(event) => image.setQuality(Number(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-width">
                {t('最大幅 (px, 0で無効)', 'Max width (px, 0 disables)')}
              </Label>
              <Input
                id="image-width"
                type="number"
                min={0}
                max={10000}
                value={image.maxWidth}
                onChange={(event) => image.setMaxWidth(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={image.convert} disabled={!image.source || image.busy}>
                {image.busy ? t('変換中…', 'Converting…') : t('変換する', 'Convert')}
              </Button>
            </div>
          </div>
          {image.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">
              {image.error}
            </p>
          )}
          <PaneGrid className="min-h-[340px]">
            <Pane>
              <PaneHeader
                title={t('元画像', 'Original')}
                actions={
                  image.source && (
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {formatBytes(image.source.file.size)}
                    </Badge>
                  )
                }
              />
              <div className="flex flex-1 items-center justify-center p-6">
                {image.source ? (
                  // biome-ignore lint/performance/noImgElement: the source is a local object URL
                  <img
                    src={image.source.url}
                    alt={t('元画像', 'Original image')}
                    className="max-h-72 max-w-full"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('画像を選択してください', 'Choose an image to start')}
                  </p>
                )}
              </div>
            </Pane>
            <Pane variant="result">
              <PaneHeader
                title={t('変換後', 'Converted')}
                actions={
                  image.result && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[11px]">
                        {image.result.width}×{image.result.height} ·{' '}
                        {formatBytes(image.result.size)}
                        {image.savedRatio > 0 && ` (−${image.savedRatio.toFixed(0)}%)`}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a
                            href={image.result.url}
                            download={`converted.${imageFormatLabels[image.format].toLowerCase()}`}
                          />
                        }
                      >
                        <Download className="size-4" />
                        {t('保存', 'Save')}
                      </Button>
                    </div>
                  )
                }
              />
              <div className="flex flex-1 items-center justify-center p-6">
                {image.result ? (
                  // biome-ignore lint/performance/noImgElement: the source is a local object URL
                  <img
                    src={image.result.url}
                    alt={t('変換後の画像', 'Converted image')}
                    className="max-h-72 max-w-full"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('結果がここに表示されます', 'The result will appear here')}
                  </p>
                )}
              </div>
            </Pane>
          </PaneGrid>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
