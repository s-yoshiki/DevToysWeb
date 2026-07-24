import { bytesToBase64, bytesToHex } from '@/libs/domain/base64'

export const hmacAlgorithms = ['SHA-256', 'SHA-384', 'SHA-512'] as const
export type HmacAlgorithm = (typeof hmacAlgorithms)[number]

export const signHmac = async (message: string, secret: string, algorithm: HmacAlgorithm) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  const bytes = new Uint8Array(signature)
  return { hex: bytesToHex(bytes), base64: bytesToBase64(bytes) }
}
