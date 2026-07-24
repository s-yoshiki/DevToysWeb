'use client'

import { useMemo, useState } from 'react'
import { describeSubnet, type SubnetSummary } from '@/features/subnet/functions/subnet'

export const useSubnet = () => {
  const [input, setInput] = useState('192.168.10.42/24')

  const result = useMemo<{ summary: SubnetSummary | null; error: string }>(() => {
    if (!input.trim()) return { summary: null, error: '' }
    try {
      return { summary: describeSubnet(input), error: '' }
    } catch (reason) {
      return { summary: null, error: reason instanceof Error ? reason.message : 'Invalid CIDR' }
    }
  }, [input])

  return { input, setInput, ...result, clear: () => setInput('') }
}
