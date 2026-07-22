'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BatchFileList } from '@/features/tools/components/batch-file-list'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { type ImageFormat, imageFormatLabels } from '@/features/tools/domain/image'
import { maxBatchFiles } from '@/features/tools/hooks/use-image-batch'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { heicTargetFormats, useHeicConvert } from '../hooks/use-heic-convert'

const formatOptions = heicTargetFormats.map((value) => ({
  value,
  label: imageFormatLabels[value],
}))

export const HeicConvertWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const heic = useHeicConvert()

  return (
    <WorkspaceShell tool={tool} onClear={heic.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {t('変換設定', 'Conversion settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="heic-files">
                {t(
                  `HEIC / HEIFファイル（最大${maxBatchFiles}件・各15MBまで）`,
                  `HEIC / HEIF files (up to ${maxBatchFiles}, 15 MB each)`,
                )}
              </Label>
              <Input
                id="heic-files"
                type="file"
                accept=".heic,.heif,.hif,image/heic,image/heif"
                multiple
                onChange={(event) => heic.select(event.target.files)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('出力形式', 'Output format')}</Label>
              <SegmentedControl<ImageFormat>
                value={heic.format}
                options={formatOptions}
                onChange={heic.setFormat}
                label={t('出力形式', 'Output format')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heic-quality">
                {t(`品質 (${heic.quality}%)`, `Quality (${heic.quality}%)`)}
              </Label>
              <Input
                id="heic-quality"
                type="range"
                min={10}
                max={100}
                value={heic.quality}
                disabled={heic.format === 'image/png'}
                onChange={(event) => heic.setQuality(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={heic.convert} disabled={!heic.items.length || heic.busy}>
                {heic.busy
                  ? t('変換中…', 'Converting…')
                  : t(`${heic.items.length}件を変換`, `Convert ${heic.items.length} file(s)`)}
              </Button>
            </div>
          </div>
          <BatchFileList
            items={heic.items}
            rejected={heic.rejected}
            emptyMessage={t(
              'iPhoneで撮影したHEIC画像を選択してください',
              'Choose the HEIC photos your iPhone produced',
            )}
          />
          <p className="border-t px-5 py-4 text-xs text-muted-foreground">
            {t(
              '変換はすべてブラウザ内で行われ、画像がアップロードされることはありません。最初の1件はデコーダーの読み込みに数秒かかります。',
              'Everything runs in your browser and no image is uploaded. The first file takes a few seconds while the decoder loads.',
            )}
          </p>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
