export type JsonTypeTarget = 'typescript' | 'go' | 'python'

export const jsonTypeTargets: readonly JsonTypeTarget[] = ['typescript', 'go', 'python']

export type InferredNode =
  | { kind: 'unknown' }
  | { kind: 'null' }
  | { kind: 'boolean' }
  | { kind: 'integer' }
  | { kind: 'number' }
  | { kind: 'string' }
  | { kind: 'array'; element: InferredNode }
  | { kind: 'object'; fields: InferredField[] }
  | { kind: 'union'; members: InferredNode[] }

export type InferredField = { key: string; node: InferredNode; optional: boolean }

const primitive = (kind: 'null' | 'boolean' | 'integer' | 'number' | 'string'): InferredNode => ({
  kind,
})

/** Stable structural key used to dedupe union members and reuse type names. */
const signature = (node: InferredNode): string => {
  switch (node.kind) {
    case 'array':
      return `[${signature(node.element)}]`
    case 'object':
      return `{${node.fields
        .map((field) => `${field.key}${field.optional ? '?' : ''}:${signature(field.node)}`)
        .join(',')}}`
    case 'union':
      return node.members.map(signature).join('|')
    default:
      return node.kind
  }
}

const flatten = (node: InferredNode): InferredNode[] =>
  node.kind === 'union' ? node.members.flatMap(flatten) : [node]

const union = (nodes: InferredNode[]): InferredNode => {
  const seen = new Map<string, InferredNode>()
  for (const node of nodes.flatMap(flatten)) {
    if (node.kind === 'unknown') continue
    seen.set(signature(node), node)
  }
  const members = [...seen.values()]
  if (members.length === 0) return { kind: 'unknown' }
  if (members.length === 1) return members[0]
  return { kind: 'union', members }
}

/**
 * Widens two observations of the same position into one type. Array elements
 * and sibling object keys go through here, which is what turns a heterogeneous
 * sample array into a single shape with optional fields.
 */
export const mergeNodes = (left: InferredNode, right: InferredNode): InferredNode => {
  if (left.kind === 'unknown') return right
  if (right.kind === 'unknown') return left
  if (left.kind === 'integer' && right.kind === 'number') return right
  if (left.kind === 'number' && right.kind === 'integer') return left
  if (left.kind === 'array' && right.kind === 'array')
    return { kind: 'array', element: mergeNodes(left.element, right.element) }
  if (left.kind === 'object' && right.kind === 'object') {
    const keys = [...new Set([...left.fields, ...right.fields].map((field) => field.key))]
    const fields = keys.map((key) => {
      const a = left.fields.find((field) => field.key === key)
      const b = right.fields.find((field) => field.key === key)
      if (!a) return { key, node: (b as InferredField).node, optional: true }
      if (!b) return { key, node: a.node, optional: true }
      return { key, node: mergeNodes(a.node, b.node), optional: a.optional || b.optional }
    })
    return { kind: 'object', fields }
  }
  if (left.kind === right.kind) return left
  return union([left, right])
}

export const inferNode = (value: unknown): InferredNode => {
  if (value === null) return primitive('null')
  if (Array.isArray(value))
    return {
      kind: 'array',
      element: value.reduce<InferredNode>(
        (accumulator, item) => mergeNodes(accumulator, inferNode(item)),
        { kind: 'unknown' },
      ),
    }
  switch (typeof value) {
    case 'boolean':
      return primitive('boolean')
    case 'number':
      return Number.isInteger(value) ? primitive('integer') : primitive('number')
    case 'string':
      return primitive('string')
    case 'object':
      return {
        kind: 'object',
        fields: Object.entries(value as Record<string, unknown>).map(([key, item]) => ({
          key,
          node: inferNode(item),
          optional: false,
        })),
      }
    default:
      return { kind: 'unknown' }
  }
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/

const words = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)

const pascalCase = (value: string) =>
  words(value)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

/** Rough English singularisation, enough to name `users` -> `User`. */
const singular = (value: string) => {
  if (/(ch|sh|s|x|z)es$/i.test(value)) return value.slice(0, -2)
  if (/ies$/i.test(value)) return `${value.slice(0, -3)}y`
  if (/[^s]s$/i.test(value)) return value.slice(0, -1)
  return value
}

type Declaration = { name: string; node: Extract<InferredNode, { kind: 'object' }> }

/**
 * Assigns a type name to every object shape, reusing one name when two places
 * happen to share a structure so the output stays small.
 */
const collectDeclarations = (root: InferredNode, rootName: string) => {
  const declarations: Declaration[] = []
  const namesBySignature = new Map<string, string>()
  const used = new Set<string>()

  const claim = (hint: string) => {
    const base = pascalCase(hint) || 'Item'
    if (!used.has(base)) {
      used.add(base)
      return base
    }
    let suffix = 2
    while (used.has(`${base}${suffix}`)) suffix += 1
    used.add(`${base}${suffix}`)
    return `${base}${suffix}`
  }

  const visit = (node: InferredNode, hint: string): void => {
    if (node.kind === 'array') {
      visit(node.element, singular(hint))
      return
    }
    if (node.kind === 'union') {
      for (const member of node.members) visit(member, hint)
      return
    }
    if (node.kind !== 'object') return
    const key = signature(node)
    if (namesBySignature.has(key)) return
    const name = claim(hint)
    namesBySignature.set(key, name)
    for (const field of node.fields) visit(field.node, field.key)
    declarations.push({ name, node })
  }

  visit(root, rootName)
  return { declarations, nameFor: (node: InferredNode) => namesBySignature.get(signature(node)) }
}

type Emitter = {
  render: (
    declarations: Declaration[],
    nameFor: (node: InferredNode) => string | undefined,
    root: InferredNode,
    rootName: string,
  ) => string
}

const isNull = (node: InferredNode) => node.kind === 'null'

/** Splits a union into its nullability and the remaining members. */
const splitNullable = (node: InferredNode) => {
  const members = flatten(node)
  const nullable = members.some(isNull)
  const rest = members.filter((member) => !isNull(member))
  return { nullable, rest: rest.length === 0 ? [{ kind: 'unknown' } as InferredNode] : rest }
}

const typescript: Emitter = {
  render: (declarations, nameFor, root, rootName) => {
    const typeOf = (node: InferredNode): string => {
      switch (node.kind) {
        case 'string':
          return 'string'
        case 'integer':
        case 'number':
          return 'number'
        case 'boolean':
          return 'boolean'
        case 'null':
          return 'null'
        case 'unknown':
          return 'unknown'
        case 'array':
          return `${wrap(node.element)}[]`
        case 'object':
          return nameFor(node) ?? 'Record<string, unknown>'
        case 'union':
          return node.members.map(typeOf).join(' | ')
      }
    }
    // Union element types need parentheses before the array suffix binds.
    const wrap = (node: InferredNode) => {
      const rendered = typeOf(node)
      return node.kind === 'union' ? `(${rendered})` : rendered
    }

    const body = declarations
      .map((declaration) => {
        const fields = declaration.node.fields
          .map((field) => {
            const key = IDENTIFIER.test(field.key) ? field.key : JSON.stringify(field.key)
            return `  ${key}${field.optional ? '?' : ''}: ${typeOf(field.node)}`
          })
          .join('\n')
        return `export interface ${declaration.name} {\n${fields || '  [key: string]: unknown'}\n}`
      })
      .join('\n\n')

    if (root.kind === 'object') return body
    const alias = `export type ${pascalCase(rootName) || 'Root'} = ${typeOf(root)}`
    return body ? `${body}\n\n${alias}` : alias
  },
}

/** Initialisms gofmt and most linters expect to stay upper case. */
const GO_INITIALISMS = new Set(['id', 'url', 'uri', 'api', 'http', 'https', 'json', 'html', 'ip'])

const goFieldName = (key: string, index: number) => {
  const parts = words(key)
  if (parts.length === 0) return `Field${index + 1}`
  const name = parts
    .map((part) =>
      GO_INITIALISMS.has(part.toLowerCase())
        ? part.toUpperCase()
        : part[0].toUpperCase() + part.slice(1),
    )
    .join('')
  return IDENTIFIER.test(name) ? name : `Field${index + 1}`
}

const go: Emitter = {
  render: (declarations, nameFor, root, rootName) => {
    const typeOf = (node: InferredNode): string => {
      const { nullable, rest } = splitNullable(node)
      if (rest.length > 1) return 'any'
      const [only] = rest
      const base = (() => {
        switch (only.kind) {
          case 'string':
            return 'string'
          case 'integer':
            return 'int64'
          case 'number':
            return 'float64'
          case 'boolean':
            return 'bool'
          case 'array':
            return `[]${typeOf(only.element)}`
          case 'object':
            return nameFor(only) ?? 'map[string]any'
          default:
            return 'any'
        }
      })()
      // Slices, maps, and `any` are already nilable; only value types need a pointer.
      const nilable = base.startsWith('[]') || base.startsWith('map[') || base === 'any'
      return nullable && !nilable ? `*${base}` : base
    }

    const body = declarations
      .map((declaration) => {
        const rows = declaration.node.fields.map((field, index) => {
          const rendered = typeOf(field.node)
          const nilable =
            rendered.startsWith('*') ||
            rendered.startsWith('[]') ||
            rendered.startsWith('map[') ||
            rendered === 'any'
          const goType = field.optional && !nilable ? `*${rendered}` : rendered
          const omitempty = field.optional || goType.startsWith('*')
          const tag = `\`json:"${field.key}${omitempty ? ',omitempty' : ''}"\``
          return { name: goFieldName(field.key, index), goType, tag }
        })
        const nameWidth = Math.max(0, ...rows.map((row) => row.name.length))
        const typeWidth = Math.max(0, ...rows.map((row) => row.goType.length))
        const fields = rows
          .map(
            (row) => `\t${row.name.padEnd(nameWidth)} ${row.goType.padEnd(typeWidth)} ${row.tag}`,
          )
          .join('\n')
        return `type ${declaration.name} struct {\n${fields}\n}`
      })
      .join('\n\n')

    if (root.kind === 'object') return body
    const alias = `type ${pascalCase(rootName) || 'Root'} ${typeOf(root)}`
    return body ? `${body}\n\n${alias}` : alias
  },
}

const PYTHON_KEYWORDS = new Set([
  'class',
  'def',
  'from',
  'import',
  'lambda',
  'None',
  'pass',
  'return',
  'True',
  'False',
  'global',
  'in',
  'is',
  'not',
  'or',
  'and',
  'if',
  'else',
  'for',
  'while',
  'try',
])

const pythonFieldName = (key: string, index: number) => {
  const name = words(key)
    .map((part) => part.toLowerCase())
    .join('_')
  if (!name || !IDENTIFIER.test(name)) return `field_${index + 1}`
  return PYTHON_KEYWORDS.has(name) ? `${name}_` : name
}

const python: Emitter = {
  render: (declarations, nameFor, root, rootName) => {
    const typeOf = (node: InferredNode): string => {
      const { nullable, rest } = splitNullable(node)
      const rendered = rest
        .map((member) => {
          switch (member.kind) {
            case 'string':
              return 'str'
            case 'integer':
              return 'int'
            case 'number':
              return 'float'
            case 'boolean':
              return 'bool'
            case 'array':
              return `list[${typeOf(member.element)}]`
            case 'object':
              return nameFor(member) ?? 'dict[str, Any]'
            default:
              return 'Any'
          }
        })
        .join(' | ')
      return nullable ? `${rendered} | None` : rendered
    }

    const body = declarations
      .map((declaration) => {
        const rows = declaration.node.fields.map((field, index) => {
          const rendered = typeOf(field.node)
          const annotation =
            field.optional && !rendered.endsWith('| None') ? `${rendered} | None` : rendered
          return {
            name: pythonFieldName(field.key, index),
            annotation,
            // Defaults must trail required fields, so optionals are sorted last.
            optional: field.optional,
          }
        })
        const ordered = [
          ...rows.filter((row) => !row.optional),
          ...rows.filter((row) => row.optional),
        ]
        const fields = ordered
          .map((row) => `    ${row.name}: ${row.annotation}${row.optional ? ' = None' : ''}`)
          .join('\n')
        return `@dataclass\nclass ${declaration.name}:\n${fields || '    pass'}`
      })
      .join('\n\n\n')

    const header =
      'from __future__ import annotations\n\nfrom dataclasses import dataclass\nfrom typing import Any'
    if (root.kind === 'object') return `${header}\n\n\n${body}`
    const alias = `${pascalCase(rootName) || 'Root'} = ${typeOf(root)}`
    return body ? `${header}\n\n\n${body}\n\n\n${alias}` : `${header}\n\n\n${alias}`
  },
}

const emitters: Record<JsonTypeTarget, Emitter> = { typescript, go, python }

export type JsonTypeResult = { output: string; error?: string }

export const generateTypeDefinitions = (
  source: string,
  target: JsonTypeTarget,
  rootName: string,
): JsonTypeResult => {
  const trimmed = source.trim()
  if (!trimmed) return { output: '' }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch (error) {
    return { output: '', error: error instanceof Error ? error.message : String(error) }
  }

  const safeRootName = pascalCase(rootName) || 'Root'
  const root = inferNode(parsed)
  const { declarations, nameFor } = collectDeclarations(root, safeRootName)
  return { output: emitters[target].render(declarations, nameFor, root, safeRootName) }
}
