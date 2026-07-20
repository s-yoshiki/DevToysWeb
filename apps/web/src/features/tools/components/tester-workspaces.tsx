'use client'

import { Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { cn } from '@/lib/utils'
import type { ToolDefinition } from '../domain/catalog'
import { defaultGlobOptions, type GlobOptions, matchPaths } from '../domain/glob'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const sampleHtml = `<section class="hero" id="top">
  <h1 data-role="title">DevToys</h1>
  <ul class="links">
    <li><a href="/ja/">日本語</a></li>
    <li><a href="/en/">English</a></li>
  </ul>
</section>`

type SelectorMode = 'css' | 'xpath'

/**
 * Parses into an inert document so the sample markup can never run scripts or
 * load subresources in the tool's own page.
 */
const parseInert = (html: string) => new DOMParser().parseFromString(html, 'text/html')

const describeNode = (node: Node) => {
  if (node.nodeType === Node.ELEMENT_NODE) return (node as Element).outerHTML
  if (node.nodeType === Node.ATTRIBUTE_NODE) {
    const attribute = node as Attr
    return `${attribute.name}="${attribute.value}"`
  }
  return node.textContent ?? ''
}

export const SelectorWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [mode, setMode] = useState<SelectorMode>('css')
  const [selector, setSelector] = useState('.links a')
  const [html, setHtml] = useState(sampleHtml)

  const result = useMemo(() => {
    if (!selector.trim() || !html.trim()) return { matches: [] as string[], error: '' }
    try {
      const document = parseInert(html)
      if (mode === 'css')
        return {
          matches: [...document.querySelectorAll(selector)].map(describeNode),
          error: '',
        }

      const evaluated = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      )
      const matches: string[] = []
      for (let index = 0; index < evaluated.snapshotLength; index += 1) {
        const node = evaluated.snapshotItem(index)
        if (node) matches.push(describeNode(node))
      }
      return { matches, error: '' }
    } catch (reason) {
      return {
        matches: [],
        error: reason instanceof Error ? reason.message : 'Invalid selector',
      }
    }
  }, [html, mode, selector])

  const output = result.matches.join('\n\n')

  return (
    <SpecializedShell tool={tool} onClear={() => setSelector('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'セレクタ' : 'Selector'}
            </CardTitle>
            <fieldset
              className="flex rounded-lg border bg-background p-1"
              aria-label={locale === 'ja' ? 'セレクタの種類' : 'Selector type'}
            >
              {(['css', 'xpath'] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={mode === value ? 'default' : 'ghost'}
                  onClick={() => {
                    setMode(value)
                    setSelector(value === 'css' ? '.links a' : '//a[@href]')
                  }}
                  className="h-7 px-3"
                >
                  {value === 'css' ? 'CSS' : 'XPath'}
                </Button>
              ))}
            </fieldset>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="selector-input">
              {mode === 'css' ? 'CSS selector' : 'XPath expression'}
            </Label>
            <Input
              id="selector-input"
              value={selector}
              onChange={(event) => setSelector(event.target.value)}
              className="mt-2 font-mono"
              placeholder={mode === 'css' ? 'ul.links > li a' : '//a[@href]'}
            />
          </div>
          {result.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {result.error}
            </p>
          )}
          <div className="grid min-h-[420px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                HTML
              </div>
              <Textarea
                value={html}
                onChange={(event) => setHtml(event.target.value)}
                aria-label="HTML"
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
                aria-label={locale === 'ja' ? '一致結果' : 'Matches'}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

const samplePaths = `src/index.ts
src/features/tools/catalog.ts
src/features/tools/catalog.test.ts
docs/readme.md
.github/workflows/deploy.yml
node_modules/react/index.js`

export const GlobWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [pattern, setPattern] = useState('src/**/*.ts')
  const [paths, setPaths] = useState(samplePaths)
  const [options, setOptions] = useState<GlobOptions>(defaultGlobOptions)

  const result = useMemo(() => {
    const entries = paths.split('\n').map((line) => line.trim())
    const candidates = entries.filter(Boolean)
    if (!pattern.trim()) return { matches: [], error: '' }
    try {
      return { matches: matchPaths(pattern, candidates, options), error: '' }
    } catch (reason) {
      return { matches: [], error: reason instanceof Error ? reason.message : 'Invalid pattern' }
    }
  }, [options, paths, pattern])

  const matched = result.matches.filter((entry) => entry.matched)

  return (
    <SpecializedShell tool={tool} onClear={() => setPattern('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'globパターン' : 'Glob pattern'}
            </CardTitle>
            <fieldset
              className="flex gap-1 rounded-lg border bg-background p-1"
              aria-label={locale === 'ja' ? '照合オプション' : 'Matching options'}
            >
              <Button
                size="sm"
                variant={options.dot ? 'default' : 'ghost'}
                onClick={() => setOptions({ ...options, dot: !options.dot })}
                className="h-7 px-3"
              >
                {locale === 'ja' ? 'ドットも一致' : 'Match dotfiles'}
              </Button>
              <Button
                size="sm"
                variant={options.caseSensitive ? 'default' : 'ghost'}
                onClick={() => setOptions({ ...options, caseSensitive: !options.caseSensitive })}
                className="h-7 px-3"
              >
                {locale === 'ja' ? '大文字小文字を区別' : 'Case sensitive'}
              </Button>
            </fieldset>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/20 p-5">
            <Label htmlFor="glob-pattern">{locale === 'ja' ? 'パターン' : 'Pattern'}</Label>
            <Input
              id="glob-pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="mt-2 font-mono"
              placeholder="src/**/*.{ts,tsx}"
            />
          </div>
          {result.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {result.error}
            </p>
          )}
          <div className="grid min-h-[420px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {locale === 'ja' ? 'テストするパス' : 'Paths to test'}
              </div>
              <Textarea
                value={paths}
                onChange={(event) => setPaths(event.target.value)}
                aria-label={locale === 'ja' ? 'テストするパス' : 'Paths to test'}
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {locale === 'ja'
                    ? `一致 ${matched.length} / ${result.matches.length}`
                    : `${matched.length} of ${result.matches.length} matched`}
                </span>
                <CopyButton value={matched.map((entry) => entry.path).join('\n')} />
              </div>
              <ul className="flex-1 overflow-y-auto p-3">
                {result.matches.map((entry) => (
                  <li
                    key={entry.path}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm',
                      entry.matched ? 'text-foreground' : 'text-muted-foreground/60',
                    )}
                  >
                    {entry.matched ? (
                      <Check className="size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <X className="size-4 shrink-0 opacity-40" />
                    )}
                    <span className="truncate">{entry.path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
