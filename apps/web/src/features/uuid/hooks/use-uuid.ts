'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  generateUuids,
  isValidUuidNamespace,
  type NamedUuidVersion,
  type NamespacePreset,
  namedUuid,
  type UuidVersion,
  uuidNamespaces,
} from '../functions/uuid'

const formatCase = (values: string[], upper: boolean) =>
  values.map((value) => (upper ? value.toUpperCase() : value))

const stripHyphens = (values: string[], hyphens: boolean) =>
  hyphens ? values : values.map((value) => value.replace(/-/g, ''))

export const useUuid = () => {
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [raw, setRaw] = useState<string[]>(() => generateUuids('v4', 5))

  // Named (v3/v5) section — deterministic, so it lives on its own.
  const [namedVersion, setNamedVersion] = useState<NamedUuidVersion>('v5')
  const [preset, setPreset] = useState<NamespacePreset>('url')
  const [customNamespace, setCustomNamespace] = useState('')
  const [name, setName] = useState('https://example.com')

  const regenerate = useCallback(() => {
    setRaw(generateUuids(version, count))
  }, [version, count])

  const changeVersion = useCallback(
    (next: UuidVersion) => {
      setVersion(next)
      setRaw(generateUuids(next, count))
    },
    [count],
  )

  const changeCount = useCallback(
    (next: number) => {
      const clamped = Math.max(1, Math.min(Number.isFinite(next) ? next : 1, 1000))
      setCount(clamped)
      setRaw(generateUuids(version, clamped))
    },
    [version],
  )

  const isUlid = version === 'ulid'
  const list = useMemo(() => {
    const values = isUlid
      ? uppercase
        ? raw
        : raw.map((v) => v.toLowerCase())
      : stripHyphens(formatCase(raw, uppercase), hyphens)
    return values.map((value, index) => ({ key: `${index}-${value}`, value }))
  }, [raw, uppercase, hyphens, isUlid])

  const output = list.map((item) => item.value).join('\n')

  const namespace = preset === 'custom' ? customNamespace.trim() : uuidNamespaces[preset]
  const namedResult = useMemo(() => {
    if (!isValidUuidNamespace(namespace)) {
      return { value: '', error: 'namespace' as const }
    }
    try {
      const value = namedUuid(namedVersion, namespace, name)
      return { value: uppercase ? value.toUpperCase() : value, error: null }
    } catch {
      return { value: '', error: 'namespace' as const }
    }
  }, [namedVersion, namespace, name, uppercase])

  const clear = useCallback(() => {
    setVersion('v4')
    setCount(5)
    setUppercase(false)
    setHyphens(true)
    setRaw(generateUuids('v4', 5))
    setNamedVersion('v5')
    setPreset('url')
    setCustomNamespace('')
    setName('https://example.com')
  }, [])

  return {
    version,
    changeVersion,
    count,
    changeCount,
    uppercase,
    setUppercase,
    hyphens,
    setHyphens,
    isUlid,
    list,
    output,
    regenerate,
    namedVersion,
    setNamedVersion,
    preset,
    setPreset,
    customNamespace,
    setCustomNamespace,
    name,
    setName,
    namespace,
    namedResult,
    clear,
  }
}
