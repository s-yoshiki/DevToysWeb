'use client'

import { ArrowLeftRight, FileInput, FileOutput } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeEditor } from '@/features/tools/components/code-editor'
import { languageForFormat } from '@/features/tools/components/code-editor-language'
import { CopyButton } from '@/features/tools/components/copy-button'
import { Pane } from '@/features/tools/components/workspace-panes'
import { useTranslate } from '@/hooks/use-translate'
import type { Converter } from '../hooks/use-converter'

const PaneTitle = ({ icon: Icon, label }: { icon: typeof FileInput; label: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="size-4 text-primary" />
    <span className="text-sm font-semibold">{label}</span>
  </div>
)

export const InputPane = ({ converter }: { converter: Converter }) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  return (
    <Pane>
      <div className="flex h-14 items-center justify-between border-b bg-background/60 px-5">
        <PaneTitle icon={FileInput} label={dictionary.input} />
        <Badge variant="outline" className="font-mono">
          {converter.inputFormat}
        </Badge>
      </div>
      <CodeEditor
        value={converter.input}
        onChange={(value) => converter.setInput(value)}
        language={languageForFormat(converter.inputFormat)}
        ariaLabel={`${dictionary.input}: ${converter.inputFormat}`}
        placeholder={`${converter.inputFormat} ${t('を入力または貼り付け', '— type or paste here')}…`}
      />
    </Pane>
  )
}

export const OutputPane = ({ converter, label }: { converter: Converter; label: string }) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  return (
    <Pane variant="result">
      <div className="flex h-14 items-center justify-between border-b bg-muted/30 px-5">
        <div className="flex items-center gap-2">
          <PaneTitle icon={FileOutput} label={dictionary.output} />
          <Badge variant="outline" className="font-mono">
            {label}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {converter.supportsReverse && converter.output && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => converter.changeDirection(!converter.reverse)}
              title={t('出力を入力へ移して逆変換', 'Move output to input and reverse')}
            >
              <ArrowLeftRight className="size-4" />
              {t('入れ替え', 'Swap')}
            </Button>
          )}
          <CopyButton value={converter.output} />
        </div>
      </div>
      <CodeEditor
        readOnly
        value={converter.output}
        language={languageForFormat(label)}
        ariaLabel={`${dictionary.output}: ${label}`}
        placeholder={t('変換結果がここに表示されます', 'The result will appear here')}
      />
    </Pane>
  )
}
