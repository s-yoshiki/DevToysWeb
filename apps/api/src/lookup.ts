import { connect } from 'node:net'
import { resolvePublic, resolver } from './network.js'

const hostnamePattern = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export const assertQueryableHostname = (hostname: string) => {
  const value = hostname.trim().toLowerCase().replace(/\.$/, '')
  if (!hostnamePattern.test(value)) throw new Error('Enter a valid public domain name')
  if (value === 'localhost' || value.endsWith('.localhost') || value.endsWith('.local'))
    throw new Error('Local hostnames are not allowed')
  return value
}

const settle = async <T>(task: Promise<T>) =>
  task
    .then((value) => ({ value }))
    .catch((reason) => ({ error: reason instanceof Error ? reason.message : String(reason) }))

const recordTypes = ['a', 'aaaa', 'cname', 'mx', 'txt', 'ns', 'soa', 'srv', 'caa', 'ptr'] as const
export type RecordType = (typeof recordTypes)[number]

export const isRecordType = (value: unknown): value is RecordType =>
  typeof value === 'string' && (recordTypes as readonly string[]).includes(value)

const resolveOne = (hostname: string, type: RecordType): Promise<unknown> => {
  switch (type) {
    case 'a':
      return resolver.resolve4(hostname, { ttl: true })
    case 'aaaa':
      return resolver.resolve6(hostname, { ttl: true })
    case 'cname':
      return resolver.resolveCname(hostname)
    case 'mx':
      return resolver.resolveMx(hostname)
    case 'txt':
      return resolver.resolveTxt(hostname)
    case 'ns':
      return resolver.resolveNs(hostname)
    case 'soa':
      return resolver.resolveSoa(hostname)
    case 'srv':
      return resolver.resolveSrv(hostname)
    case 'caa':
      return resolver.resolveCaa(hostname)
    case 'ptr':
      return resolver.resolvePtr(hostname)
  }
}

export const lookupDns = async (input: string, types?: RecordType[]) => {
  const hostname = assertQueryableHostname(input)
  const wanted = types?.length ? [...new Set(types)] : [...recordTypes]
  const results = await Promise.all(wanted.map((type) => settle(resolveOne(hostname, type))))
  return {
    hostname,
    records: Object.fromEntries(wanted.map((type, index) => [type, results[index]])),
  }
}

const WHOIS_PORT = 43
const WHOIS_TIMEOUT_MS = 7_000
const WHOIS_MAX_BYTES = 200_000

/**
 * WHOIS is a plain-text TCP protocol: send the query, read until the server
 * closes. The server address is resolved through the same public-IP guard as
 * every other outbound call so a hostile referral cannot reach internal hosts.
 */
const askWhoisServer = async (server: string, query: string) => {
  const [address] = await resolvePublic(server)
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    const socket = connect({ host: address.address, port: WHOIS_PORT, timeout: WHOIS_TIMEOUT_MS })
    socket.on('connect', () => socket.write(`${query}\r\n`))
    socket.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > WHOIS_MAX_BYTES) {
        socket.destroy(new Error('WHOIS response exceeds 200 KB'))
        return
      }
      chunks.push(chunk)
    })
    socket.on('timeout', () => socket.destroy(new Error('WHOIS request timed out')))
    socket.on('error', reject)
    socket.on('close', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

const referralOf = (response: string) =>
  response.match(/^\s*(?:refer|whois server|registrar whois server):\s*(\S+)\s*$/im)?.[1]

/** The handful of fields worth surfacing above the raw text. */
const summaryFields: Record<string, RegExp> = {
  registrar: /^\s*registrar:\s*(.+)$/im,
  createdAt: /^\s*(?:creation date|created|registered on):\s*(.+)$/im,
  updatedAt: /^\s*(?:updated date|last updated|changed):\s*(.+)$/im,
  expiresAt: /^\s*(?:registry expiry date|expiry date|expires on|expiration date):\s*(.+)$/im,
  status: /^\s*(?:domain status|status):\s*(.+)$/im,
}

export const lookupWhois = async (input: string) => {
  const domain = assertQueryableHostname(input)
  const servers: string[] = []
  const responses: string[] = []

  let server = 'whois.iana.org'
  // IANA answers with the TLD registry, which in turn refers to the registrar.
  for (let hop = 0; hop < 3; hop += 1) {
    servers.push(server)
    const response = await askWhoisServer(server, domain)
    responses.push(response)

    const referral = referralOf(response)?.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!referral || servers.includes(referral)) break
    server = referral
  }

  const raw = responses.at(-1) ?? ''
  return {
    domain,
    servers,
    summary: Object.fromEntries(
      Object.entries(summaryFields).map(([key, pattern]) => [key, raw.match(pattern)?.[1].trim() ?? null]),
    ),
    raw,
  }
}
