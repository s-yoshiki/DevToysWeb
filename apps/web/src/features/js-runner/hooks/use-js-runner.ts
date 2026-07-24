'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createRunnerWorkerUrl } from '../functions/create-runner-worker'
import { transpileTypeScript } from '../functions/transpile'

export type RunnerLanguage = 'javascript' | 'typescript'

const sampleCode = `// 標準入力の1行目 "a b" を読み取り、a + b を出力します
const data = require('fs').readFileSync('/dev/stdin', 'utf8')
const [a, b] = data.trim().split(' ').map(Number)
console.log(a + b)
`

export type RunResult = {
  ok: boolean
  stdout: string
  stderr: string
  ms: number
}

const TIMEOUT_MS = 5000

export const useJsRunner = () => {
  const [language, setLanguage] = useState<RunnerLanguage>('javascript')
  const [code, setCode] = useState(sampleCode)
  const [stdin, setStdin] = useState('2 3')
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const teardown = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    workerRef.current?.terminate()
    workerRef.current = null
  }, [])

  const stop = useCallback(() => {
    if (!workerRef.current) return
    teardown()
    setRunning(false)
    setResult({
      ok: false,
      stdout: '',
      stderr: 'Execution stopped.',
      ms: 0,
    })
  }, [teardown])

  const run = useCallback(async () => {
    teardown()
    setRunning(true)
    setResult(null)

    let source = code
    if (language === 'typescript') {
      try {
        source = await transpileTypeScript(code)
      } catch (error) {
        setRunning(false)
        setResult({
          ok: false,
          stdout: '',
          stderr: error instanceof Error ? error.message : String(error),
          ms: 0,
        })
        return
      }
    }

    const url = createRunnerWorkerUrl()
    const worker = new Worker(url)
    workerRef.current = worker
    URL.revokeObjectURL(url)

    worker.onmessage = (event: MessageEvent<RunResult>) => {
      teardown()
      setRunning(false)
      setResult(event.data)
    }
    worker.onerror = (event) => {
      teardown()
      setRunning(false)
      setResult({ ok: false, stdout: '', stderr: event.message || 'Worker error', ms: 0 })
    }

    timerRef.current = setTimeout(() => {
      teardown()
      setRunning(false)
      setResult({
        ok: false,
        stdout: '',
        stderr: `Timed out after ${TIMEOUT_MS / 1000}s (possible infinite loop).`,
        ms: TIMEOUT_MS,
      })
    }, TIMEOUT_MS)

    worker.postMessage({ code: source, stdin })
  }, [code, language, stdin, teardown])

  useEffect(() => teardown, [teardown])

  const clear = useCallback(() => {
    teardown()
    setRunning(false)
    setCode(sampleCode)
    setStdin('2 3')
    setResult(null)
  }, [teardown])

  return {
    language,
    setLanguage,
    code,
    setCode,
    stdin,
    setStdin,
    result,
    running,
    run,
    stop,
    clear,
    timeoutSeconds: TIMEOUT_MS / 1000,
  }
}
