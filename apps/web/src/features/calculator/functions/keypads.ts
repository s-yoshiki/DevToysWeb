/**
 * Key layouts for both calculators. Labels carry the printed glyph while
 * `insert` carries the text appended to the expression, which the evaluator
 * normalises back (`×` → `*`, `√` → `sqrt(`).
 */
export type CalculatorKey = {
  label: string
  /** Appended to the expression. Omitted for keys that run an `action`. */
  insert?: string
  action?: 'clear' | 'backspace' | 'equals'
  tone?: 'digit' | 'operator' | 'control' | 'equals'
  span?: 2
}

const digit = (label: string): CalculatorKey => ({ label, insert: label, tone: 'digit' })
const operator = (label: string, insert = label): CalculatorKey => ({
  label,
  insert,
  tone: 'operator',
})

/** 4 columns; the equals key spans the final pair. */
export const basicKeys: CalculatorKey[] = [
  { label: 'C', action: 'clear', tone: 'control' },
  { label: '⌫', action: 'backspace', tone: 'control' },
  operator('(', '('),
  operator(')', ')'),
  digit('7'),
  digit('8'),
  digit('9'),
  operator('÷'),
  digit('4'),
  digit('5'),
  digit('6'),
  operator('×'),
  digit('1'),
  digit('2'),
  digit('3'),
  operator('−'),
  digit('0'),
  digit('.'),
  operator('%'),
  operator('+'),
  { label: '=', action: 'equals', tone: 'equals', span: 2 },
]

/** 5 columns of scientific functions, shown above the shared basic pad. */
export const scientificKeys: CalculatorKey[] = [
  operator('sin', 'sin('),
  operator('cos', 'cos('),
  operator('tan', 'tan('),
  operator('π', 'π'),
  operator('e', 'e'),
  operator('sin⁻¹', 'asin('),
  operator('cos⁻¹', 'acos('),
  operator('tan⁻¹', 'atan('),
  operator('xʸ', '^'),
  operator('x!', '!'),
  operator('ln', 'ln('),
  operator('log', 'log('),
  operator('√', '√('),
  operator('x²', '^2'),
  operator('x³', '^3'),
  operator('eˣ', 'exp('),
  operator('|x|', 'abs('),
  operator('mod', 'mod('),
  operator(',', ','),
  operator('1/x', '^-1'),
]
