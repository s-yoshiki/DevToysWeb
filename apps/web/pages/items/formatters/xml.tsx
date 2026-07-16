import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import xmlFormatter from 'xml-formatter'
import Layout from '../../../components/Layout'

const SAMPLE = `
<root>
  <content>
    <p>This is <b>some</b> content.</p>
      </content>
        </root>
`.trim()

const format = (src: string) => {
  return xmlFormatter(src, {
    indentation: '  ',
    filter: (node: any) => node.type !== 'Comment',
    collapseContent: true,
    lineSeparator: '\n',
  })
}

const Index = () => {
  const [form, setForm] = useState({
    src: SAMPLE,
    dst: format(SAMPLE),
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
          tmp.dst = format(value)
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
