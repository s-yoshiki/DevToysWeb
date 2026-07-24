'use client'

import { Camera, Play, Square, SwitchCamera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useCamera } from '../hooks/use-camera'

const errorMessages: Record<string, { ja: string; en: string }> = {
  'no-api': {
    ja: 'このブラウザはカメラAPIに対応していません。',
    en: 'This browser does not support the camera API.',
  },
  NotAllowedError: {
    ja: 'カメラの利用が拒否されました。ブラウザの権限設定を確認してください。',
    en: 'Camera access was denied. Check your browser permissions.',
  },
  NotFoundError: {
    ja: '利用可能なカメラが見つかりませんでした。',
    en: 'No camera device was found.',
  },
  NotReadableError: {
    ja: 'カメラを開始できませんでした。他のアプリが使用中の可能性があります。',
    en: 'Could not start the camera. It may be in use by another app.',
  },
  unknown: { ja: 'カメラの起動に失敗しました。', en: 'Failed to start the camera.' },
}

export const CameraWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const cam = useCamera()

  return (
    <WorkspaceShell tool={tool} onClear={cam.clear}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-black">
              <video
                ref={cam.videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: cam.facing === 'user' ? 'scaleX(-1)' : undefined }}
              />
              {cam.status !== 'live' && (
                <span className="absolute text-sm text-white/70">
                  {cam.status === 'starting'
                    ? t('起動中…', 'Starting…')
                    : t('カメラは停止中です', 'Camera is off')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {cam.status === 'live' ? (
                <Button variant="outline" onClick={cam.stop}>
                  <Square className="size-4" />
                  {t('停止', 'Stop')}
                </Button>
              ) : (
                <Button
                  onClick={() => void cam.start(cam.facing)}
                  disabled={cam.status === 'starting'}
                >
                  <Play className="size-4" />
                  {t('カメラ開始', 'Start camera')}
                </Button>
              )}
              <Button variant="outline" onClick={cam.flip} disabled={cam.status !== 'live'}>
                <SwitchCamera className="size-4" />
                {t('切り替え', 'Flip')}
              </Button>
              <Button onClick={cam.capture} disabled={cam.status !== 'live'}>
                <Camera className="size-4" />
                {t('撮影', 'Capture')}
              </Button>
            </div>
            {cam.status === 'error' && (
              <p className="text-sm text-destructive">
                {t(
                  errorMessages[cam.errorCode]?.ja ?? errorMessages.unknown.ja,
                  errorMessages[cam.errorCode]?.en ?? errorMessages.unknown.en,
                )}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
              {cam.photo ? (
                // biome-ignore lint/performance/noImgElement: the source is a client-side data URI
                <img
                  src={cam.photo}
                  alt={t('撮影した写真', 'Captured photo')}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t('ここに撮影した写真が表示されます', 'Your captured photo appears here')}
                </span>
              )}
            </div>
            {cam.photo && (
              <Button nativeButton={false} render={<a href={cam.photo} download="capture.png" />}>
                {t('PNGを保存', 'Save PNG')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
