'use client'

import { diffWordsWithSpace } from 'diff'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import type { ToolDefinition } from '../domain/catalog'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

const decodeBase64 = (value: string) => {
  const binary = atob(value)
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

const decodeJwtPart = (value: string) =>
  JSON.parse(
    decodeBase64(
      value
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(value.length / 4) * 4, '='),
    ),
  )

export const JwtWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldlRveXMgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  )
  const result = useMemo(() => {
    try {
      const parts = token.trim().split('.')
      if (parts.length !== 3) throw new Error('JWT must contain three dot-separated parts')
      const header = decodeJwtPart(parts[0])
      const payload = decodeJwtPart(parts[1])
      const now = Math.floor(Date.now() / 1000)
      const dates = Object.fromEntries(
        ['iat', 'exp', 'nbf']
          .filter((claim) => typeof payload[claim] === 'number')
          .map((claim) => [claim, new Date(payload[claim] * 1000).toISOString()]),
      )
      return {
        value: JSON.stringify(
          {
            header,
            payload,
            signature: parts[2],
            claimDates: dates,
            expired: typeof payload.exp === 'number' ? payload.exp < now : null,
            active: typeof payload.nbf === 'number' ? payload.nbf <= now : null,
            note:
              locale === 'ja'
                ? '内容のデコードのみで、署名は検証していません。'
                : 'Decoded only; the signature has not been verified.',
          },
          null,
          2,
        ),
        error: false,
      }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid JWT', error: true }
    }
  }, [locale, token])
  return (
    <SpecializedShell tool={tool} onClear={() => setToken('')}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label>JWT</Label>
            <Textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-32 break-all font-mono"
            />
          </div>
          <div className="flex justify-end">
            <CopyButton value={result.value} />
          </div>
          <Textarea
            readOnly
            value={result.value}
            className={`min-h-[28rem] font-mono ${result.error ? 'text-destructive' : ''}`}
          />
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

type CurlRequest = { url: string; method: string; headers: Record<string, string>; body?: string }
const tokenizeCurl = (value: string) =>
  [...value.replace(/\\\r?\n/g, ' ').matchAll(/"((?:\\.|[^"\\])*)"|'([^']*)'|([^\s]+)/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  )
const parseCurl = (value: string): CurlRequest => {
  const tokens = tokenizeCurl(value)
  if (tokens[0] !== 'curl') throw new Error('Input must start with curl')
  const request: CurlRequest = { url: '', method: 'GET', headers: {} }
  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token === '-X' || token === '--request') request.method = tokens[++index]?.toUpperCase()
    else if (token === '-H' || token === '--header') {
      const header = tokens[++index] ?? ''
      const separator = header.indexOf(':')
      if (separator > 0)
        request.headers[header.slice(0, separator).trim()] = header.slice(separator + 1).trim()
    } else if (['-d', '--data', '--data-raw', '--data-binary'].includes(token)) {
      request.body = tokens[++index] ?? ''
      if (request.method === 'GET') request.method = 'POST'
    } else if (!token.startsWith('-')) request.url = token
  }
  if (!request.url) throw new Error('cURL command does not contain a URL')
  return request
}
const curlToCode = (request: CurlRequest, language: string) => {
  if (language === 'python')
    return `import requests\n\nresponse = requests.request(\n    ${JSON.stringify(request.method)},\n    ${JSON.stringify(request.url)},\n    headers=${JSON.stringify(request.headers, null, 4)}${request.body == null ? '' : `,\n    data=${JSON.stringify(request.body)}`}\n)\nprint(response.text)`
  if (language === 'go')
    return `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"${request.body == null ? '' : '\n  "strings"'}\n)\n\nfunc main() {\n  req, _ := http.NewRequest(${JSON.stringify(request.method)}, ${JSON.stringify(request.url)}, ${request.body == null ? 'nil' : `strings.NewReader(${JSON.stringify(request.body)})`})\n${Object.entries(
      request.headers,
    )
      .map(([key, value]) => `  req.Header.Set(${JSON.stringify(key)}, ${JSON.stringify(value)})`)
      .join(
        '\n',
      )}\n  res, _ := http.DefaultClient.Do(req)\n  defer res.Body.Close()\n  body, _ := io.ReadAll(res.Body)\n  fmt.Println(string(body))\n}`
  return `const response = await fetch(${JSON.stringify(request.url)}, {\n  method: ${JSON.stringify(request.method)},\n  headers: ${JSON.stringify(request.headers, null, 2)}${request.body == null ? '' : `,\n  body: ${JSON.stringify(request.body)}`}\n})\n\nconst data = await response.text()\nconsole.log(data)`
}

export const CurlWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [input, setInput] = useState(
    "curl -X POST 'https://api.example.com/users' -H 'Content-Type: application/json' -H 'Authorization: Bearer token' -d '{\"name\":\"DevToys\"}'",
  )
  const [language, setLanguage] = useState('javascript')
  const result = useMemo(() => {
    try {
      return { value: curlToCode(parseCurl(input), language), error: false }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid cURL', error: true }
    }
  }, [input, language])
  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {['javascript', 'python', 'go'].map((item) => (
            <Button
              key={item}
              variant={language === item ? 'default' : 'outline'}
              onClick={() => setLanguage(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <Card>
          <CardContent className="grid min-h-[32rem] p-0 lg:grid-cols-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-64 resize-none rounded-none border-0 border-b p-5 font-mono shadow-none lg:border-b-0 lg:border-r"
            />
            <div className="flex flex-col">
              <div className="flex justify-end border-b p-2">
                <CopyButton value={result.value} />
              </div>
              <Textarea
                readOnly
                value={result.value}
                className={`min-h-64 flex-1 resize-none rounded-none border-0 p-5 font-mono shadow-none ${result.error ? 'text-destructive' : ''}`}
              />
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          {locale === 'ja'
            ? '基本的なメソッド、ヘッダー、リクエストボディに対応します。'
            : 'Supports common methods, headers, and request bodies.'}
        </p>
      </div>
    </SpecializedShell>
  )
}

export const HmacWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [message, setMessage] = useState('Hello, DevToys!')
  const [secret, setSecret] = useState('development-secret')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [output, setOutput] = useState('')
  useEffect(() => {
    crypto.subtle
      .importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign'],
      )
      .then((key) => crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)))
      .then((signature) => {
        const bytes = new Uint8Array(signature)
        const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
        let binary = ''
        for (const byte of bytes) binary += String.fromCharCode(byte)
        setOutput(JSON.stringify({ hex, base64: btoa(binary) }, null, 2))
      })
      .catch((reason) =>
        setOutput(reason instanceof Error ? reason.message : 'HMAC generation failed'),
      )
  }, [algorithm, message, secret])
  return (
    <SpecializedShell tool={tool} onClear={() => setMessage('')}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{locale === 'ja' ? 'メッセージ' : 'Message'}</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Secret</Label>
              <Textarea value={secret} onChange={(e) => setSecret(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            {['SHA-256', 'SHA-384', 'SHA-512'].map((item) => (
              <Button
                key={item}
                size="sm"
                variant={algorithm === item ? 'default' : 'outline'}
                onClick={() => setAlgorithm(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="flex justify-end">
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-52 font-mono" />
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

export const BasicAuthWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [username, setUsername] = useState('devtoys')
  const [password, setPassword] = useState('secret')
  const [header, setHeader] = useState('Basic ZGV2dG95czpzZWNyZXQ=')
  const output = useMemo(() => {
    try {
      if (mode === 'encode')
        return `Authorization: Basic ${encodeBase64(`${username}:${password}`)}`
      const raw = header.replace(/^Authorization:\s*/i, '').replace(/^Basic\s+/i, '')
      const decoded = decodeBase64(raw)
      const separator = decoded.indexOf(':')
      return JSON.stringify(
        {
          username: separator < 0 ? decoded : decoded.slice(0, separator),
          password: separator < 0 ? '' : decoded.slice(separator + 1),
        },
        null,
        2,
      )
    } catch (reason) {
      return reason instanceof Error ? reason.message : 'Invalid Basic auth header'
    }
  }, [header, mode, password, username])
  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setUsername('')
        setPassword('')
        setHeader('')
      }}
    >
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex gap-2">
            <Button
              variant={mode === 'encode' ? 'default' : 'outline'}
              onClick={() => setMode('encode')}
            >
              {locale === 'ja' ? '生成' : 'Encode'}
            </Button>
            <Button
              variant={mode === 'decode' ? 'default' : 'outline'}
              onClick={() => setMode('decode')}
            >
              {locale === 'ja' ? '解析' : 'Decode'}
            </Button>
          </div>
          {mode === 'encode' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{locale === 'ja' ? 'ユーザー名' : 'Username'}</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{locale === 'ja' ? 'パスワード' : 'Password'}</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Authorization header</Label>
              <Textarea value={header} onChange={(e) => setHeader(e.target.value)} />
            </div>
          )}
          <div className="flex justify-end">
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-36 font-mono" />
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

export const TextDiffWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [before, setBefore] = useState('const version = 1\nconsole.log("DevToys")')
  const [after, setAfter] = useState('const version = 2\nconsole.log("DevToys Web")')
  const changes = useMemo(() => diffWordsWithSpace(before, after), [after, before])
  const summary = `${changes.filter((part) => part.added).length} additions, ${changes.filter((part) => part.removed).length} deletions`
  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setBefore('')
        setAfter('')
      }}
    >
      <div className="space-y-4">
        <Card>
          <CardContent className="grid p-0 lg:grid-cols-2">
            <div>
              <div className="border-b px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                {locale === 'ja' ? '変更前' : 'Before'}
              </div>
              <Textarea
                value={before}
                onChange={(e) => setBefore(e.target.value)}
                className="min-h-64 resize-none rounded-none border-0 p-5 font-mono shadow-none"
              />
            </div>
            <div className="border-t lg:border-l lg:border-t-0">
              <div className="border-b px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">
                {locale === 'ja' ? '変更後' : 'After'}
              </div>
              <Textarea
                value={after}
                onChange={(e) => setAfter(e.target.value)}
                className="min-h-64 resize-none rounded-none border-0 p-5 font-mono shadow-none"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 text-sm text-muted-foreground">{summary}</div>
            <pre className="whitespace-pre-wrap break-words rounded-xl border bg-muted/20 p-5 font-mono text-sm">
              {changes.map((part, index) => (
                <span
                  key={`${index}-${part.value}`}
                  className={
                    part.added
                      ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                      : part.removed
                        ? 'bg-red-500/25 text-red-700 line-through dark:text-red-300'
                        : ''
                  }
                >
                  {part.value}
                </span>
              ))}
            </pre>
          </CardContent>
        </Card>
      </div>
    </SpecializedShell>
  )
}
