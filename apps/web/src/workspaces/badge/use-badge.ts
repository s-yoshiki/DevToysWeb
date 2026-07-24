'use client'

import { useMemo, useState } from 'react'
import {
  type BadgeOptions,
  type BadgePreset,
  type BadgeProvider,
  type BadgeStyle,
  badgePresets,
  buildBadgeOutputs,
} from './badge'

const initialOptions: BadgeOptions = {
  provider: 'shields',
  label: 'build',
  message: 'passing',
  color: '22c55e',
  labelColor: '555555',
  logo: 'github',
  logoColor: 'white',
  style: 'flat',
  link: '',
}

export const useBadge = () => {
  const [options, setOptions] = useState(initialOptions)
  const output = useMemo(() => buildBadgeOutputs(options), [options])

  const set = <Key extends keyof BadgeOptions>(key: Key, value: BadgeOptions[Key]) =>
    setOptions((current) => ({ ...current, [key]: value }))

  const applyPreset = (preset: BadgePreset) =>
    setOptions((current) => ({
      ...current,
      label: preset.name,
      message: '',
      color: preset.color,
      logo: preset.logo,
      logoColor: preset.logoColor,
    }))

  return {
    options,
    output,
    presets: badgePresets,
    set,
    setProvider: (provider: BadgeProvider) => set('provider', provider),
    setStyle: (style: BadgeStyle) => set('style', style),
    applyPreset,
    clear: () => setOptions(initialOptions),
  }
}
