'use client'

import Ajv from 'ajv'
import { CronExpressionParser } from 'cron-parser'
import DOMPurify from 'dompurify'
import { JSONPath } from 'jsonpath-plus'
import { marked } from 'marked'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import type { ToolDefinition } from '../domain/catalog'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const ResultCard = ({
  title,
  value,
  error = false,
}: {
  title: string
  value: string
  error?: boolean
}) => (
  <Card className="overflow-hidden border-border/70">
    <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-3">
      <CardTitle className="text-sm">{title}</CardTitle>
      <CopyButton value={value} />
    </CardHeader>
    <CardContent className="p-0">
      <Textarea
        readOnly
        value={value}
        className={`min-h-60 resize-none rounded-none border-0 p-5 font-mono shadow-none focus-visible:ring-0 ${error ? 'text-destructive' : ''}`}
      />
    </CardContent>
  </Card>
)

const words = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

export const TextAnalyzerWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const sample = 'hello DevToys web toolkit'
  const [input, setInput] = useState(sample)
  const parts = words(input)
  const conversions = useMemo(() => {
    const lower = parts.map((part) => part.toLocaleLowerCase())
    const cap = (part: string) => part.charAt(0).toLocaleUpperCase() + part.slice(1)
    return {
      camelCase: lower.map((part, index) => (index ? cap(part) : part)).join(''),
      PascalCase: lower.map(cap).join(''),
      snake_case: lower.join('_'),
      'kebab-case': lower.join('-'),
      UPPER_CASE: input.toLocaleUpperCase(),
      'lower case': input.toLocaleLowerCase(),
    }
  }, [input, parts])
  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="border-border/70">
        <CardContent className="space-y-5 p-5">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-40 font-mono"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [locale === 'ja' ? '文字数' : 'Characters', [...input].length],
              [locale === 'ja' ? '単語数' : 'Words', parts.length],
              [locale === 'ja' ? '行数' : 'Lines', input ? input.split(/\r?\n/).length : 0],
              [
                locale === 'ja' ? 'UTF-8バイト' : 'UTF-8 bytes',
                new TextEncoder().encode(input).length,
              ],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-1 text-2xl font-semibold">{value}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(conversions).map(([label, value]) => (
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
    </SpecializedShell>
  )
}

export const MarkdownWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState(
    '# DevToys\n\n**Developer tools** in your browser.\n\n- Fast\n- Private\n- Useful',
  )
  const [html, setHtml] = useState('')
  useEffect(() => {
    setHtml(DOMPurify.sanitize(marked.parse(input, { async: false }) as string))
  }, [input])
  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="overflow-hidden border-border/70">
        <CardContent className="grid min-h-[520px] p-0 lg:grid-cols-2">
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
            <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase text-muted-foreground">
              Markdown
            </div>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-64 flex-1 resize-none rounded-none border-0 p-5 font-mono shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex h-11 items-center justify-between border-b px-5 text-xs font-semibold uppercase text-muted-foreground">
              <span>{locale === 'ja' ? 'プレビュー' : 'Preview'}</span>
              <CopyButton value={html} />
            </div>
            <article
              className="prose prose-neutral max-w-none flex-1 overflow-auto p-6 dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

export const CronWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [expression, setExpression] = useState('*/15 9-17 * * 1-5')
  const [timezone, setTimezone] = useState('Asia/Tokyo')
  const result = useMemo(() => {
    try {
      const cron = CronExpressionParser.parse(expression, { tz: timezone })
      return {
        value: Array.from({ length: 8 }, () => cron.next().toISOString()).join('\n'),
        error: false,
      }
    } catch (reason) {
      return {
        value: reason instanceof Error ? reason.message : 'Invalid cron expression',
        error: true,
      }
    }
  }, [expression, timezone])
  return (
    <SpecializedShell tool={tool} onClear={() => setExpression('')}>
      <div className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_16rem]">
            <div className="space-y-2">
              <Label>Cron</Label>
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>{locale === 'ja' ? 'タイムゾーン' : 'Timezone'}</Label>
              <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <ResultCard
          title={locale === 'ja' ? '次回の実行日時（ISO 8601）' : 'Next runs (ISO 8601)'}
          value={result.value}
          error={result.error}
        />
      </div>
    </SpecializedShell>
  )
}

const ipToNumber = (ip: string) => {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255))
    throw new Error('Invalid IPv4 address')
  return parts.reduce((value, part) => (value * 256 + part) >>> 0, 0)
}
const numberToIp = (value: number) =>
  [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.')

export const SubnetWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState('192.168.10.42/24')
  const result = useMemo(() => {
    try {
      const [ip, prefixText] = input.split('/')
      const prefix = Number(prefixText)
      if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32)
        throw new Error('CIDR prefix must be between 0 and 32')
      const address = ipToNumber(ip)
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
      const network = (address & mask) >>> 0
      const broadcast = (network | (~mask >>> 0)) >>> 0
      const first = prefix >= 31 ? network : network + 1
      const last = prefix >= 31 ? broadcast : broadcast - 1
      return {
        value: JSON.stringify(
          {
            address: ip,
            prefix,
            subnetMask: numberToIp(mask),
            network: numberToIp(network),
            broadcast: numberToIp(broadcast),
            firstHost: numberToIp(first),
            lastHost: numberToIp(last),
            totalAddresses: 2 ** (32 - prefix),
            usableHosts:
              prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, 2 ** (32 - prefix) - 2),
          },
          null,
          2,
        ),
        error: false,
      }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid CIDR', error: true }
    }
  }, [input])
  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-2 p-5">
            <Label>IPv4 / CIDR</Label>
            <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
          </CardContent>
        </Card>
        <ResultCard
          title={locale === 'ja' ? 'ネットワーク情報' : 'Network information'}
          value={result.value}
          error={result.error}
        />
      </div>
    </SpecializedShell>
  )
}

export const JsonQueryWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [mode, setMode] = useState<'path' | 'schema'>('path')
  const [json, setJson] = useState(
    '{"users":[{"name":"Alice","active":true},{"name":"Bob","active":false}]}',
  )
  const [query, setQuery] = useState('$.users[?(@.active)].name')
  const [schema, setSchema] = useState(
    '{"type":"object","required":["users"],"properties":{"users":{"type":"array","items":{"type":"object","required":["name"]}}}}',
  )
  const result = useMemo(() => {
    try {
      const data = JSON.parse(json)
      if (mode === 'path')
        return {
          value: JSON.stringify(JSONPath({ path: query, json: data }), null, 2),
          error: false,
        }
      const ajv = new Ajv({ allErrors: true })
      const valid = ajv.validate(JSON.parse(schema), data)
      return { value: JSON.stringify({ valid, errors: ajv.errors ?? [] }, null, 2), error: false }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid input', error: true }
    }
  }, [json, mode, query, schema])
  return (
    <SpecializedShell tool={tool} onClear={() => setJson('')}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'path' ? 'default' : 'outline'} onClick={() => setMode('path')}>
            JSONPath
          </Button>
          <Button
            variant={mode === 'schema' ? 'default' : 'outline'}
            onClick={() => setMode('schema')}
          >
            JSON Schema
          </Button>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>JSON</Label>
              <Textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                className="min-h-64 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>{mode === 'path' ? 'JSONPath' : 'JSON Schema'}</Label>
              {mode === 'path' ? (
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="font-mono"
                />
              ) : (
                <Textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  className="min-h-64 font-mono"
                />
              )}
            </div>
          </CardContent>
        </Card>
        <ResultCard
          title={locale === 'ja' ? '結果' : 'Result'}
          value={result.value}
          error={result.error}
        />
      </div>
    </SpecializedShell>
  )
}

export const QrCodeWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState('https://devtoys.app/')
  const [size, setSize] = useState(320)
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    if (!input) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(input, { width: size, margin: 2, errorCorrectionLevel: level })
      .then((value) => {
        setDataUrl(value)
        setError('')
      })
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : 'QR generation failed'),
      )
  }, [input, level, size])
  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '内容' : 'Content'}</Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-40"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'ja' ? 'サイズ' : 'Size'}</Label>
                <Input
                  type="number"
                  min={128}
                  max={1024}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === 'ja' ? '誤り訂正' : 'Error correction'}</Label>
                <Input
                  value={level}
                  onChange={(e) => setLevel(e.target.value.toUpperCase() as typeof level)}
                />
              </div>
            </div>
            {dataUrl && (
              <a href={dataUrl} download="qr-code.png">
                <Button>{locale === 'ja' ? 'PNGを保存' : 'Save PNG'}</Button>
              </a>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex min-h-80 items-center justify-center rounded-xl border bg-white p-6">
            {dataUrl && (
              <img
                src={dataUrl}
                alt="Generated QR code"
                width={size}
                height={size}
                className="max-h-96 max-w-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

export const Base64ImageWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const sample =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMzIwIDE4MCI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIHJ4PSIyNCIgZmlsbD0iIzI1NjNlYiIvPjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZmlsbD0id2hpdGUiPkRldlRveXM8L3RleHQ+PC9zdmc+'
  const [value, setValue] = useState(sample)
  const valid = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)
  const loadFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => setValue(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <SpecializedShell tool={tool} onClear={() => setValue('')}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '画像ファイル（最大5MB）' : 'Image file (max 5 MB)'}</Label>
              <Input type="file" accept="image/*" onChange={(e) => loadFile(e.target.files?.[0])} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Data URL</Label>
                <CopyButton value={value} />
              </div>
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="min-h-80 font-mono text-xs"
              />
            </div>
          </div>
          <div className="flex min-h-96 items-center justify-center rounded-xl border bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px] p-6">
            {valid ? (
              <img src={value} alt="Base64 preview" className="max-h-[28rem] max-w-full" />
            ) : (
              <p className="text-sm text-destructive">
                {locale === 'ja'
                  ? '有効なBase64画像Data URLを入力してください'
                  : 'Enter a valid Base64 image Data URL'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
