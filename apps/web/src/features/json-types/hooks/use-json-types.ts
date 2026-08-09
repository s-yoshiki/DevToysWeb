'use client'

import { useMemo, useState } from 'react'
import { generateTypeDefinitions, type JsonTypeTarget } from '../functions/json-types'

const SAMPLE = JSON.stringify(
  {
    id: 1,
    name: 'DevToys',
    active: true,
    score: 4.5,
    tags: ['web', 'tools'],
    owner: { login: 's-yoshiki', url: 'https://example.com' },
    releases: [
      { version: '1.0.0', published_at: '2026-01-01T00:00:00Z' },
      { version: '1.1.0', published_at: null, draft: true },
    ],
  },
  null,
  2,
)

const DEFAULT_ROOT_NAME = 'Root'

export const useJsonTypes = () => {
  const [input, setInput] = useState('')
  const [target, setTarget] = useState<JsonTypeTarget>('typescript')
  const [rootName, setRootName] = useState(DEFAULT_ROOT_NAME)

  const result = useMemo(
    () => generateTypeDefinitions(input, target, rootName),
    [input, rootName, target],
  )

  const loadSample = () => setInput(SAMPLE)

  const clear = () => {
    setInput('')
    setTarget('typescript')
    setRootName(DEFAULT_ROOT_NAME)
  }

  return {
    input,
    setInput,
    target,
    setTarget,
    rootName,
    setRootName,
    output: result.output,
    error: result.error,
    loadSample,
    clear,
  }
}
