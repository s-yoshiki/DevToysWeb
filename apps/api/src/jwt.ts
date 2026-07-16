import { constants, createHmac, createPublicKey, timingSafeEqual, verify } from 'node:crypto'
import { safeFetch } from './network.js'

const decode = (value: string) => Buffer.from(value, 'base64url')
const algorithms: Record<string, { digest: string; kind: 'hmac' | 'rsa' | 'pss' | 'ecdsa' }> = {
  HS256: { digest: 'sha256', kind: 'hmac' },
  HS384: { digest: 'sha384', kind: 'hmac' },
  HS512: { digest: 'sha512', kind: 'hmac' },
  RS256: { digest: 'sha256', kind: 'rsa' },
  RS384: { digest: 'sha384', kind: 'rsa' },
  RS512: { digest: 'sha512', kind: 'rsa' },
  PS256: { digest: 'sha256', kind: 'pss' },
  PS384: { digest: 'sha384', kind: 'pss' },
  PS512: { digest: 'sha512', kind: 'pss' },
  ES256: { digest: 'sha256', kind: 'ecdsa' },
  ES384: { digest: 'sha384', kind: 'ecdsa' },
  ES512: { digest: 'sha512', kind: 'ecdsa' },
}

type VerifyInput = {
  token: string
  secret?: string
  publicKey?: string
  jwksUrl?: string
  issuer?: string
  audience?: string
}

export const verifyJwt = async (input: VerifyInput) => {
  const parts = input.token.trim().split('.')
  if (parts.length !== 3) throw new Error('JWT must contain three parts')
  const header = JSON.parse(decode(parts[0]).toString('utf8')) as { alg?: string; kid?: string }
  const payload = JSON.parse(decode(parts[1]).toString('utf8')) as Record<string, unknown>
  if (!header.alg || header.alg === 'none' || !algorithms[header.alg])
    throw new Error('Unsupported or unsafe JWT algorithm')
  const algorithm = algorithms[header.alg]
  const signed = Buffer.from(`${parts[0]}.${parts[1]}`)
  const signature = decode(parts[2])
  let validSignature = false
  if (algorithm.kind === 'hmac') {
    if (!input.secret) throw new Error('A secret is required for HMAC tokens')
    const expected = createHmac(algorithm.digest, input.secret).update(signed).digest()
    validSignature = expected.length === signature.length && timingSafeEqual(expected, signature)
  } else {
    let key: string | JsonWebKey | undefined = input.publicKey
    if (input.jwksUrl) {
      const response = await safeFetch(input.jwksUrl, 2)
      const jwks = JSON.parse(response.body) as { keys?: Array<JsonWebKey & { kid?: string }> }
      key = jwks.keys?.find((item) => !header.kid || item.kid === header.kid)
      if (!key) throw new Error('No matching key was found in JWKS')
    }
    if (!key) throw new Error('A public key or JWKS URL is required')
    const publicKey =
      typeof key === 'string' ? createPublicKey(key) : createPublicKey({ key, format: 'jwk' })
    validSignature = verify(
      algorithm.digest,
      signed,
      algorithm.kind === 'pss'
        ? {
            key: publicKey,
            padding: constants.RSA_PKCS1_PSS_PADDING,
            saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
          }
        : algorithm.kind === 'ecdsa'
          ? { key: publicKey, dsaEncoding: 'ieee-p1363' }
          : publicKey,
      signature,
    )
  }
  const now = Math.floor(Date.now() / 1000)
  const errors: string[] = []
  if (!validSignature) errors.push('Invalid signature')
  if (typeof payload.exp === 'number' && payload.exp <= now) errors.push('Token has expired')
  if (typeof payload.nbf === 'number' && payload.nbf > now) errors.push('Token is not active yet')
  if (input.issuer && payload.iss !== input.issuer) errors.push('Issuer does not match')
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
  if (input.audience && !audiences.includes(input.audience)) errors.push('Audience does not match')
  return { valid: errors.length === 0, signatureValid: validSignature, header, payload, errors }
}
