/** Shape of the `/api/diagnose` response the rich workspace renders. */

export type Settled<T> = { value: T } | { error: string }

export type MxRecord = { priority: number; exchange: string }

export type DnsRecords = {
  a: Settled<string[]>
  aaaa: Settled<string[]>
  cname: Settled<string[]>
  mx: Settled<MxRecord[]>
  txt: Settled<string[][]>
  ns: Settled<string[]>
}

export type TlsCertificate = {
  authorized: boolean
  protocol: string | null
  cipher: { name: string; version: string } | null
  subject: Record<string, string>
  issuer: Record<string, string>
  validFrom: string
  validTo: string
  fingerprint256: string
}

export type FullSiteReport = {
  target: string
  dns: DnsRecords
  http: {
    finalUrl: string
    status: number
    durationMs: number
    redirects: string[]
    headers: Record<string, string | string[]>
    securityHeaders: Record<string, string | null>
  }
  tls: Settled<TlsCertificate | null>
  page: Record<string, string>
  signals: {
    lang: string | null
    charset: string | null
    h1: string[]
    h2: string[]
    images: { total: number; missingAlt: number }
    links: { total: number; external: number; internal: number }
    textLength: number
  }
}

export const isOk = <T>(settled: Settled<T> | undefined): settled is { value: T } =>
  settled !== undefined && 'value' in settled
