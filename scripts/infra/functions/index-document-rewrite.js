// CloudFront Functions invokes this global entry point.
// biome-ignore lint/correctness/noUnusedVariables: Called by the CloudFront runtime.
function handler(event) {
  const request = event.request

  if (request.uri.endsWith('/')) {
    request.uri += 'index.html'
  }

  return request
}
