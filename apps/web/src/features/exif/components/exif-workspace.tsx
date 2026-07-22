'use client'

import { Download, MapPin, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { formatBytes } from '@/features/tools/domain/bytes'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useExif } from '../hooks/use-exif'
import { ExifTable } from './exif-table'

export const ExifWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const exif = useExif()

  return (
    <WorkspaceShell tool={tool} onClear={exif.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">{t('EXIFを読み取る', 'Read EXIF')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="exif-file">
                {t('JPEG画像（最大15MB）', 'JPEG image (max 15 MB)')}
              </Label>
              <Input
                id="exif-file"
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(event) => exif.loadFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <Button variant="outline" disabled={!exif.file} onClick={exif.strip}>
              <ShieldCheck className="size-4" />
              {t('メタデータを削除', 'Strip metadata')}
            </Button>
          </div>
          {exif.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">
              {exif.error}
            </p>
          )}
          {exif.located && (
            <p className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-700 dark:text-amber-400">
              <MapPin className="size-4 shrink-0" />
              {t(
                'この画像には位置情報が含まれています。共有前に削除を検討してください。',
                'This image carries GPS coordinates. Consider stripping them before sharing.',
              )}
            </p>
          )}
          {exif.cleaned && (
            <div className="flex flex-wrap items-center gap-3 border-b bg-emerald-500/10 px-5 py-3 text-sm">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>
                {t(
                  `メタデータを除去しました（${formatBytes(exif.cleaned.size)}）`,
                  `Metadata removed (${formatBytes(exif.cleaned.size)})`,
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <a href={exif.cleaned.url} download={`clean-${exif.fileName || 'image.jpg'}`} />
                }
              >
                <Download className="size-4" />
                {t('保存', 'Save')}
              </Button>
            </div>
          )}
          <div className="min-h-[340px]">
            <ExifTable entries={exif.entries} />
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
