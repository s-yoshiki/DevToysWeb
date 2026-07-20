// CloudFront Functions invokes this global entry point.
// biome-ignore lint/correctness/noUnusedVariables: Called by the CloudFront runtime.
function handler(event) {
  const request = event.request
  const uri = request.uri

  if (uri.endsWith('/')) {
    request.uri = `${uri}index.html`
    return request
  }

  // The static export writes `<route>/index.html` and Next.js runs with
  // `trailingSlash: true`, so the canonical form always ends in a slash.
  // Without this redirect a shared or hand-typed `/en/tool` misses in S3 and
  // comes back as the 404 page.
  const lastSegment = uri.slice(uri.lastIndexOf('/') + 1)
  if (lastSegment.indexOf('.') === -1) {
    const query = serializeQuerystring(request.querystring)
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: `${uri}/${query ? `?${query}` : ''}` } },
    }
  }

  return request
}

// Rebuilds the original query string so the redirect does not drop parameters.
// The cloudfront-js-2.0 runtime rejects `for...of`, so index loops only here.
function serializeQuerystring(querystring) {
  const parts = []
  for (const key in querystring) {
    const parameter = querystring[key]
    if (parameter.multiValue) {
      for (let i = 0; i < parameter.multiValue.length; i++) {
        const entry = parameter.multiValue[i]
        parts.push(entry.value === '' ? key : `${key}=${entry.value}`)
      }
    } else {
      parts.push(parameter.value === '' ? key : `${key}=${parameter.value}`)
    }
  }
  return parts.join('&')
}
