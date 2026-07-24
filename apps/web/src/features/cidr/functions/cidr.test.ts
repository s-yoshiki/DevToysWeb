import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { cidrContains, computeCidr, parseCidr, splitCidr } from './cidr'

const parse = (value: string) => {
  const parsed = parseCidr(value)
  if (!parsed) throw new Error(`expected a parseable CIDR: ${value}`)
  return parsed
}

describe('parseCidr', () => {
  it('parses IPv4 with a prefix', () => {
    const parsed = parseCidr('192.168.10.0/24')
    assert.equal(parsed?.version, 4)
    assert.equal(parsed?.prefix, 24)
  })

  it('defaults the prefix to the full width', () => {
    assert.equal(parseCidr('10.0.0.1')?.prefix, 32)
    assert.equal(parseCidr('2001:db8::1')?.prefix, 128)
  })

  it('rejects invalid input', () => {
    assert.equal(parseCidr('999.1.1.1/24'), null)
    assert.equal(parseCidr('nonsense'), null)
    assert.equal(parseCidr('10.0.0.0/33'), null)
  })
})

describe('computeCidr (IPv4)', () => {
  const result = computeCidr(parse('192.168.10.0/24'))

  it('derives the network range', () => {
    assert.equal(result.netmask, '255.255.255.0')
    assert.equal(result.wildcard, '0.0.0.255')
    assert.equal(result.broadcast, '192.168.10.255')
    assert.equal(result.firstHost, '192.168.10.1')
    assert.equal(result.lastHost, '192.168.10.254')
    assert.equal(result.usableHosts, '254')
    assert.equal(result.addressType, 'Private (RFC 1918)')
  })

  it('handles /31 point-to-point links with no usable hosts', () => {
    const p2p = computeCidr(parse('192.168.1.0/31'))
    assert.equal(p2p.usableHosts, '0')
    assert.equal(p2p.firstHost, '192.168.1.0')
    assert.equal(p2p.lastHost, '192.168.1.1')
  })
})

describe('computeCidr (IPv6)', () => {
  const result = computeCidr(parse('2001:db8:abcd:12::/64'))

  it('compresses the network address and counts the block', () => {
    assert.equal(result.network, '2001:db8:abcd:12::')
    assert.equal(result.addressType, 'Documentation (2001:db8::/32)')
    assert.equal(result.totalAddresses, '18,446,744,073,709,551,616')
  })
})

describe('cidrContains', () => {
  const parsed = parse('192.168.10.0/24')

  it('detects membership', () => {
    assert.equal(cidrContains(parsed, '192.168.10.42'), true)
    assert.equal(cidrContains(parsed, '192.168.11.1'), false)
  })

  it('reports version mismatches as null', () => {
    assert.equal(cidrContains(parsed, '2001:db8::1'), null)
  })
})

describe('splitCidr', () => {
  it('splits a /24 into four /26 subnets', () => {
    const rows = splitCidr(parse('192.168.10.0/24'), 26)
    assert.equal(rows?.length, 4)
    assert.equal(rows?.[0].cidr, '192.168.10.0/26')
    assert.equal(rows?.[3].cidr, '192.168.10.192/26')
  })

  it('rejects a prefix smaller than the current one', () => {
    assert.equal(splitCidr(parse('192.168.10.0/24'), 20), null)
  })
})
