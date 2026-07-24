import { decodeBase64, encodeBase64 } from '@/libs/domain/base64'

export const buildBasicAuthHeader = (username: string, password: string) =>
  `Authorization: Basic ${encodeBase64(`${username}:${password}`)}`

export const parseBasicAuthHeader = (header: string) => {
  const raw = header.replace(/^Authorization:\s*/i, '').replace(/^Basic\s+/i, '')
  const decoded = decodeBase64(raw)
  const separator = decoded.indexOf(':')
  return {
    username: separator < 0 ? decoded : decoded.slice(0, separator),
    password: separator < 0 ? '' : decoded.slice(separator + 1),
  }
}
