'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent } from '@/components/ui/card'
import { ErrorBanner } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useConverter } from '../hooks/use-converter'
import { GeneratorOptions, NumberBaseOptions } from './converter-options'
import { InputPane, OutputPane } from './converter-panes'
import { ConverterToolbar } from './converter-toolbar'

/**
 * Default workspace: a single text input transformed into a single text output,
 * shared by every catalog entry without a bespoke interface.
 */
export const ConverterWorkspace = ({ tool }: WorkspaceProps) => {
  const { locale } = useLocale()
  const t = useTranslate()
  const converter = useConverter(tool)

  return (
    <WorkspaceShell tool={tool} onClear={converter.clear}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <ConverterToolbar converter={converter} />
        <CardContent className="p-0">
          {converter.isGenerator && (
            <GeneratorOptions converter={converter} withLength={tool.slug === 'password'} />
          )}
          {tool.slug === 'number-base' && <NumberBaseOptions converter={converter} />}
          {converter.error && (
            <ErrorBanner
              title={t('変換できませんでした', 'Conversion failed')}
              message={converter.error}
            />
          )}
          <div className={`grid min-h-[470px] ${converter.isGenerator ? '' : 'lg:grid-cols-2'}`}>
            {!converter.isGenerator && <InputPane converter={converter} />}
            <OutputPane
              converter={converter}
              label={converter.isGenerator ? tool.title[locale] : converter.outputFormat}
            />
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
