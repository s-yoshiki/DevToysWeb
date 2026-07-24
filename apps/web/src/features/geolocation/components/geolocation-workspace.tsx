'use client'

import { Crosshair, ExternalLink, MapPin } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { type Coords, useGeolocation } from '../hooks/use-geolocation'

const errorMessages: Record<string, { ja: string; en: string }> = {
  'no-api': {
    ja: 'このブラウザは位置情報APIに対応していません。',
    en: 'This browser does not support the Geolocation API.',
  },
  'permission-denied': {
    ja: '位置情報の利用が拒否されました。ブラウザの権限設定を確認してください。',
    en: 'Location access was denied. Check your browser permissions.',
  },
  unavailable: {
    ja: '位置情報を取得できませんでした。',
    en: 'Your location is currently unavailable.',
  },
  timeout: {
    ja: '位置情報の取得がタイムアウトしました。',
    en: 'The request to get your location timed out.',
  },
  unknown: { ja: '不明なエラーが発生しました。', en: 'An unknown error occurred.' },
}

const formatValue = (value: number | null, digits: number, unit: string) =>
  value === null ? '—' : `${value.toFixed(digits)}${unit}`

export const GeolocationWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const geo = useGeolocation()

  const rows = (coords: Coords) => [
    { label: t('緯度', 'Latitude'), value: coords.latitude.toFixed(6) },
    { label: t('経度', 'Longitude'), value: coords.longitude.toFixed(6) },
    { label: t('精度', 'Accuracy'), value: formatValue(coords.accuracy, 0, ' m') },
    { label: t('高度', 'Altitude'), value: formatValue(coords.altitude, 0, ' m') },
    {
      label: t('高度精度', 'Altitude accuracy'),
      value: formatValue(coords.altitudeAccuracy, 0, ' m'),
    },
    { label: t('方位', 'Heading'), value: formatValue(coords.heading, 0, '°') },
    { label: t('速度', 'Speed'), value: formatValue(coords.speed, 1, ' m/s') },
    {
      label: t('取得時刻', 'Timestamp'),
      value: new Date(coords.timestamp).toLocaleString(),
    },
  ]

  const mapUrl = geo.coords
    ? `https://www.openstreetmap.org/?mlat=${geo.coords.latitude}&mlon=${geo.coords.longitude}#map=16/${geo.coords.latitude}/${geo.coords.longitude}`
    : ''

  return (
    <WorkspaceShell tool={tool} onClear={geo.clear}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-wrap gap-3">
            <Button onClick={geo.locate} disabled={geo.status === 'loading'}>
              <Crosshair className="size-4" />
              {t('現在地を取得', 'Get my location')}
            </Button>
            <Button variant="outline" onClick={geo.toggleWatch}>
              <MapPin className="size-4" />
              {geo.watching
                ? t('追跡を停止', 'Stop watching')
                : t('継続的に追跡', 'Watch position')}
            </Button>
          </div>

          {geo.status === 'error' && (
            <p className="text-sm text-destructive">
              {t(
                errorMessages[geo.errorCode]?.ja ?? errorMessages.unknown.ja,
                errorMessages[geo.errorCode]?.en ?? errorMessages.unknown.en,
              )}
            </p>
          )}

          {geo.status === 'loading' && !geo.coords && (
            <p className="text-sm text-muted-foreground">{t('取得中…', 'Locating…')}</p>
          )}

          {geo.coords && (
            <div className="space-y-4">
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {rows(geo.coords).map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 border-b border-border pb-2"
                  >
                    <dt className="text-sm text-muted-foreground">{row.label}</dt>
                    <dd className="font-mono text-sm">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={`${geo.coords.latitude}, ${geo.coords.longitude}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href={mapUrl} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink className="size-4" />
                  {t('地図で開く', 'Open in map')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
