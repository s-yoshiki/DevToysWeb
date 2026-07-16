import { inspectTls, normalizeUrl, resolver, safeFetch } from './network.js'

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const decodeEntities = (value: string) =>
  value.replace(
    /&(?:amp|lt|gt|quot|#39);/g,
    (entity) =>
      ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity] ?? entity,
  )

const extractMetadata = (html: string) => {
  const result: Record<string, string> = {}
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  if (title) result.title = decodeEntities(title.trim())
  for (const match of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const tag = match[0]
    const key = tag.match(/(?:name|property)=["']([^"']+)["']/i)?.[1]
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1]
    if (key && content && /^(?:description|robots|og:|twitter:)/i.test(key))
      result[key.toLowerCase()] = decodeEntities(content)
  }
  const canonical = html.match(/<link\s+[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i)?.[0]
  const href = canonical?.match(/href=["']([^"']+)["']/i)?.[1]
  if (href) result.canonical = href
  return result
}

const settle = async <T>(task: Promise<T>) =>
  task
    .then((value) => ({ value }))
    .catch((reason) => ({ error: reason instanceof Error ? reason.message : String(reason) }))

export const diagnose = async (input: string) => {
  const url = normalizeUrl(input)
  const dns = await Promise.all([
    settle(resolver.resolve4(url.hostname)),
    settle(resolver.resolve6(url.hostname)),
    settle(resolver.resolveCname(url.hostname)),
    settle(resolver.resolveMx(url.hostname)),
    settle(resolver.resolveTxt(url.hostname)),
    settle(resolver.resolveNs(url.hostname)),
  ])
  const [http, tls] = await Promise.all([safeFetch(url.toString()), settle(inspectTls(url))])
  return {
    target: url.toString(),
    dns: Object.fromEntries(
      ['a', 'aaaa', 'cname', 'mx', 'txt', 'ns'].map((key, index) => [key, dns[index]]),
    ),
    http: {
      finalUrl: http.url,
      status: http.status,
      durationMs: http.durationMs,
      redirects: http.redirects,
      headers: http.headers,
      securityHeaders: Object.fromEntries(
        [
          'strict-transport-security',
          'content-security-policy',
          'x-content-type-options',
          'x-frame-options',
          'referrer-policy',
          'permissions-policy',
        ].map((key) => [key, first(http.headers[key]) ?? null]),
      ),
    },
    tls,
    page: extractMetadata(http.body),
  }
}
