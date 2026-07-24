import CryptoJS from 'crypto-js'

/** UUID variants this tool can produce in bulk. */
export type UuidVersion = 'v1' | 'v4' | 'v7' | 'nil' | 'max' | 'ulid'

/** Namespace-based (name → UUID) variants. Deterministic, so generated singly. */
export type NamedUuidVersion = 'v3' | 'v5'

/** RFC 4122 predefined namespaces plus a custom slot. */
export const uuidNamespaces = {
  dns: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  url: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  oid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const

export type NamespacePreset = keyof typeof uuidNamespaces | 'custom'

const randomBytes = (length: number) => {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

const bytesToUuid = (bytes: Uint8Array) => {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

/** UUID v4 — 122 random bits. Uses the platform generator when available. */
export const uuidV4 = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = randomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return bytesToUuid(bytes)
}

// Gregorian offset: 100-ns intervals between 1582-10-15 and the Unix epoch.
const GREGORIAN_OFFSET = 122192928000000000n

let v1Clock = randomBytes(2)
let v1Node: Uint8Array | null = null

/** UUID v1 — 60-bit timestamp, random clock sequence and a random node. */
export const uuidV1 = () => {
  if (!v1Node) {
    v1Node = randomBytes(6)
    v1Node[0] |= 0x01 // set the multicast bit so we never collide with a real MAC
  }
  const timestamp = GREGORIAN_OFFSET + BigInt(Date.now()) * 10000n + BigInt(v1Clock[1] & 0x0f)
  const timeLow = Number(timestamp & 0xffffffffn)
  const timeMid = Number((timestamp >> 32n) & 0xffffn)
  const timeHigh = Number((timestamp >> 48n) & 0x0fffn) | 0x1000

  const bytes = new Uint8Array(16)
  bytes[0] = (timeLow >>> 24) & 0xff
  bytes[1] = (timeLow >>> 16) & 0xff
  bytes[2] = (timeLow >>> 8) & 0xff
  bytes[3] = timeLow & 0xff
  bytes[4] = (timeMid >>> 8) & 0xff
  bytes[5] = timeMid & 0xff
  bytes[6] = (timeHigh >>> 8) & 0xff
  bytes[7] = timeHigh & 0xff
  bytes[8] = (v1Clock[0] & 0x3f) | 0x80
  bytes[9] = v1Clock[1]
  bytes.set(v1Node, 10)
  v1Clock = randomBytes(2)
  return bytesToUuid(bytes)
}

/** UUID v7 — 48-bit Unix-ms timestamp followed by 74 random bits. */
export const uuidV7 = () => {
  const bytes = randomBytes(16)
  const timestamp = Date.now()
  bytes[0] = (timestamp / 2 ** 40) & 0xff
  bytes[1] = (timestamp / 2 ** 32) & 0xff
  bytes[2] = (timestamp / 2 ** 24) & 0xff
  bytes[3] = (timestamp / 2 ** 16) & 0xff
  bytes[4] = (timestamp / 2 ** 8) & 0xff
  bytes[5] = timestamp & 0xff
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return bytesToUuid(bytes)
}

export const NIL_UUID = '00000000-0000-0000-0000-000000000000'
export const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff'

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/** ULID — 48-bit timestamp + 80 bits of randomness, Crockford Base32. */
export const ulid = (time = Date.now()) => {
  let timeChars = ''
  let t = time
  for (let i = 0; i < 10; i++) {
    timeChars = CROCKFORD[t % 32] + timeChars
    t = Math.floor(t / 32)
  }
  const random = randomBytes(10)
  let randomChars = ''
  // 80 random bits → 16 Base32 chars, consuming 5 bits at a time.
  let bitBuffer = 0
  let bitCount = 0
  for (const byte of random) {
    bitBuffer = (bitBuffer << 8) | byte
    bitCount += 8
    while (bitCount >= 5) {
      bitCount -= 5
      randomChars += CROCKFORD[(bitBuffer >> bitCount) & 0x1f]
    }
  }
  return timeChars + randomChars.slice(0, 16)
}

const generateOne = (version: UuidVersion): string => {
  switch (version) {
    case 'v1':
      return uuidV1()
    case 'v4':
      return uuidV4()
    case 'v7':
      return uuidV7()
    case 'nil':
      return NIL_UUID
    case 'max':
      return MAX_UUID
    case 'ulid':
      return ulid()
  }
}

/** Produce `count` identifiers of the given version. */
export const generateUuids = (version: UuidVersion, count: number): string[] =>
  Array.from({ length: Math.max(1, Math.min(count, 1000)) }, () => generateOne(version))

const hexToBytes = (hex: string) => {
  const clean = hex.replace(/[^0-9a-f]/gi, '')
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.substr(i * 2, 2), 16)
  return bytes
}

const wordArrayToBytes = (wordArray: CryptoJS.lib.WordArray) => {
  const { words, sigBytes } = wordArray
  const bytes = new Uint8Array(sigBytes)
  for (let i = 0; i < sigBytes; i++) bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
  return bytes
}

const bytesToWordArray = (bytes: Uint8Array) =>
  CryptoJS.lib.WordArray.create(bytes as unknown as number[], bytes.length)

/**
 * Name-based UUID (v3 = MD5, v5 = SHA-1). Hashes the namespace bytes followed by
 * the UTF-8 name, then stamps in the version and variant bits.
 */
export const namedUuid = (version: NamedUuidVersion, namespace: string, name: string): string => {
  const namespaceBytes = hexToBytes(namespace)
  if (namespaceBytes.length !== 16) throw new Error('invalid-namespace')
  const nameBytes = new TextEncoder().encode(name)
  const combined = new Uint8Array(16 + nameBytes.length)
  combined.set(namespaceBytes)
  combined.set(nameBytes, 16)

  const wordArray = bytesToWordArray(combined)
  const digest = version === 'v3' ? CryptoJS.MD5(wordArray) : CryptoJS.SHA1(wordArray)
  const hash = wordArrayToBytes(digest).slice(0, 16)
  hash[6] = (hash[6] & 0x0f) | (version === 'v3' ? 0x30 : 0x50)
  hash[8] = (hash[8] & 0x3f) | 0x80
  return bytesToUuid(hash)
}

export const isValidUuidNamespace = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())
