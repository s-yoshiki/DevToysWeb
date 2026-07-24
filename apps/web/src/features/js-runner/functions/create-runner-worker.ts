/**
 * The function below is serialized with `toString()` and run inside a Web
 * Worker, so it must stay fully self-contained: it may only reference worker
 * globals (`self`, `JSON`, `Function`, `Date`) and its own locals — never any
 * module-scope binding, which would not exist in the worker. SWC strips the
 * type annotations before `toString()` runs, so the serialized body is plain JS.
 *
 * It shims the small slice of Node the AtCoder-style templates rely on:
 * `require('fs').readFileSync('/dev/stdin')`, `process.stdout.write`, and a
 * convenience `input()` line reader. Execution is synchronous — output produced
 * after an `await`/`setTimeout` is not captured.
 */
const runnerMain = () => {
  self.onmessage = (event: MessageEvent) => {
    const { code, stdin } = event.data as { code: string; stdin: string }
    const out: string[] = []
    const err: string[] = []

    const format = (args: unknown[]) =>
      args
        .map((arg) => {
          if (typeof arg === 'string') return arg
          if (arg instanceof Error) return arg.stack ?? String(arg)
          try {
            return JSON.stringify(arg)
          } catch {
            return String(arg)
          }
        })
        .join(' ')

    const con = {
      log: (...args: unknown[]) => out.push(`${format(args)}\n`),
      info: (...args: unknown[]) => out.push(`${format(args)}\n`),
      debug: (...args: unknown[]) => out.push(`${format(args)}\n`),
      table: (...args: unknown[]) => out.push(`${format(args)}\n`),
      warn: (...args: unknown[]) => err.push(`${format(args)}\n`),
      error: (...args: unknown[]) => err.push(`${format(args)}\n`),
    }

    const fs = {
      readFileSync: (path: unknown) =>
        path === 0 || path === '0' || path === '/dev/stdin' || path === '/dev/fd/0' ? stdin : '',
      writeFileSync: () => undefined,
    }

    const proc = {
      stdout: {
        write: (chunk: unknown) => {
          out.push(String(chunk))
          return true
        },
      },
      stderr: {
        write: (chunk: unknown) => {
          err.push(String(chunk))
          return true
        },
      },
      argv: ['node', 'main.js'],
      env: {},
      platform: 'browser',
      exit: () => undefined,
    }

    const req = (name: string) => {
      if (name === 'fs') return fs
      if (name === 'node:fs') return fs
      throw new Error(`Cannot require module '${name}' in this sandbox`)
    }

    const lines = stdin.length ? stdin.replace(/\n$/, '').split('\n') : []
    let cursor = 0
    const input = () => lines[cursor++]

    const start = Date.now()
    try {
      const moduleObj = { exports: {} }
      const run = new Function(
        'require',
        'process',
        'console',
        'fs',
        'input',
        'exports',
        'module',
        code,
      )
      run(req, proc, con, fs, input, moduleObj.exports, moduleObj)
      self.postMessage({
        ok: true,
        stdout: out.join(''),
        stderr: err.join(''),
        ms: Date.now() - start,
      })
    } catch (error) {
      const message = error instanceof Error ? (error.stack ?? error.message) : String(error)
      self.postMessage({
        ok: false,
        stdout: out.join(''),
        stderr: err.join('') + message,
        ms: Date.now() - start,
      })
    }
  }
}

/** Builds an object-URL for a fresh sandbox worker. Revoke it after the worker starts. */
export const createRunnerWorkerUrl = () => {
  const source = `(${runnerMain.toString()})()`
  const blob = new Blob([source], { type: 'application/javascript' })
  return URL.createObjectURL(blob)
}
