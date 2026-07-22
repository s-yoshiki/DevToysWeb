'use client'

import { useMemo, useState } from 'react'
import {
  convertUnit,
  findFamily,
  findUnit,
  formatUnitValue,
  type UnitFamilyId,
} from '../functions/units'

/**
 * One value in, every unit of the family out — the comparison table is the whole
 * point of the tool, so there is no "target unit" to pick.
 */
export const useUnitConvert = () => {
  const [familyId, setFamilyId] = useState<UnitFamilyId>('length')
  const [unitId, setUnitId] = useState('m')
  const [input, setInput] = useState('1')

  const family = findFamily(familyId)
  const unit = findUnit(family, unitId)
  const amount = Number(input.replace(/[,\s]/g, ''))
  const valid = input.trim() !== '' && Number.isFinite(amount)

  const rows = useMemo(
    () =>
      family.units.map((target) => ({
        unit: target,
        value: valid ? convertUnit(amount, unit, target) : Number.NaN,
        text: valid ? formatUnitValue(convertUnit(amount, unit, target)) : '—',
        current: target.id === unit.id,
      })),
    [amount, family, unit, valid],
  )

  const selectFamily = (next: UnitFamilyId) => {
    setFamilyId(next)
    setUnitId(findFamily(next).defaultUnit)
  }

  const clear = () => {
    setInput('')
  }

  return {
    familyId,
    family,
    unit,
    input,
    setInput,
    setUnitId,
    selectFamily,
    valid,
    rows,
    clear,
  }
}
