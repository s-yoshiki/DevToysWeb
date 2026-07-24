'use client'

import { useMemo, useState } from 'react'
import { cidrContains, computeCidr, parseCidr, splitCidr } from '../functions/cidr'

export const useCidr = () => {
  const [input, setInput] = useState('192.168.10.0/24')
  const [probe, setProbe] = useState('192.168.10.42')
  const [splitPrefix, setSplitPrefix] = useState(26)

  const parsed = useMemo(() => parseCidr(input), [input])
  const result = useMemo(() => (parsed ? computeCidr(parsed) : null), [parsed])
  const contains = useMemo(
    () => (parsed && probe.trim() ? cidrContains(parsed, probe) : null),
    [parsed, probe],
  )
  const split = useMemo(
    () => (parsed ? splitCidr(parsed, splitPrefix) : null),
    [parsed, splitPrefix],
  )

  const clear = () => {
    setInput('')
    setProbe('')
    setSplitPrefix(26)
  }

  return {
    input,
    setInput,
    parsed,
    result,
    probe,
    setProbe,
    contains,
    splitPrefix,
    setSplitPrefix,
    split,
    clear,
  }
}
