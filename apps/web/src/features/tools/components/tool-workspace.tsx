'use client'

import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  CircleAlert,
  Clipboard,
  FileInput,
  FileOutput,
  Play,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { recordToolVisit } from '../application/use-recent-tools'
import { useToolWorkspace } from '../application/use-tool-workspace'
import { findTool, type ToolDefinition } from '../domain/catalog'
import {
  Base64ImageWorkspace,
  CronWorkspace,
  JsonQueryWorkspace,
  MarkdownWorkspace,
  QrCodeWorkspace,
  SubnetWorkspace,
  TextAnalyzerWorkspace,
} from './advanced-workspaces'
import {
  BasicAuthWorkspace,
  CurlWorkspace,
  HmacWorkspace,
  TextDiffWorkspace,
} from './api-workspaces'
import { ExifWorkspace, ImageConvertWorkspace, SvgWorkspace } from './image-workspaces'
import { JwtVerifyWorkspace, SiteDiagnosticsWorkspace } from './server-workspaces'
import { RegexWorkspace, UrlParserWorkspace } from './specialized-workspaces'
import { GlobWorkspace, SelectorWorkspace } from './tester-workspaces'
import {
  ColorWorkspace,
  ListUtilsWorkspace,
  LoremWorkspace,
  StringEscapeWorkspace,
} from './utility-workspaces'

const formatNames: Record<string, [string, string]> = {
  'yaml-json': ['YAML', 'JSON'],
  'json-csv': ['JSON', 'CSV'],
  'json-toml': ['JSON', 'TOML'],
  'json-xml': ['JSON', 'XML'],
  'date-time': ['ISO 8601', 'Unix time'],
  base64: ['Text', 'Base64'],
  url: ['Text', 'URL encoded'],
  html: ['HTML', 'Escaped HTML'],
  'json-format': ['JSON', 'Formatted JSON'],
  'sql-format': ['SQL', 'Formatted SQL'],
  'xml-format': ['XML', 'Formatted XML'],
  'yaml-format': ['YAML', 'Formatted YAML'],
  'css-format': ['CSS', 'Formatted CSS'],
  'html-format': ['HTML', 'Formatted HTML'],
  hash: ['Text', 'SHA-256'],
}

export const ToolWorkspace = ({ slug }: { slug: string }) => {
  useEffect(() => recordToolVisit(slug), [slug])

  const tool = findTool(slug)
  if (!tool) return null
  if (tool.workspace === 'regex') return <RegexWorkspace tool={tool} />
  if (tool.workspace === 'url-parser') return <UrlParserWorkspace tool={tool} />
  if (tool.workspace === 'text-analyzer') return <TextAnalyzerWorkspace tool={tool} />
  if (tool.workspace === 'markdown') return <MarkdownWorkspace tool={tool} />
  if (tool.workspace === 'cron') return <CronWorkspace tool={tool} />
  if (tool.workspace === 'subnet') return <SubnetWorkspace tool={tool} />
  if (tool.workspace === 'json-query') return <JsonQueryWorkspace tool={tool} />
  if (tool.workspace === 'qr-code') return <QrCodeWorkspace tool={tool} />
  if (tool.workspace === 'base64-image') return <Base64ImageWorkspace tool={tool} />
  if (tool.workspace === 'curl') return <CurlWorkspace tool={tool} />
  if (tool.workspace === 'jwt') return <JwtVerifyWorkspace tool={tool} />
  if (tool.workspace === 'site-diagnostics') return <SiteDiagnosticsWorkspace tool={tool} />
  if (tool.workspace === 'hmac') return <HmacWorkspace tool={tool} />
  if (tool.workspace === 'basic-auth') return <BasicAuthWorkspace tool={tool} />
  if (tool.workspace === 'text-diff') return <TextDiffWorkspace tool={tool} />
  if (tool.workspace === 'color') return <ColorWorkspace tool={tool} />
  if (tool.workspace === 'lorem') return <LoremWorkspace tool={tool} />
  if (tool.workspace === 'string-escape') return <StringEscapeWorkspace tool={tool} />
  if (tool.workspace === 'list-utils') return <ListUtilsWorkspace tool={tool} />
  if (tool.workspace === 'selector') return <SelectorWorkspace tool={tool} />
  if (tool.workspace === 'glob') return <GlobWorkspace tool={tool} />
  if (tool.workspace === 'svg') return <SvgWorkspace tool={tool} />
  if (tool.workspace === 'image-convert') return <ImageConvertWorkspace tool={tool} />
  if (tool.workspace === 'exif') return <ExifWorkspace tool={tool} />
  return <WorkspaceView tool={tool} />
}

const WorkspaceView = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const workspace = useToolWorkspace(tool)
  const [copied, setCopied] = useState(false)
  const Icon = tool.icon
  const copy = async () => {
    await navigator.clipboard.writeText(workspace.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  const isGenerator = tool.mode === 'generate' && tool.slug !== 'hash'
  const supportsReverse =
    !isGenerator &&
    [
      'yaml-json',
      'json-csv',
      'json-toml',
      'json-xml',
      'date-time',
      'base64',
      'url',
      'html',
    ].includes(tool.slug)
  const formats =
    tool.slug === 'number-base'
      ? [`Base ${workspace.options.from}`, `Base ${workspace.options.to}`]
      : (formatNames[tool.slug] ?? [dictionary.input, dictionary.output])
  const inputFormat = workspace.reverse ? formats[1] : formats[0]
  const outputFormat = workspace.reverse ? formats[0] : formats[1]
  const changeDirection = (nextReverse: boolean) => {
    if (nextReverse === workspace.reverse) return
    if (workspace.output) workspace.setInput(workspace.output)
    workspace.setReverse(nextReverse)
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge variant="secondary" className="mb-3 capitalize">
            {dictionary.categories[tool.category]}
          </Badge>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Icon className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {tool.title[locale]}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description[locale]}</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            workspace.setInput('')
            workspace.setOutput('')
          }}
        >
          <RotateCcw className="size-4" />
          {dictionary.clear}
        </Button>
      </header>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold">
                {isGenerator
                  ? locale === 'ja'
                    ? '生成設定'
                    : 'Generator settings'
                  : locale === 'ja'
                    ? '変換ワークスペース'
                    : 'Conversion workspace'}
              </CardTitle>
              {!isGenerator && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {inputFormat} <ArrowRight className="mx-1 inline size-3" /> {outputFormat}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {supportsReverse && (
                <fieldset
                  className="flex rounded-lg border bg-background p-1"
                  aria-label={locale === 'ja' ? '変換方向' : 'Conversion direction'}
                >
                  <Button
                    size="sm"
                    variant={!workspace.reverse ? 'default' : 'ghost'}
                    onClick={() => changeDirection(false)}
                    className="h-7 px-3"
                  >
                    {formats[0]} <ArrowRight className="size-3" /> {formats[1]}
                  </Button>
                  <Button
                    size="sm"
                    variant={workspace.reverse ? 'default' : 'ghost'}
                    onClick={() => changeDirection(true)}
                    className="h-7 px-3"
                  >
                    {formats[1]} <ArrowRight className="size-3" /> {formats[0]}
                  </Button>
                </fieldset>
              )}
              {isGenerator && (
                <Button size="sm" onClick={workspace.run}>
                  <Play className="size-4" />
                  {dictionary.generate}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isGenerator && (
            <div className="grid gap-4 border-b bg-muted/20 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="count">Count</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={50}
                  value={workspace.options.count}
                  onChange={(e) =>
                    workspace.setOptions({ ...workspace.options, count: Number(e.target.value) })
                  }
                />
              </div>
              {tool.slug === 'password' && (
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    min={8}
                    max={128}
                    value={workspace.options.length}
                    onChange={(e) =>
                      workspace.setOptions({ ...workspace.options, length: Number(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>
          )}
          {tool.slug === 'number-base' && (
            <div className="grid gap-4 border-b bg-muted/20 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>From base</Label>
                <Input
                  type="number"
                  min={2}
                  max={36}
                  value={workspace.options.from}
                  onChange={(e) =>
                    workspace.setOptions({ ...workspace.options, from: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>To base</Label>
                <Input
                  type="number"
                  min={2}
                  max={36}
                  value={workspace.options.to}
                  onChange={(e) =>
                    workspace.setOptions({ ...workspace.options, to: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          )}
          {workspace.error && (
            <div
              className="flex items-start gap-2 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive"
              role="alert"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <div>
                <span className="font-semibold">
                  {locale === 'ja' ? '変換できませんでした' : 'Conversion failed'}
                </span>
                <p className="mt-0.5 font-mono text-xs">{workspace.error}</p>
              </div>
            </div>
          )}
          <div className={`grid min-h-[470px] ${isGenerator ? '' : 'lg:grid-cols-2'}`}>
            {!isGenerator && (
              <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
                <div className="flex h-14 items-center justify-between border-b bg-background/60 px-5">
                  <div className="flex items-center gap-2">
                    <FileInput className="size-4 text-primary" />
                    <span className="text-sm font-semibold">{dictionary.input}</span>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {inputFormat}
                  </Badge>
                </div>
                <Textarea
                  value={workspace.input}
                  onChange={(e) => workspace.setInput(e.target.value)}
                  aria-label={`${dictionary.input}: ${inputFormat}`}
                  placeholder={`${inputFormat} ${locale === 'ja' ? 'を入力または貼り付け' : '— type or paste here'}…`}
                  className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 lg:min-h-0"
                />
              </div>
            )}
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-14 items-center justify-between border-b bg-muted/30 px-5">
                <div className="flex items-center gap-2">
                  <FileOutput className="size-4 text-primary" />
                  <span className="text-sm font-semibold">{dictionary.output}</span>
                  <Badge variant="outline" className="font-mono">
                    {isGenerator ? tool.title[locale] : outputFormat}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {supportsReverse && workspace.output && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => changeDirection(!workspace.reverse)}
                      title={
                        locale === 'ja'
                          ? '出力を入力へ移して逆変換'
                          : 'Move output to input and reverse'
                      }
                    >
                      <ArrowLeftRight className="size-4" />
                      {locale === 'ja' ? '入れ替え' : 'Swap'}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={copy} disabled={!workspace.output}>
                    {copied ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Clipboard className="size-4" />
                    )}
                    {copied ? dictionary.copied : dictionary.copy}
                  </Button>
                </div>
              </div>
              <Textarea
                readOnly
                aria-label={`${dictionary.output}: ${isGenerator ? tool.title[locale] : outputFormat}`}
                value={workspace.output}
                placeholder={
                  locale === 'ja' ? '変換結果がここに表示されます' : 'The result will appear here'
                }
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 lg:min-h-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
