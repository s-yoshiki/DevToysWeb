'use client'

import { useMemo, useState } from 'react'
import { describeSubnet } from '@/features/subnet/functions/subnet'

export const useSubnet = () => {
  const [input, setInput] = useState('192.168.10.42/24')

  const result = useMemo(() => {
    try {
      return { value: JSON.stringify(describeSubnet(input), null, 2), error: false }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid CIDR', error: true }
    }
  }, [input])

  return { input, setInput, ...result, clear: () => setInput('') }
}
