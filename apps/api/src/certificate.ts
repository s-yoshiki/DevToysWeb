import { X509Certificate } from 'node:crypto'

const pemPattern = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g

/** Splits a bundle so a full chain can be decoded in one request. */
const extractCertificates = (input: string) => {
  const blocks = input.match(pemPattern)
  if (blocks?.length) return blocks

  // Accept a bare Base64 body too — that is what most "copy the cert" flows yield.
  const body = input.replace(/\s+/g, '')
  if (!body) throw new Error('No certificate found in the input')
  // Base64 is always padded to a multiple of four characters.
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(body) || body.length % 4 !== 0)
    throw new Error('Input is neither PEM nor a Base64-encoded certificate')
  return [`-----BEGIN CERTIFICATE-----\n${body}\n-----END CERTIFICATE-----`]
}

/** `X509Certificate` exposes the distinguished name as newline-separated pairs. */
const parseDistinguishedName = (value: string) =>
  Object.fromEntries(
    value
      .split('\n')
      .map((line) => line.split('='))
      .filter((parts) => parts.length >= 2)
      .map(([key, ...rest]) => [key.trim(), rest.join('=').trim()]),
  )

const describe = (certificate: X509Certificate) => {
  const validFrom = new Date(certificate.validFrom)
  const validTo = new Date(certificate.validTo)
  const now = Date.now()

  return {
    subject: parseDistinguishedName(certificate.subject),
    issuer: parseDistinguishedName(certificate.issuer),
    subjectAltName: certificate.subjectAltName?.split(', ') ?? [],
    serialNumber: certificate.serialNumber,
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining: Math.floor((validTo.getTime() - now) / 86_400_000),
    expired: validTo.getTime() < now,
    notYetValid: validFrom.getTime() > now,
    selfSigned: certificate.subject === certificate.issuer,
    ca: certificate.ca,
    keyType: certificate.publicKey.asymmetricKeyType ?? null,
    keySize: certificate.publicKey.asymmetricKeyDetails?.modulusLength ?? null,
    keyCurve: certificate.publicKey.asymmetricKeyDetails?.namedCurve ?? null,
    fingerprintSha256: certificate.fingerprint256,
    fingerprintSha1: certificate.fingerprint,
    infoAccess: certificate.infoAccess ?? null,
  }
}

export const decodeCertificate = (pem: string) => {
  const blocks = extractCertificates(pem)
  if (blocks.length > 10) throw new Error('At most 10 certificates can be decoded at once')

  const certificates = blocks.map((block, index) => {
    try {
      return describe(new X509Certificate(block))
    } catch (reason) {
      throw new Error(
        `Certificate ${index + 1} could not be parsed: ${
          reason instanceof Error ? reason.message : 'unknown error'
        }`,
      )
    }
  })

  return { count: certificates.length, certificates }
}
