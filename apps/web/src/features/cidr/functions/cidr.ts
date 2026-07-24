export type IpVersion = 4 | 6

export type ParsedCidr = {
  version: IpVersion
  address: bigint
  prefix: number
  bits: number
}

export type CidrResult = {
  version: IpVersion
  prefix: number
  network: string
  networkCidr: string
  netmask: string
  wildcard: string
  broadcast: string | null
  firstHost: string
  lastHost: string
  totalAddresses: string
  usableHosts: string
  addressType: string
}

const V4_BITS = 32
const V6_BITS = 128

const maskFor = (prefix: number, bits: number): bigint => {
  if (prefix <= 0) return 0n
  const full = (1n << BigInt(bits)) - 1n
  return (full << BigInt(bits - prefix)) & full
}

// ---- IPv4 ----

const parseIpv4 = (value: string): bigint | null => {
  const parts = value.split('.')
  if (parts.length !== 4) return null
  let result = 0n
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null
    const n = Number(part)
    if (n > 255) return null
    result = (result << 8n) | BigInt(n)
  }
  return result
}

const formatIpv4 = (value: bigint): string => {
  const octets: number[] = []
  for (let i = 3; i >= 0; i--) octets.push(Number((value >> BigInt(i * 8)) & 0xffn))
  return octets.join('.')
}

// ---- IPv6 ----

const parseIpv6 = (value: string): bigint | null => {
  if (value.indexOf(':') === -1) return null
  const halves = value.split('::')
  if (halves.length > 2) return null

  const toGroups = (segment: string): string[] | null => {
    if (segment === '') return []
    const groups = segment.split(':')
    return groups.some((g) => !/^[0-9a-fA-F]{1,4}$/.test(g)) ? null : groups
  }

  const head = toGroups(halves[0])
  const tail = halves.length === 2 ? toGroups(halves[1]) : []
  if (head === null || tail === null) return null

  let groups: string[]
  if (halves.length === 2) {
    const missing = 8 - head.length - tail.length
    if (missing < 1) return null
    groups = [...head, ...Array(missing).fill('0'), ...tail]
  } else {
    groups = head
  }
  if (groups.length !== 8) return null

  let result = 0n
  for (const group of groups) result = (result << 16n) | BigInt(parseInt(group, 16))
  return result
}

const formatIpv6 = (value: bigint): string => {
  const groups: number[] = []
  for (let i = 7; i >= 0; i--) groups.push(Number((value >> BigInt(i * 16)) & 0xffffn))

  // Compress the longest run of zero groups into "::".
  let bestStart = -1
  let bestLen = 0
  let runStart = -1
  let runLen = 0
  for (let i = 0; i < 8; i++) {
    if (groups[i] === 0) {
      if (runStart === -1) runStart = i
      runLen++
      if (runLen > bestLen) {
        bestLen = runLen
        bestStart = runStart
      }
    } else {
      runStart = -1
      runLen = 0
    }
  }

  const hex = groups.map((g) => g.toString(16))
  if (bestLen < 2) return hex.join(':')
  const before = hex.slice(0, bestStart).join(':')
  const after = hex.slice(bestStart + bestLen).join(':')
  return `${before}::${after}`
}

// ---- Public API ----

export const parseCidr = (input: string): ParsedCidr | null => {
  const trimmed = input.trim()
  if (!trimmed) return null
  const [addressPart, prefixPart] = trimmed.split('/')

  const v4 = parseIpv4(addressPart)
  if (v4 !== null) {
    const prefix = prefixPart === undefined ? V4_BITS : Number(prefixPart)
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > V4_BITS) return null
    return { version: 4, address: v4, prefix, bits: V4_BITS }
  }

  const v6 = parseIpv6(addressPart)
  if (v6 !== null) {
    const prefix = prefixPart === undefined ? V6_BITS : Number(prefixPart)
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > V6_BITS) return null
    return { version: 6, address: v6, prefix, bits: V6_BITS }
  }
  return null
}

const ipv4Type = (network: bigint): string => {
  const s = formatIpv4(network)
  const first = Number((network >> 24n) & 0xffn)
  const second = Number((network >> 16n) & 0xffn)
  if (first === 10) return 'Private (RFC 1918)'
  if (first === 172 && second >= 16 && second <= 31) return 'Private (RFC 1918)'
  if (first === 192 && second === 168) return 'Private (RFC 1918)'
  if (first === 127) return 'Loopback'
  if (first === 169 && second === 254) return 'Link-local'
  if (first >= 224 && first <= 239) return 'Multicast'
  if (s === '0.0.0.0') return 'Unspecified'
  return 'Public'
}

const ipv6Type = (network: bigint): string => {
  const top16 = (network >> 112n) & 0xffffn
  if (network === 0n) return 'Unspecified'
  if (network === 1n) return 'Loopback'
  if ((top16 & 0xfe00n) === 0xfc00n) return 'Unique local (fc00::/7)'
  if ((top16 & 0xffc0n) === 0xfe80n) return 'Link-local (fe80::/10)'
  if ((top16 & 0xff00n) === 0xff00n) return 'Multicast (ff00::/8)'
  if (top16 === 0x2001n && ((network >> 96n) & 0xffffn) === 0x0db8n)
    return 'Documentation (2001:db8::/32)'
  return 'Global unicast'
}

export const computeCidr = (parsed: ParsedCidr): CidrResult => {
  const { version, address, prefix, bits } = parsed
  const mask = maskFor(prefix, bits)
  const network = address & mask
  const wildcard = ~mask & ((1n << BigInt(bits)) - 1n)
  const last = network | wildcard
  const total = 1n << BigInt(bits - prefix)
  const format = version === 4 ? formatIpv4 : formatIpv6

  if (version === 4) {
    const hasHosts = prefix <= 30
    const usable = prefix >= 31 ? 0n : total - 2n
    return {
      version,
      prefix,
      network: format(network),
      networkCidr: `${format(network)}/${prefix}`,
      netmask: formatIpv4(mask),
      wildcard: formatIpv4(wildcard),
      broadcast: format(last),
      firstHost: hasHosts ? format(network + 1n) : format(network),
      lastHost: hasHosts ? format(last - 1n) : format(last),
      totalAddresses: total.toLocaleString('en-US'),
      usableHosts: usable.toLocaleString('en-US'),
      addressType: ipv4Type(network),
    }
  }

  return {
    version,
    prefix,
    network: format(network),
    networkCidr: `${format(network)}/${prefix}`,
    netmask: formatIpv6(mask),
    wildcard: formatIpv6(wildcard),
    broadcast: null,
    firstHost: format(network),
    lastHost: format(last),
    totalAddresses: total.toLocaleString('en-US'),
    usableHosts: total.toLocaleString('en-US'),
    addressType: ipv6Type(network),
  }
}

/** True when `probe` falls inside the network described by `parsed`. */
export const cidrContains = (parsed: ParsedCidr, probe: string): boolean | null => {
  const target = parseCidr(probe)
  if (!target || target.version !== parsed.version) return null
  const mask = maskFor(parsed.prefix, parsed.bits)
  return (parsed.address & mask) === (target.address & mask)
}

/** Split a network into equal subnets at `newPrefix`, capped to `limit` rows. */
export const splitCidr = (
  parsed: ParsedCidr,
  newPrefix: number,
  limit = 256,
): { cidr: string; range: string }[] | null => {
  if (newPrefix < parsed.prefix || newPrefix > parsed.bits) return null
  const format = parsed.version === 4 ? formatIpv4 : formatIpv6
  const mask = maskFor(parsed.prefix, parsed.bits)
  const network = parsed.address & mask
  const step = 1n << BigInt(parsed.bits - newPrefix)
  const count = 1n << BigInt(newPrefix - parsed.prefix)
  const rows: { cidr: string; range: string }[] = []
  const shown = count > BigInt(limit) ? BigInt(limit) : count
  for (let i = 0n; i < shown; i++) {
    const start = network + i * step
    const end = start + step - 1n
    rows.push({ cidr: `${format(start)}/${newPrefix}`, range: `${format(start)} – ${format(end)}` })
  }
  return rows
}
