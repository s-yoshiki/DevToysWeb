'use client'

import { Play, ScanLine, Square } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useQrScanner } from '../hooks/use-qr-scanner'

const errorMessages: Record<string, { ja: string; en: string }> = {
  'no-detector': {
    ja: 'このブラウザはBarcodeDetector APIに対応していません。ChromeやEdgeでお試しください。',
    en: 'This browser does not support the BarcodeDetector API. Try Chrome or Edge.',
  },
  'no-camera': {
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
  unknown: { ja: 'スキャナーの起動に失敗しました。', en: 'Failed to start the scanner.' },
}

const isLink = (value: string) => /^https?:\/\//i.test(value)

export const QrScannerWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const scanner = useQrScanner()

  return (
    <WorkspaceShell tool={tool} onClear={scanner.clear}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-black">
              <video
                ref={scanner.videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {scanner.status !== 'scanning' && (
                <span className="absolute px-4 text-center text-sm text-white/70">
                  {scanner.status === 'starting'
                    ? t('起動中…', 'Starting…')
                    : t('カメラでQRコードを読み取ります', 'Point your camera at a code')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {scanner.status === 'scanning' ? (
                <Button variant="outline" onClick={scanner.stop}>
                  <Square className="size-4" />
                  {t('停止', 'Stop')}
                </Button>
              ) : (
                <Button
                  onClick={() => void scanner.start()}
                  disabled={scanner.status === 'starting' || !scanner.detectorSupported}
                >
                  <Play className="size-4" />
                  {t('スキャン開始', 'Start scanning')}
                </Button>
              )}
            </div>
            {scanner.status === 'error' && (
              <p className="text-sm text-destructive">
                {t(
                  errorMessages[scanner.errorCode]?.ja ?? errorMessages.unknown.ja,
                  errorMessages[scanner.errorCode]?.en ?? errorMessages.unknown.en,
                )}
              </p>
            )}
            {!scanner.detectorSupported && scanner.status === 'idle' && (
              <p className="text-sm text-muted-foreground">
                {t(
                  'このブラウザはBarcodeDetector APIに対応していません。',
                  'This browser does not support the BarcodeDetector API.',
                )}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ScanLine className="size-4" />
              {t('読み取り結果', 'Scanned results')}
            </div>
            {scanner.results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('まだ読み取っていません。', 'Nothing scanned yet.')}
              </p>
            ) : (
              <ul className="space-y-2">
                {scanner.results.map((result) => (
                  <li
                    key={`${result.at}-${result.value}`}
                    className="space-y-1 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase text-muted-foreground">
                        {result.format}
                      </span>
                      <CopyButton value={result.value} />
                    </div>
                    {isLink(result.value) ? (
                      <a
                        href={result.value}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-sm text-primary underline"
                      >
                        {result.value}
                      </a>
                    ) : (
                      <p className="break-all font-mono text-sm">{result.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
