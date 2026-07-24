'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/copy-button'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useTextAnalyzer } from '../hooks/use-text-analyzer'

const StatTile = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border bg-muted/20 p-4">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
  </div>
)

export const TextAnalyzerWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const analyzer = useTextAnalyzer()
  const tiles = [
    { label: t('文字数', 'Characters'), value: analyzer.stats.characters },
    { label: t('単語数', 'Words'), value: analyzer.stats.words },
    { label: t('行数', 'Lines'), value: analyzer.stats.lines },
    { label: t('UTF-8バイト', 'UTF-8 bytes'), value: analyzer.stats.bytes },
  ]

  return (
    <WorkspaceShell tool={tool} onClear={analyzer.clear}>
      <Card className="border-border/70">
        <CardContent className="space-y-5 p-5">
          <Textarea
            value={analyzer.input}
            onChange={(event) => analyzer.setInput(event.target.value)}
            aria-label={t('テキスト', 'Text')}
            className="min-h-40 font-mono"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((tile) => (
              <StatTile key={tile.label} label={tile.label} value={tile.value} />
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(analyzer.conversions).map(([label, value]) => (
              <div key={label} className="rounded-xl border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Label>{label}</Label>
                  <CopyButton value={value} />
                </div>
                <div className="break-all font-mono text-sm">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
