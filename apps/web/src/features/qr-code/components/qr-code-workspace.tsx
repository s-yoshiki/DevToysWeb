'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useQrCode } from '../hooks/use-qr-code'
import { type CorrectionLevel, correctionLevels } from '../types/qr-code'

const levelOptions = correctionLevels.map((value) => ({ value, label: value }))

export const QrCodeWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const qr = useQrCode()

  return (
    <WorkspaceShell tool={tool} onClear={qr.clear}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-content">{t('内容', 'Content')}</Label>
              <Textarea
                id="qr-content"
                value={qr.input}
                onChange={(event) => qr.setInput(event.target.value)}
                className="min-h-40"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qr-size">{t('サイズ', 'Size')}</Label>
                <Input
                  id="qr-size"
                  type="number"
                  min={128}
                  max={1024}
                  value={qr.size}
                  onChange={(event) => qr.setSize(Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('誤り訂正', 'Error correction')}</Label>
                <SegmentedControl<CorrectionLevel>
                  value={qr.level}
                  options={levelOptions}
                  onChange={qr.setLevel}
                  label={t('誤り訂正', 'Error correction')}
                />
              </div>
            </div>
            {qr.dataUrl && (
              <Button nativeButton={false} render={<a href={qr.dataUrl} download="qr-code.png" />}>
                {t('PNGを保存', 'Save PNG')}
              </Button>
            )}
            {qr.error && <p className="text-sm text-destructive">{qr.error}</p>}
          </div>
          <div className="flex min-h-80 items-center justify-center rounded-xl border bg-white p-6">
            {qr.dataUrl && (
              // biome-ignore lint/performance/noImgElement: the source is a client-side data URI
              <img
                src={qr.dataUrl}
                alt={t('生成されたQRコード', 'Generated QR code')}
                width={qr.size}
                height={qr.size}
                className="max-h-96 max-w-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
