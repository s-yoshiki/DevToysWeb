'use client'

import { BellRing, CircleAlert, Volume2 } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SegmentedControl, ToggleRow } from '@/components/segmented-control'
import { WorkspaceShell } from '@/components/workspace-shell'
import { formatClock } from '@/libs/domain/duration'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { formatWallClock, type SignalInterval, signalIntervals } from '../functions/time-signal'
import { type SignalStyle, useTimeSignal } from '../hooks/use-time-signal'

export const TimeSignalWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const signal = useTimeSignal()

  const intervalOptions = signalIntervals.map((value) => ({
    value: String(value) as `${SignalInterval}`,
    label: value === 60 ? t('毎正時', 'Hourly') : t(`${value}分`, `${value} min`),
  }))

  return (
    <WorkspaceShell tool={tool} onClear={signal.clear}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border-border/70">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14">
            <span className="font-mono text-6xl font-semibold tabular-nums sm:text-7xl">
              {signal.now ? formatWallClock(signal.now) : '--:--:--'}
            </span>
            <p className="text-sm text-muted-foreground">
              {signal.now
                ? signal.now.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })
                : ' '}
            </p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <Badge variant={signal.enabled ? 'default' : 'secondary'}>
                {signal.enabled ? t('時報オン', 'Signal on') : t('時報オフ', 'Signal off')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {t('次のお知らせまで', 'Next signal in')}{' '}
                <span className="font-mono tabular-nums">{formatClock(signal.countdownMs)}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-5">
              <ToggleRow
                id="time-signal-enabled"
                label={t('時報を有効にする', 'Enable the time signal')}
                checked={signal.enabled}
                onChange={signal.setEnabled}
              />
              <div className="space-y-2">
                <Label>{t('音の種類', 'Sound')}</Label>
                <SegmentedControl<SignalStyle>
                  value={signal.style}
                  options={[
                    { value: 'telephone', label: t('117風（音声）', '117 voice') },
                    { value: 'pips', label: t('時報音（ピッ×3＋ポーン）', 'Pips') },
                    { value: 'count', label: t('時刻の数だけ鳴らす', 'Count the hour') },
                  ]}
                  onChange={signal.setStyle}
                  label={t('音の種類', 'Sound')}
                />
                {signal.style === 'telephone' && (
                  <p className="text-xs text-muted-foreground">
                    {t(
                      '10秒ごとに時刻を読み上げ、3秒前から時報音を鳴らします。',
                      'Announces the time every 10 seconds, with pips starting 3 seconds before.',
                    )}
                  </p>
                )}
              </div>
              {signal.style !== 'telephone' && (
                <div className="space-y-2">
                  <Label>{t('お知らせの間隔', 'Interval')}</Label>
                  <SegmentedControl
                    value={String(signal.interval) as `${SignalInterval}`}
                    options={intervalOptions}
                    onChange={(value) => signal.setInterval(Number(value) as SignalInterval)}
                    label={t('お知らせの間隔', 'Interval')}
                  />
                </div>
              )}
              <Button variant="outline" onClick={signal.test}>
                <Volume2 className="size-4" />
                {signal.style === 'telephone'
                  ? t('音声と時報音を試す', 'Test voice and signal')
                  : t('音を試す', 'Test the sound')}
              </Button>
              {!signal.supported && (
                <p className="flex items-start gap-2 text-xs text-destructive">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
                  {t(
                    signal.style === 'telephone' && !signal.speechSupported
                      ? 'このブラウザは音声読み上げに対応していません。'
                      : 'このブラウザは音の再生に対応していません。',
                    signal.style === 'telephone' && !signal.speechSupported
                      ? 'This browser does not support speech synthesis.'
                      : 'This browser cannot play the signal sound.',
                  )}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t(
                  'このページを開いている間だけ動作します。タブを閉じると停止します。',
                  'The signal only runs while this page stays open in a tab.',
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/70">
            <CardHeader className="border-b bg-muted/30 py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BellRing className="size-3.5" />
                {t('お知らせ履歴', 'Signal history')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {signal.history.length ? (
                <ul className="divide-y">
                  {signal.history.map((entry) => (
                    <li key={entry.id} className="px-5 py-2 font-mono text-sm tabular-nums">
                      {entry.time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  {t('まだお知らせはありません', 'No signals yet')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
