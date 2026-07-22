'use client'

import { Check, Clipboard } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { useCopy } from '../hooks/use-copy'

export const CopyButton = ({ value }: { value: string }) => {
  const { dictionary } = useLocale()
  const { copied, copy } = useCopy()
  return (
    <Button variant="ghost" size="sm" disabled={!value} onClick={() => void copy(value)}>
      {copied ? <Check className="size-4 text-success" /> : <Clipboard className="size-4" />}
      {copied ? dictionary.copied : dictionary.copy}
    </Button>
  )
}
