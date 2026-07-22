'use client'

import { useMemo, useState } from 'react'
import { defaultGlobOptions, type GlobOptions, matchPaths } from '../../domain/glob'

const samplePaths = `src/index.ts
src/features/tools/catalog.ts
src/features/tools/catalog.test.ts
docs/readme.md
.github/workflows/deploy.yml
node_modules/react/index.js`

export const useGlob = () => {
  const [pattern, setPattern] = useState('src/**/*.ts')
  const [paths, setPaths] = useState(samplePaths)
  const [options, setOptions] = useState<GlobOptions>(defaultGlobOptions)

  const result = useMemo(() => {
    const candidates = paths
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (!pattern.trim()) return { matches: [], error: '' }
    try {
      return { matches: matchPaths(pattern, candidates, options), error: '' }
    } catch (reason) {
      return { matches: [], error: reason instanceof Error ? reason.message : 'Invalid pattern' }
    }
  }, [options, paths, pattern])

  const matched = result.matches.filter((entry) => entry.matched)

  return {
    pattern,
    setPattern,
    paths,
    setPaths,
    options,
    toggle: (patch: Partial<GlobOptions>) => setOptions((previous) => ({ ...previous, ...patch })),
    ...result,
    matched,
    matchedPaths: matched.map((entry) => entry.path).join('\n'),
    clear: () => setPattern(''),
  }
}
