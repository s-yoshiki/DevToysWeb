'use client'

import { Loader2, Play, Square } from 'lucide-react'
import { CodeEditor } from '@/components/code-editor'
import { CopyButton } from '@/components/copy-button'
import { SegmentedControl } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { type RunnerLanguage, useJsRunner } from '../hooks/use-js-runner'

const languageOptions: { value: RunnerLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
]

export const JsRunnerWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const runner = useJsRunner()

  return (
    <WorkspaceShell tool={tool} onClear={runner.clear}>
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <SegmentedControl<RunnerLanguage>
              value={runner.language}
              options={languageOptions}
              onChange={runner.setLanguage}
              label={t('言語', 'Language')}
            />
            {runner.running ? (
              <Button variant="outline" onClick={runner.stop}>
                <Square className="size-4" />
                {t('停止', 'Stop')}
              </Button>
            ) : (
              <Button onClick={() => void runner.run()}>
                <Play className="size-4" />
                {t('実行', 'Run')}
              </Button>
            )}
            {runner.running && (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {t('実行中…', 'Running…')}
              </span>
            )}
            {runner.result && !runner.running && (
              <span className="text-sm text-muted-foreground">
                {runner.result.ok
                  ? t(`完了 (${runner.result.ms}ms)`, `Done in ${runner.result.ms}ms`)
                  : t('エラー', 'Error')}
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {t(
                `標準入力は fs.readFileSync('/dev/stdin') か input() で読めます・${runner.timeoutSeconds}秒でタイムアウト`,
                `Read stdin via fs.readFileSync('/dev/stdin') or input() · ${runner.timeoutSeconds}s timeout`,
              )}
            </span>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex h-11 items-center border-b border-border px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('コード', 'Code')}
              </span>
            </div>
            <div className="flex h-[420px] flex-col">
              <CodeEditor
                value={runner.code}
                onChange={runner.setCode}
                language={runner.language === 'typescript' ? 'typescript' : 'javascript'}
                ariaLabel={t('コード', 'Code')}
              />
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="space-y-2 p-4">
                <Label htmlFor="runner-stdin">
                  {t('標準入力 (stdin)', 'Standard input (stdin)')}
                </Label>
                <Textarea
                  id="runner-stdin"
                  value={runner.stdin}
                  onChange={(event) => runner.setStdin(event.target.value)}
                  className="min-h-24 font-mono text-sm"
                  spellCheck={false}
                />
              </CardContent>
            </Card>

            <Card className="flex-1 overflow-hidden">
              <div className="flex h-11 items-center justify-between border-b border-border px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('標準出力 (stdout)', 'Standard output (stdout)')}
                </span>
                <CopyButton value={runner.result?.stdout ?? ''} />
              </div>
              <pre className="min-h-24 overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-sm">
                {runner.result?.stdout || (
                  <span className="text-muted-foreground">
                    {t('ここに出力が表示されます', 'Output appears here')}
                  </span>
                )}
              </pre>
              {runner.result?.stderr && (
                <div className="border-t border-destructive/30 bg-destructive/10">
                  <div className="px-5 pt-3 text-xs font-semibold uppercase tracking-widest text-destructive">
                    {t('標準エラー (stderr)', 'Standard error (stderr)')}
                  </div>
                  <pre className="overflow-auto whitespace-pre-wrap break-words p-5 pt-2 font-mono text-sm text-destructive">
                    {runner.result.stderr}
                  </pre>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  )
}
