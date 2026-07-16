'use client'

import { CircleAlert, LoaderCircle, Play } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import type { ToolDefinition } from '../domain/catalog'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const configuredApiBase = process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL?.replace(/\/$/, '')
const apiBase = configuredApiBase
  ? configuredApiBase.endsWith('/api')
    ? configuredApiBase
    : `${configuredApiBase}/api`
  : '/api'

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const callApi = async (path: string, body: unknown) => {
  const payload = JSON.stringify(body)
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-amz-content-sha256': await sha256(payload),
    },
    body: payload,
  })
  const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
  if (!response.ok) throw new Error(result.error ?? `HTTP ${response.status}`)
  return result
}

const Result = ({ value, error }: { value: string; error: string }) => (
  <>
    {error && (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        <span>{error}</span>
      </div>
    )}
    <div className="flex justify-end">
      <CopyButton value={value} />
    </div>
    <Textarea readOnly value={value} className="min-h-[30rem] font-mono text-xs" />
  </>
)

export const SiteDiagnosticsWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [url, setUrl] = useState('https://example.com')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const run = async () => {
    setLoading(true)
    setError('')
    try {
      setOutput(JSON.stringify(await callApi('/diagnose', { url }), null, 2))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Diagnostics failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setUrl('')
        setOutput('')
        setError('')
      }}
    >
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="diagnostics-url">URL / domain</Label>
            <div className="flex gap-2">
              <Input
                id="diagnostics-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void run()
                }}
              />
              <Button onClick={run} disabled={loading || !url.trim()}>
                {loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {locale === 'ja' ? '診断' : 'Inspect'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'ja'
                ? 'DNS、HTTP、TLS証明書、セキュリティヘッダー、OGPをまとめて確認します。'
                : 'Inspect DNS, HTTP, TLS, security headers, and page metadata.'}
            </p>
          </div>
          <Result value={output} error={error} />
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

type KeyMode = 'secret' | 'jwks' | 'publicKey'

export const JwtVerifyWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [token, setToken] = useState('')
  const [mode, setMode] = useState<KeyMode>('jwks')
  const [key, setKey] = useState('')
  const [issuer, setIssuer] = useState('')
  const [audience, setAudience] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const body = {
        token,
        issuer: issuer || undefined,
        audience: audience || undefined,
        [mode]: key,
      }
      setOutput(JSON.stringify(await callApi('/jwt/verify', body), null, 2))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'JWT verification failed')
    } finally {
      setLoading(false)
    }
  }
  const labels: Record<KeyMode, string> = {
    secret: 'HMAC Secret',
    jwks: 'JWKS URL',
    publicKey: 'PEM public key',
  }
  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setToken('')
        setKey('')
        setIssuer('')
        setAudience('')
        setOutput('')
        setError('')
      }}
    >
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label>JWT</Label>
            <Textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="min-h-28 break-all font-mono"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['jwks', 'publicKey', 'secret'] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={mode === item ? 'default' : 'outline'}
                onClick={() => {
                  setMode(item)
                  setKey('')
                }}
              >
                {labels[item]}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>{labels[mode]}</Label>
            {mode === 'publicKey' ? (
              <Textarea
                value={key}
                onChange={(event) => setKey(event.target.value)}
                className="min-h-28 font-mono"
              />
            ) : (
              <Input
                type={mode === 'secret' ? 'password' : 'url'}
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder={mode === 'jwks' ? 'https://example.com/.well-known/jwks.json' : ''}
              />
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Issuer (optional)</Label>
              <Input value={issuer} onChange={(event) => setIssuer(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Audience (optional)</Label>
              <Input value={audience} onChange={(event) => setAudience(event.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={run} disabled={loading || !token.trim() || !key.trim()}>
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              {locale === 'ja' ? '署名を検証' : 'Verify signature'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {locale === 'ja'
              ? '入力したJWTと鍵は保存されません。機密性の高い秘密鍵は入力しないでください。'
              : 'Tokens and keys are not stored. Never enter a private key.'}
          </p>
          <Result value={output} error={error} />
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
