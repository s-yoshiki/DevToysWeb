import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { format } from 'sql-formatter'
import Layout from '../../../components/Layout'

const SAMPLE_CODE = `
SELECT * FROM USER_TABLE WHERE ID = '1' ORDER BY DESC
`.trim()

const pretty = (src: string): string => {
  return format(src, {
    language: 'sql',
    tabWidth: 4,
    linesBetweenQueries: 2,
  })
}

const Index = () => {
  const [form, setForm] = useState({
    src: SAMPLE_CODE,
    dst: pretty(SAMPLE_CODE),
  })
  const onChangeHandler = (e: any) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const tmp = {
      src: '',
      dst: '',
    }
    switch (target.name) {
      case 'src':
        try {
          tmp.dst = pretty(value)
        } catch (_e) {
          tmp.dst = form.dst
        }
        break
      case 'dst':
        tmp.src = form.src
        break
      default:
        break
    }
    setForm({ ...tmp, [target.name]: value })
  }

  return (
    <Layout title="JSON Formatter">
      <Box sx={{ p: 1 }}>
        <span>Input</span>
        <TextField
          label=""
          multiline
          rows={5}
          name="src"
          variant="outlined"
          size="small"
          fullWidth
          onChange={onChangeHandler}
          value={form.src}
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <span>Output</span>
        <TextField
          label=""
          multiline
          rows={10}
          name="dst"
          variant="outlined"
          size="small"
          fullWidth
          onChange={onChangeHandler}
          value={form.dst}
        />
      </Box>
    </Layout>
  )
}

export default Index
