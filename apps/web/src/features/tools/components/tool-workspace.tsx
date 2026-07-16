'use client'

import { ArrowLeftRight, Check, Clipboard, Play, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { useToolWorkspace } from '../application/use-tool-workspace'
import { findTool, type ToolDefinition } from '../domain/catalog'

export const ToolWorkspace = ({ slug }: { slug: string }) => {
  const tool = findTool(slug)
  return tool ? <WorkspaceView tool={tool} /> : null
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
            <CardTitle className="text-sm font-medium">Workspace</CardTitle>
            <div className="flex items-center gap-3">
              {!isGenerator &&
                !['json-format', 'sql-format', 'xml-format', 'hash', 'number-base'].includes(
                  tool.slug,
                ) && (
                  <>
                    <Label htmlFor="reverse" className="text-xs text-muted-foreground">
                      Reverse
                    </Label>
                    <Switch
                      id="reverse"
                      checked={workspace.reverse}
                      onCheckedChange={workspace.setReverse}
                    />
                    <ArrowLeftRight className="size-4 text-muted-foreground" />
                  </>
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
          <div className="grid min-h-[470px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.input}
              </div>
              <Textarea
                value={workspace.input}
                onChange={(e) => workspace.setInput(e.target.value)}
                placeholder="Type or paste here…"
                className="min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 lg:min-h-0"
              />
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {dictionary.output}
                </span>
                <Button variant="ghost" size="sm" onClick={copy} disabled={!workspace.output}>
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Clipboard className="size-4" />
                  )}
                  {copied ? dictionary.copied : dictionary.copy}
                </Button>
              </div>
              <Textarea
                readOnly
                value={workspace.error || workspace.output}
                className={`min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 lg:min-h-0 ${workspace.error ? 'text-destructive' : ''}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
