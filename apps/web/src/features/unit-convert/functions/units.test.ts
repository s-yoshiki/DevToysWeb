import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  convertUnit,
  findFamily,
  findUnit,
  formatUnitValue,
  type UnitFamilyId,
  unitFamilies,
} from './units'

const convert = (family: UnitFamilyId, from: string, to: string, value: number) => {
  const group = findFamily(family)
  return convertUnit(value, findUnit(group, from), findUnit(group, to))
}

describe('unit families', () => {
  it('gives every unit a stable id within its family', () => {
    for (const family of unitFamilies) {
      const ids = family.units.map((unit) => unit.id)
      assert.equal(new Set(ids).size, ids.length, `duplicate unit id in ${family.id}`)
      assert.ok(ids.includes(family.defaultUnit), `${family.id} default unit is missing`)
    }
  })

  it('round-trips every unit through its base', () => {
    for (const family of unitFamilies) {
      for (const unit of family.units) {
        assert.ok(
          Math.abs(unit.fromBase(unit.toBase(7)) - 7) < 1e-9,
          `${family.id}/${unit.id} does not round-trip`,
        )
      }
    }
  })
})

describe('convertUnit', () => {
  it('converts length across measurement systems', () => {
    assert.ok(Math.abs(convert('length', 'km', 'mi', 1) - 0.621371192) < 1e-6)
    assert.ok(Math.abs(convert('length', 'in', 'cm', 1) - 2.54) < 1e-9)
  })

  it('applies the temperature offsets', () => {
    assert.ok(Math.abs(convert('temperature', 'c', 'f', 100) - 212) < 1e-9)
    assert.ok(Math.abs(convert('temperature', 'f', 'c', 32)) < 1e-9)
    assert.ok(Math.abs(convert('temperature', 'k', 'c', 273.15)) < 1e-9)
  })

  it('keeps decimal and binary data units apart', () => {
    assert.equal(convert('data', 'gib', 'mib', 1), 1024)
    assert.equal(convert('data', 'gb', 'mb', 1), 1000)
    assert.equal(convert('data', 'byte', 'bit', 1), 8)
  })

  it('converts area including the Japanese units', () => {
    assert.equal(convert('area', 'ha', 'm2', 1), 10_000)
    assert.ok(Math.abs(convert('area', 'tsubo', 'm2', 1) - 3.305785) < 1e-5)
  })

  it('converts speed and angle', () => {
    assert.ok(Math.abs(convert('speed', 'kmh', 'ms', 36) - 10) < 1e-9)
    assert.ok(Math.abs(convert('angle', 'rad', 'deg', Math.PI) - 180) < 1e-9)
  })
})

describe('formatUnitValue', () => {
  it('trims trailing zeros', () => {
    assert.equal(formatUnitValue(2.5), '2.5')
    assert.equal(formatUnitValue(1000), '1000')
  })

  it('falls back to exponential notation at the extremes', () => {
    assert.match(formatUnitValue(1e18), /e\+18$/)
    assert.match(formatUnitValue(1e-9), /e-9$/)
  })

  it('handles zero and non-finite input', () => {
    assert.equal(formatUnitValue(0), '0')
    assert.equal(formatUnitValue(Number.NaN), '—')
  })
})
