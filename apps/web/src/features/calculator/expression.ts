/**
 * Small arithmetic language shared by the two calculators. Parsing by hand keeps
 * the tools free of `eval`, of a parser dependency, and of the surprises that
 * come with feeding user text to either one.
 */

export type AngleMode = 'deg' | 'rad'

type Token =
  | { kind: 'number'; value: number }
  | { kind: 'name'; value: string }
  | { kind: 'symbol'; value: string }

const constants: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
  phi: (1 + Math.sqrt(5)) / 2,
}

/** Aliases for the glyphs the keypads print, so display text stays parseable. */
const replacements: [RegExp, string][] = [
  [/[×✕⋅·]/g, '*'],
  [/[÷∕]/g, '/'],
  [/[−–—]/g, '-'],
  [/π/g, 'pi'],
  [/√/g, 'sqrt'],
  [/\*\*/g, '^'],
  [/,/g, ','],
]

export const normalizeExpression = (input: string) =>
  replacements.reduce((value, [pattern, to]) => value.replace(pattern, to), input)

const isDigit = (char: string) => char >= '0' && char <= '9'
const isNameStart = (char: string) => /[A-Za-z]/.test(char)
const isNameChar = (char: string) => /[A-Za-z0-9]/.test(char)

const tokenize = (input: string): Token[] => {
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const char = input[index]
    if (char === ' ' || char === '\t' || char === '\n' || char === '_') {
      index += 1
      continue
    }

    if (isDigit(char) || (char === '.' && isDigit(input[index + 1] ?? ''))) {
      const start = index
      while (isDigit(input[index] ?? '')) index += 1
      if (input[index] === '.') {
        index += 1
        while (isDigit(input[index] ?? '')) index += 1
      }
      if (input[index] === 'e' || input[index] === 'E') {
        const exponent = index + (input[index + 1] === '+' || input[index + 1] === '-' ? 2 : 1)
        // Only consume the `e` when real digits follow; otherwise it is Euler's number.
        if (isDigit(input[exponent] ?? '')) {
          index = exponent
          while (isDigit(input[index] ?? '')) index += 1
        }
      }
      tokens.push({ kind: 'number', value: Number(input.slice(start, index)) })
      continue
    }

    if (isNameStart(char)) {
      const start = index
      while (isNameChar(input[index] ?? '')) index += 1
      tokens.push({ kind: 'name', value: input.slice(start, index).toLowerCase() })
      continue
    }

    if ('+-*/%^()!,'.includes(char)) {
      tokens.push({ kind: 'symbol', value: char })
      index += 1
      continue
    }

    throw new Error(`Unexpected character "${char}"`)
  }

  return tokens
}

const factorial = (value: number) => {
  if (!Number.isInteger(value) || value < 0)
    throw new Error('Factorial expects a non-negative integer')
  if (value > 170) throw new Error('Factorial is only defined up to 170 here')
  let result = 1
  for (let step = 2; step <= value; step += 1) result *= step
  return result
}

const toRadians = (value: number, mode: AngleMode) =>
  mode === 'deg' ? (value * Math.PI) / 180 : value
const fromRadians = (value: number, mode: AngleMode) =>
  mode === 'deg' ? (value * 180) / Math.PI : value

const logBase = (value: number, base: number) => Math.log(value) / Math.log(base)

type FunctionSpec = {
  arity: number | 'variadic'
  apply: (args: number[], mode: AngleMode) => number
}

const unary = (apply: (value: number, mode: AngleMode) => number): FunctionSpec => ({
  arity: 1,
  apply: (args, mode) => apply(args[0], mode),
})

const functions: Record<string, FunctionSpec> = {
  sin: unary((value, mode) => Math.sin(toRadians(value, mode))),
  cos: unary((value, mode) => Math.cos(toRadians(value, mode))),
  tan: unary((value, mode) => Math.tan(toRadians(value, mode))),
  asin: unary((value, mode) => fromRadians(Math.asin(value), mode)),
  acos: unary((value, mode) => fromRadians(Math.acos(value), mode)),
  atan: unary((value, mode) => fromRadians(Math.atan(value), mode)),
  sinh: unary(Math.sinh),
  cosh: unary(Math.cosh),
  tanh: unary(Math.tanh),
  ln: unary(Math.log),
  log: unary(Math.log10),
  log2: unary(Math.log2),
  log10: unary(Math.log10),
  exp: unary(Math.exp),
  sqrt: unary(Math.sqrt),
  cbrt: unary(Math.cbrt),
  abs: unary(Math.abs),
  sign: unary(Math.sign),
  round: unary(Math.round),
  floor: unary(Math.floor),
  ceil: unary(Math.ceil),
  trunc: unary(Math.trunc),
  fact: unary(factorial),
  rad: unary((value) => (value * Math.PI) / 180),
  deg: unary((value) => (value * 180) / Math.PI),
  logb: { arity: 2, apply: ([value, base]) => logBase(value, base) },
  pow: { arity: 2, apply: ([base, exponent]) => base ** exponent },
  mod: { arity: 2, apply: ([left, right]) => left % right },
  min: { arity: 'variadic', apply: (args) => Math.min(...args) },
  max: { arity: 'variadic', apply: (args) => Math.max(...args) },
}

export const functionNames = Object.keys(functions).sort()
export const constantNames = Object.keys(constants).sort()

/**
 * Recursive descent over the token list. Grammar, loosest binding first:
 * sum → product → power (right associative) → unary → postfix → primary.
 */
const parse = (tokens: Token[], angleMode: AngleMode) => {
  let position = 0

  const peek = () => tokens[position]
  const symbolAhead = (...values: string[]) => {
    const token = peek()
    return token?.kind === 'symbol' && values.includes(token.value)
  }
  const expect = (value: string) => {
    if (!symbolAhead(value)) throw new Error(`Expected "${value}"`)
    position += 1
  }

  /** A primary can follow a value directly, which reads as multiplication. */
  const startsPrimary = () => {
    const token = peek()
    if (!token) return false
    if (token.kind === 'number' || token.kind === 'name') return true
    return token.kind === 'symbol' && token.value === '('
  }

  const parsePrimary = (): number => {
    const token = peek()
    if (!token) throw new Error('Unexpected end of expression')

    if (token.kind === 'number') {
      position += 1
      return token.value
    }

    if (token.kind === 'name') {
      position += 1
      const spec = functions[token.value]
      if (spec) {
        expect('(')
        const args: number[] = []
        if (!symbolAhead(')')) {
          args.push(parseSum())
          while (symbolAhead(',')) {
            position += 1
            args.push(parseSum())
          }
        }
        expect(')')
        if (spec.arity === 'variadic') {
          if (!args.length) throw new Error(`${token.value}() needs at least one argument`)
        } else if (args.length !== spec.arity) {
          throw new Error(`${token.value}() takes ${spec.arity} argument(s), got ${args.length}`)
        }
        return spec.apply(args, angleMode)
      }
      const constant = constants[token.value]
      if (constant !== undefined) return constant
      throw new Error(`Unknown name "${token.value}"`)
    }

    if (token.value === '(') {
      position += 1
      const value = parseSum()
      expect(')')
      return value
    }

    throw new Error(`Unexpected token "${token.value}"`)
  }

  const parsePostfix = (): number => {
    let value = parsePrimary()
    while (symbolAhead('!')) {
      position += 1
      value = factorial(value)
    }
    return value
  }

  // Sign binds looser than `^`, so `-2^2` is -(2^2) as in ordinary notation.
  const parseUnary = (): number => {
    if (symbolAhead('-')) {
      position += 1
      return -parseUnary()
    }
    if (symbolAhead('+')) {
      position += 1
      return parseUnary()
    }
    return parsePower()
  }

  // Right associative, so `2^3^2` is 2^(3^2) and `2^-3` reads as expected.
  const parsePower = (): number => {
    const base = parsePostfix()
    if (!symbolAhead('^')) return base
    position += 1
    return base ** parseUnary()
  }

  const parseProduct = (): number => {
    let value = parseUnary()
    for (;;) {
      if (symbolAhead('*', '/', '%')) {
        const operator = (peek() as { value: string }).value
        position += 1
        const right = parseUnary()
        if (operator === '*') value *= right
        else if (operator === '/') value /= right
        else value %= right
        continue
      }
      // Implicit multiplication: `2pi`, `3(4+1)`, `2sqrt(9)`.
      if (startsPrimary()) {
        value *= parseUnary()
        continue
      }
      return value
    }
  }

  const parseSum = (): number => {
    let value = parseProduct()
    while (symbolAhead('+', '-')) {
      const operator = (peek() as { value: string }).value
      position += 1
      const right = parseProduct()
      value = operator === '+' ? value + right : value - right
    }
    return value
  }

  const result = parseSum()
  if (position < tokens.length) throw new Error('Unexpected trailing input')
  return result
}

/** Evaluates an arithmetic expression, throwing a readable error when it cannot. */
export const evaluateExpression = (input: string, angleMode: AngleMode = 'rad') => {
  const tokens = tokenize(normalizeExpression(input))
  if (!tokens.length) throw new Error('Enter an expression')
  const result = parse(tokens, angleMode)
  if (Number.isNaN(result)) throw new Error('The result is not a number')
  if (!Number.isFinite(result)) throw new Error('The result is not finite')
  return result
}

/**
 * Trims binary floating point noise (`0.1 + 0.2`) without rewriting values that
 * genuinely need their digits. Integers print in full; everything else falls
 * back to the shortest representation of its 12 significant digits.
 */
export const formatResult = (value: number) => {
  if (Number.isInteger(value) && Math.abs(value) < 1e21) return String(value)
  return String(Number(value.toPrecision(12)))
}
