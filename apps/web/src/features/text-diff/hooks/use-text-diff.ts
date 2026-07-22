'use client'

import { diffWordsWithSpace } from 'diff'
import { useMemo, useState } from 'react'

export const useTextDiff = () => {
  const [before, setBefore] = useState('const version = 1\nconsole.log("DevToys")')
  const [after, setAfter] = useState('const version = 2\nconsole.log("DevToys Web")')

  const changes = useMemo(() => diffWordsWithSpace(before, after), [after, before])

  const clear = () => {
    setBefore('')
    setAfter('')
  }

  return {
    before,
    setBefore,
    after,
    setAfter,
    changes,
    additions: changes.filter((part) => part.added).length,
    deletions: changes.filter((part) => part.removed).length,
    clear,
  }
}
