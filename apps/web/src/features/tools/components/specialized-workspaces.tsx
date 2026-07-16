'use client'

import { Check, Clipboard, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import type { ToolDefinition } from '../domain/catalog'

export const SpecializedShell = ({
  tool,
  onClear,
  children,
}: {
  tool: ToolDefinition
  onClear: () => void
  children: React.ReactNode
}) => {
  const { locale, dictionary } = useLocale()
  const Icon = tool.icon
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
        <Button variant="outline" onClick={onClear}>
          <RotateCcw className="size-4" />
          {dictionary.clear}
        </Button>
      </header>
      {children}
    </div>
  )
}

export const CopyButton = ({ value }: { value: string }) => {
  const { dictionary } = useLocale()
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={!value}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Clipboard className="size-4" />}
      {copied ? dictionary.copied : dictionary.copy}
    </Button>
  )
}

export const RegexWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [pattern, setPattern] = useState('(?<word>\\w+)')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('Hello DevToys')
  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: '' }
    try {
      const effectiveFlags = flags.includes('g') ? flags : `${flags}g`
      const expression = new RegExp(pattern, effectiveFlags)
      const matches = [...input.matchAll(expression)].map((match) => ({
        match: match[0],
        index: match.index,
        groups: match.groups ?? match.slice(1),
      }))
      return { matches, error: '' }
    } catch (reason) {
      return { matches: [], error: reason instanceof Error ? reason.message : 'Invalid expression' }
    }
  }, [flags, input, pattern])
  const output = result.error || JSON.stringify(result.matches, null, 2)

  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setPattern('')
        setFlags('g')
        setInput('')
      }}
    >
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {locale === 'ja' ? '正規表現の設定' : 'Expression settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 border-b bg-muted/20 p-5 sm:grid-cols-[1fr_10rem]">
            <div className="space-y-2">
              <Label htmlFor="regex-pattern">{locale === 'ja' ? 'パターン' : 'Pattern'}</Label>
              <Input
                id="regex-pattern"
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
                className="font-mono"
                placeholder="(?<name>\\w+)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regex-flags">{locale === 'ja' ? 'フラグ' : 'Flags'}</Label>
              <Input
                id="regex-flags"
                value={flags}
                onChange={(event) => setFlags(event.target.value)}
                className="font-mono"
                placeholder="gimu"
              />
            </div>
          </div>
          <div className="grid min-h-[430px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {locale === 'ja' ? 'テスト文字列' : 'Test text'}
              </div>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {locale === 'ja'
                    ? `一致結果 (${result.matches.length})`
                    : `Matches (${result.matches.length})`}
                </span>
                <CopyButton value={output} />
              </div>
              <Textarea
                readOnly
                value={output}
                className={`min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 ${result.error ? 'text-destructive' : ''}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

export const UrlParserWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState('https://example.com:8080/path/to/page?q=devtoys&q=web#result')
  const result = useMemo(() => {
    if (!input) return { output: '', error: '' }
    try {
      const url = new URL(input)
      const query = [...url.searchParams.entries()].map(([name, value]) => ({ name, value }))
      return {
        output: JSON.stringify(
          {
            href: url.href,
            protocol: url.protocol,
            username: url.username,
            password: url.password,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            query,
            hash: url.hash,
            origin: url.origin,
          },
          null,
          2,
        ),
        error: '',
      }
    } catch (reason) {
      return { output: '', error: reason instanceof Error ? reason.message : 'Invalid URL' }
    }
  }, [input])
  const output = result.error || result.output

  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {locale === 'ja' ? 'URLを解析' : 'Parse URL'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="url-input">URL</Label>
            <Input
              id="url-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-2 font-mono"
              placeholder="https://example.com/path?key=value#hash"
            />
          </div>
          <div className="flex min-h-[430px] flex-col bg-muted/15">
            <div className="flex h-11 items-center justify-between border-b px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {locale === 'ja' ? '解析結果' : 'Parsed components'}
              </span>
              <CopyButton value={output} />
            </div>
            <Textarea
              readOnly
              value={output}
              className={`min-h-80 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 ${result.error ? 'text-destructive' : ''}`}
            />
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
