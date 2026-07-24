export type SubnetSummary = {
  address: string
  prefix: number
  subnetMask: string
  wildcardMask: string
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  totalAddresses: number
  usableHosts: number
  addressClass: string
  maskBinary: string
}

const toBinary = (value: number) =>
  [24, 16, 8, 0].map((shift) => ((value >>> shift) & 255).toString(2).padStart(8, '0')).join('.')

const classOf = (firstOctet: number) => {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D (multicast)'
  return 'E (reserved)'
}

const ipToNumber = (ip: string) => {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255))
    throw new Error('Invalid IPv4 address')
  return parts.reduce((value, part) => (value * 256 + part) >>> 0, 0)
}

const numberToIp = (value: number) =>
  [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.')

/** Derives every address of an IPv4 CIDR block, e.g. `192.168.10.42/24`. */
export const describeSubnet = (cidr: string): SubnetSummary => {
  const [ip, prefixText] = cidr.split('/')
  const prefix = Number(prefixText)
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32)
    throw new Error('CIDR prefix must be between 0 and 32')
  const address = ipToNumber(ip)
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (address & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const first = prefix >= 31 ? network : network + 1
  const last = prefix >= 31 ? broadcast : broadcast - 1
  return {
    address: ip,
    prefix,
    subnetMask: numberToIp(mask),
    wildcardMask: numberToIp(~mask >>> 0),
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    firstHost: numberToIp(first),
    lastHost: numberToIp(last),
    totalAddresses: 2 ** (32 - prefix),
    usableHosts: prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, 2 ** (32 - prefix) - 2),
    addressClass: classOf((address >>> 24) & 255),
    maskBinary: toBinary(mask),
  }
}
