'use client'

import Ajv from 'ajv'
import { JSONPath } from 'jsonpath-plus'
import { useMemo, useState } from 'react'

export type JsonQueryMode = 'path' | 'schema'

const sampleJson = '{"users":[{"name":"Alice","active":true},{"name":"Bob","active":false}]}'
const sampleSchema =
  '{"type":"object","required":["users"],"properties":{"users":{"type":"array","items":{"type":"object","required":["name"]}}}}'

export const useJsonQuery = () => {
  const [mode, setMode] = useState<JsonQueryMode>('path')
  const [json, setJson] = useState(sampleJson)
  const [query, setQuery] = useState('$.users[?(@.active)].name')
  const [schema, setSchema] = useState(sampleSchema)

  const result = useMemo(() => {
    try {
      const data = JSON.parse(json)
      if (mode === 'path')
        return {
          value: JSON.stringify(JSONPath({ path: query, json: data }), null, 2),
          error: false,
        }
      const ajv = new Ajv({ allErrors: true })
      const valid = ajv.validate(JSON.parse(schema), data)
      return { value: JSON.stringify({ valid, errors: ajv.errors ?? [] }, null, 2), error: false }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid input', error: true }
    }
  }, [json, mode, query, schema])

  return {
    mode,
    setMode,
    json,
    setJson,
    query,
    setQuery,
    schema,
    setSchema,
    ...result,
    clear: () => setJson(''),
  }
}
