'use client'

import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleRow } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { formatClock } from '@/features/tools/domain/duration'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { useTimer } from '../hooks/use-timer'

const presets = [60, 180, 300, 600, 900, 1800]

const radius = 132
const circumference = 2 * Math.PI * radius

const ProgressRing = ({ progress, active }: { progress: number; active: boolean }) => (
  <svg viewBox="0 0 300 300" className="size-full -rotate-90" aria-hidden="true">
    <circle
      cx="150"
      cy="150"
      r={radius}
      fill="none"
      strokeWidth="10"
      className="stroke-muted-foreground/15"
    />
    <circle
      cx="150"
      cy="150"
      r={radius}
      fill="none"
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={circumference * (1 - progress)}
      className={cn(
        'transition-[stroke-dashoffset] duration-200 ease-linear',
        active ? 'stroke-primary' : 'stroke-muted-foreground/40',
      )}
    />
  </svg>
)

const DurationField = ({
  id,
  label,
  value,
  max,
  disabled,
  onChange,
}: {
  id: string
  label: string
  value: number
  max: number
  disabled: boolean
  onChange: (value: number) => void
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="number"
      min={0}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(event) =>
        onChange(Math.min(max, Math.max(0, Math.floor(Number(event.target.value) || 0))))
      }
      className="text-center font-mono tabular-nums"
    />
  </div>
)

export const TimerWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const timer = useTimer()
  const editing = timer.status === 'idle'
  const finished = timer.status === 'finished'

  return (
    <WorkspaceShell tool={tool} onClear={timer.clear}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="border-border/70">
          <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-8">
            <div className="relative aspect-square w-full max-w-xs">
              <ProgressRing progress={timer.progress} active={timer.status === 'running'} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span
                  className={cn(
                    'font-mono text-5xl font-semibold tabular-nums sm:text-6xl',
                    finished && 'text-primary',
                  )}
                  aria-live="polite"
                >
                  {formatClock(timer.remaining)}
                </span>
                {finished && (
                  <Badge className="animate-pulse">{t('時間になりました', "Time's up")}</Badge>
                )}
                {timer.status === 'paused' && (
                  <Badge variant="secondary">{t('一時停止中', 'Paused')}</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {timer.status === 'running' ? (
                <Button size="lg" onClick={timer.pause}>
                  <Pause className="size-4" />
                  {t('一時停止', 'Pause')}
                </Button>
              ) : (
                <Button size="lg" onClick={timer.start} disabled={timer.duration <= 0}>
                  <Play className="size-4" />
                  {timer.status === 'paused' ? t('再開', 'Resume') : t('スタート', 'Start')}
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={timer.reset}>
                <RotateCcw className="size-4" />
                {t('リセット', 'Reset')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-5">
              <div className="grid grid-cols-3 gap-3">
                <DurationField
                  id="timer-hours"
                  label={t('時', 'Hours')}
                  value={timer.hours}
                  max={99}
                  disabled={!editing}
                  onChange={timer.setHours}
                />
                <DurationField
                  id="timer-minutes"
                  label={t('分', 'Minutes')}
                  value={timer.minutes}
                  max={59}
                  disabled={!editing}
                  onChange={timer.setMinutes}
                />
                <DurationField
                  id="timer-seconds"
                  label={t('秒', 'Seconds')}
                  value={timer.seconds}
                  max={59}
                  disabled={!editing}
                  onChange={timer.setSeconds}
                />
              </div>
              {!editing && (
                <p className="text-xs text-muted-foreground">
                  {t(
                    'リセットすると時間を編集できます。',
                    'Reset the timer to edit the duration again.',
                  )}
                </p>
              )}
              <ToggleRow
                id="timer-sound"
                label={t('終了時に音を鳴らす', 'Chime when finished')}
                checked={timer.soundEnabled}
                onChange={timer.setSoundEnabled}
              />
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {timer.soundEnabled ? (
                  <Volume2 className="size-3.5" />
                ) : (
                  <VolumeX className="size-3.5" />
                )}
                {t(
                  'ブラウザの仕様上、最初の操作のあとに音が有効になります。',
                  'Browsers only allow sound after your first interaction with the page.',
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <Label>{t('プリセット', 'Presets')}</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant="outline"
                    onClick={() => timer.applyPreset(value)}
                  >
                    {value < 60
                      ? t(`${value}秒`, `${value}s`)
                      : t(`${value / 60}分`, `${value / 60} min`)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
