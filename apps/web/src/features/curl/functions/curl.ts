export type CurlRequest = {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
}

export const curlTargets = ['javascript', 'python', 'go'] as const
export type CurlTarget = (typeof curlTargets)[number]

const tokenizeCurl = (value: string) =>
  [...value.replace(/\\\r?\n/g, ' ').matchAll(/"((?:\\.|[^"\\])*)"|'([^']*)'|([^\s]+)/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  )

/** Understands the common method, header, and body flags of a cURL command. */
export const parseCurl = (value: string): CurlRequest => {
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

const toPython = (request: CurlRequest) =>
  `import requests\n\nresponse = requests.request(\n    ${JSON.stringify(request.method)},\n    ${JSON.stringify(request.url)},\n    headers=${JSON.stringify(request.headers, null, 4)}${request.body == null ? '' : `,\n    data=${JSON.stringify(request.body)}`}\n)\nprint(response.text)`

const toGo = (request: CurlRequest) =>
  `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"${request.body == null ? '' : '\n  "strings"'}\n)\n\nfunc main() {\n  req, _ := http.NewRequest(${JSON.stringify(request.method)}, ${JSON.stringify(request.url)}, ${request.body == null ? 'nil' : `strings.NewReader(${JSON.stringify(request.body)})`})\n${Object.entries(
    request.headers,
  )
    .map(([key, value]) => `  req.Header.Set(${JSON.stringify(key)}, ${JSON.stringify(value)})`)
    .join(
      '\n',
    )}\n  res, _ := http.DefaultClient.Do(req)\n  defer res.Body.Close()\n  body, _ := io.ReadAll(res.Body)\n  fmt.Println(string(body))\n}`

const toJavaScript = (request: CurlRequest) =>
  `const response = await fetch(${JSON.stringify(request.url)}, {\n  method: ${JSON.stringify(request.method)},\n  headers: ${JSON.stringify(request.headers, null, 2)}${request.body == null ? '' : `,\n  body: ${JSON.stringify(request.body)}`}\n})\n\nconst data = await response.text()\nconsole.log(data)`

export const curlToCode = (request: CurlRequest, target: CurlTarget) => {
  if (target === 'python') return toPython(request)
  if (target === 'go') return toGo(request)
  return toJavaScript(request)
}
