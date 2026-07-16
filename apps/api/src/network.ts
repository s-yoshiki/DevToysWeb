import { Resolver } from 'node:dns/promises'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { isIP } from 'node:net'
import { connect } from 'node:tls'

const resolver = new Resolver()
const MAX_BODY_BYTES = 1_000_000
const USER_AGENT = 'DevToysWeb-Diagnostics/1.0'

const blockedIpv4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^224\./,
  /^23[0-9]\./,
  /^24[0-9]\./,
  /^25[0-5]\./,
]

const isPublicIp = (address: string) => {
  if (isIP(address) === 4) {
    if (blockedIpv4.some((pattern) => pattern.test(address))) return false
    const [a, b] = address.split('.').map(Number)
    if (a === 100 && b >= 64 && b <= 127) return false
    if (a === 172 && b >= 16 && b <= 31) return false
    if (a === 192 && b === 0) return false
    if (a === 198 && (b === 18 || b === 19)) return false
    return true
  }
  if (isIP(address) === 6) {
    const value = address.toLowerCase()
    return !(
      value === '::' ||
      value === '::1' ||
      value.startsWith('fc') ||
      value.startsWith('fd') ||
      value.startsWith('fe8') ||
      value.startsWith('fe9') ||
      value.startsWith('fea') ||
      value.startsWith('feb') ||
      value.startsWith('ff') ||
      value.startsWith('::ffff:') ||
      value.startsWith('64:ff9b:') ||
      value.startsWith('2001:0:') ||
      value.startsWith('2001:db8')
    )
  }
  return false
}

export const normalizeUrl = (input: string) => {
  const value = /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('Only HTTP and HTTPS URLs are supported')
  if (url.username || url.password) throw new Error('URLs containing credentials are not supported')
  if (url.port && !['80', '443'].includes(url.port))
    throw new Error('Only ports 80 and 443 are supported')
  return url
}

export const resolvePublic = async (hostname: string) => {
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local'))
    throw new Error('Local hostnames are not allowed')
  const records = isIP(hostname)
    ? [{ address: hostname, family: isIP(hostname) }]
    : await resolver
        .resolveAny(hostname)
        .then((items) =>
          items
            .filter((item): item is { address: string } & typeof item => 'address' in item)
            .map((item) => ({ address: item.address, family: isIP(item.address) })),
        )
  if (!records.length) throw new Error('The hostname has no A or AAAA record')
  if (records.some(({ address }) => !isPublicIp(address)))
    throw new Error('The hostname resolves to a private or reserved address')
  return records
}

type SafeResponse = {
  url: string
  status: number
  headers: Record<string, string | string[]>
  body: string
  durationMs: number
}

const requestOnce = async (url: URL): Promise<SafeResponse> => {
  const addresses = await resolvePublic(url.hostname)
  const pinned = addresses[0]
  const started = performance.now()
  return await new Promise((resolve, reject) => {
    const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(
      {
        protocol: url.protocol,
        hostname: pinned.address,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        headers: {
          accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
          host: url.host,
          'user-agent': USER_AGENT,
        },
        servername: url.hostname,
        timeout: 7_000,
      },
      (response) => {
        const chunks: Buffer[] = []
        let size = 0
        response.on('data', (chunk: Buffer) => {
          size += chunk.length
          if (size <= MAX_BODY_BYTES) chunks.push(chunk)
          else request.destroy(new Error('Response body exceeds 1 MB'))
        })
        response.on('end', () =>
          resolve({
            url: url.toString(),
            status: response.statusCode ?? 0,
            headers: response.headers as Record<string, string | string[]>,
            body: Buffer.concat(chunks).toString('utf8'),
            durationMs: Math.round(performance.now() - started),
          }),
        )
      },
    )
    request.on('timeout', () => request.destroy(new Error('Request timed out')))
    request.on('error', reject)
    request.end()
  })
}

export const safeFetch = async (input: string, redirectLimit = 4) => {
  let url = normalizeUrl(input)
  const redirects: string[] = []
  for (let count = 0; count <= redirectLimit; count += 1) {
    const response = await requestOnce(url)
    const location = response.headers.location
    if (response.status >= 300 && response.status < 400 && typeof location === 'string') {
      if (count === redirectLimit) throw new Error('Too many redirects')
      url = normalizeUrl(new URL(location, url).toString())
      redirects.push(url.toString())
      continue
    }
    return { ...response, redirects }
  }
  throw new Error('Too many redirects')
}

export const inspectTls = async (url: URL) => {
  if (url.protocol !== 'https:') return null
  const [address] = await resolvePublic(url.hostname)
  return await new Promise<Record<string, unknown>>((resolve, reject) => {
    const socket = connect(
      {
        host: address.address,
        port: 443,
        servername: url.hostname,
        timeout: 7_000,
        rejectUnauthorized: true,
      },
      () => {
        const certificate = socket.getPeerCertificate()
        resolve({
          authorized: socket.authorized,
          protocol: socket.getProtocol(),
          cipher: socket.getCipher(),
          subject: certificate.subject,
          issuer: certificate.issuer,
          validFrom: certificate.valid_from,
          validTo: certificate.valid_to,
          fingerprint256: certificate.fingerprint256,
        })
        socket.end()
      },
    )
    socket.on('timeout', () => socket.destroy(new Error('TLS connection timed out')))
    socket.on('error', reject)
  })
}

export { resolver }
