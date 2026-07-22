'use client'

import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslate } from '@/hooks/use-translate'
import { CopyButton } from '../../components/copy-button'
import { CodeArea, Pane, PaneHeader } from '../../components/workspace-panes'
import { WorkspaceShell } from '../../components/workspace-shell'
import { formatBytes } from '../../domain/bytes'
import type { WorkspaceProps } from '../types'
import { useSvgOptimizer } from './use-svg-optimizer'

const checkerboard =
  'bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px]'

export const SvgWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const svg = useSvgOptimizer()

  return (
    <WorkspaceShell tool={tool} onClear={svg.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {t('SVGを最適化', 'Optimise SVG')}
            </CardTitle>
            {svg.output && (
              <Badge variant="secondary" className="font-mono">
                {formatBytes(svg.input.length)} → {formatBytes(svg.output.length)} (−
                {svg.savedRatio.toFixed(1)}%)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {svg.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {svg.error}
            </p>
          )}
          <div className="grid lg:grid-cols-2">
            <Pane className="min-h-[320px]">
              <PaneHeader title={dictionary.input} />
              <CodeArea
                value={svg.input}
                onChange={(event) => svg.setInput(event.target.value)}
                aria-label={dictionary.input}
                className="min-h-72 text-xs"
              />
            </Pane>
            <div
              className={`flex min-h-[320px] items-center justify-center border-b p-6 lg:border-b-0 ${checkerboard}`}
            >
              {svg.dataUri && (
                // biome-ignore lint/performance/noImgElement: the source is a client-side data URI
                <img
                  src={svg.dataUri}
                  alt={t('SVGプレビュー', 'SVG preview')}
                  className="max-h-72 max-w-full"
                />
              )}
            </div>
          </div>
          <div className="border-t">
            <div className="flex h-11 items-center justify-between border-b bg-muted/30 px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('最適化後のSVG', 'Optimised SVG')}
              </span>
              <CopyButton value={svg.output} />
            </div>
            <CodeArea
              readOnly
              value={svg.output}
              aria-label={t('最適化後のSVG', 'Optimised SVG')}
              className="min-h-32 text-xs"
            />
            <div className="flex h-11 items-center justify-between border-y bg-muted/30 px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                CSS data URI
              </span>
              <CopyButton value={svg.dataUri} />
            </div>
            <CodeArea
              readOnly
              value={svg.dataUri}
              aria-label="CSS data URI"
              className="min-h-24 text-xs"
            />
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
