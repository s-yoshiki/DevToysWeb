'use client'

import { ExternalLink } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/copy-button'
import { SegmentedControl } from '@/components/segmented-control'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { BadgeStyle } from '@/workspaces/badge/badge'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useBadge } from './use-badge'

const styles: BadgeStyle[] = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social']

const Field = ({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
)

const Output = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b last:border-b-0">
    <div className="flex h-11 items-center justify-between px-5">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <CopyButton value={value} />
    </div>
    <Textarea
      readOnly
      value={value}
      aria-label={label}
      className="min-h-20 resize-none rounded-none border-x-0 border-b-0 bg-muted/15 px-5 font-mono text-xs shadow-none focus-visible:ring-0"
    />
  </div>
)

export const BadgeWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const badge = useBadge()
  const { options } = badge

  const categories = [
    ['language', t('プログラミング言語', 'Programming languages')],
    ['framework', t('フレームワーク', 'Frameworks')],
    ['database', t('データベース', 'Databases')],
    ['cloud', t('クラウド', 'Cloud')],
    ['tool', t('開発ツール', 'Developer tools')],
  ] as const

  return (
    <WorkspaceShell tool={tool} onClear={badge.clear}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <Card className="min-w-0 overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">
              {t('バッジ設定', 'Badge settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-5">
            <div className="space-y-2">
              <Label>{t('サービス', 'Service')}</Label>
              <SegmentedControl
                value={options.provider}
                onChange={badge.setProvider}
                label={t('バッジサービス', 'Badge service')}
                options={[
                  { value: 'shields', label: 'Shields.io' },
                  { value: 'badgen', label: 'Badgen.net' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('md-badges 技術プリセット', 'md-badges tech preset')}</Label>
              <Select
                onValueChange={(value) => {
                  const preset = badge.presets.find((item) => item.name === value)
                  if (preset) badge.applyPreset(preset)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('技術を選択…', 'Choose a technology…')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(([category, label]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{label}</SelectLabel>
                      {badge.presets
                        .filter((preset) => preset.category === category)
                        .map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t(
                  'プリセット適用後も、すべての値を自由に編集できます。',
                  'Every value remains editable after applying a preset.',
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="badge-label"
                label={t('ラベル（左）', 'Label (left)')}
                value={options.label}
                onChange={(value) => badge.set('label', value)}
              />
              <Field
                id="badge-message"
                label={t('メッセージ（右）', 'Message (right)')}
                value={options.message}
                onChange={(value) => badge.set('message', value)}
              />
              <Field
                id="badge-color"
                label={t('メッセージ色', 'Message color')}
                value={options.color}
                placeholder="22c55e / brightgreen"
                onChange={(value) => badge.set('color', value)}
              />
              <Field
                id="badge-label-color"
                label={t('ラベル色', 'Label color')}
                value={options.labelColor}
                placeholder="555555"
                onChange={(value) => badge.set('labelColor', value)}
              />
              <Field
                id="badge-logo"
                label={t('ロゴ名', 'Logo slug')}
                value={options.logo}
                placeholder="github"
                onChange={(value) => badge.set('logo', value)}
              />
              <Field
                id="badge-logo-color"
                label={t('ロゴ色', 'Logo color')}
                value={options.logoColor}
                placeholder="white"
                onChange={(value) => badge.set('logoColor', value)}
              />
            </div>

            {options.provider === 'shields' && (
              <div className="space-y-2">
                <Label>{t('スタイル', 'Style')}</Label>
                <SegmentedControl
                  value={options.style}
                  onChange={badge.setStyle}
                  label={t('バッジスタイル', 'Badge style')}
                  options={styles.map((style) => ({ value: style, label: style }))}
                />
              </div>
            )}

            <Field
              id="badge-link"
              label={t('リンク先（任意）', 'Destination URL (optional)')}
              value={options.link}
              placeholder="https://example.com"
              onChange={(value) => badge.set('link', value)}
            />
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card className="min-w-0 overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="border-b bg-muted/30 py-4">
              <CardTitle className="text-sm font-medium">{t('プレビュー', 'Preview')}</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-36 items-center justify-center p-8">
              {/* The generated URL is user-controlled and intentionally loaded as an image only. */}
              {/* biome-ignore lint/performance/noImgElement: dynamic third-party SVG dimensions are unknown. */}
              <img src={badge.output.url} alt={options.label || options.message || 'badge'} />
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm font-medium">{dictionary.output}</CardTitle>
                <a
                  href={badge.output.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('画像を開く', 'Open image')}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Output label="Markdown" value={badge.output.markdown} />
              <Output label="HTML" value={badge.output.html} />
              <Output label="URL" value={badge.output.url} />
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
