import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { dump, load } from 'js-yaml'
import { useState } from 'react'
import Layout from '../../../components/Layout'

const sampleJson = [
  {
    id: '1',
    name: 'Taro',
  },
  {
    id: '2',
    name: 'Tom',
  },
  {
    id: '3',
    name: 'Eddy',
  },
]

const Index = () => {
  const [form, setForm] = useState({
    JSON: JSON.stringify(sampleJson, null, '    '),
    YAML: dump(sampleJson),
  })
  const onChangeHandler = (e: any) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const tmp = {
      JSON: '',
      YAML: '',
    }
    switch (target.name) {
      case 'JSON':
        try {
          tmp.YAML = dump(JSON.parse(value))
        } catch (_e) {
          tmp.YAML = form.YAML
        }
        break
      case 'YAML':
        try {
          tmp.JSON = JSON.stringify(load(value), null, '    ')
        } catch (_e) {
          tmp.JSON = form.JSON
        }
        break
      default:
        break
    }
    setForm({ ...tmp, [target.name]: value })
  }

  return (
    <Layout title="YAML <> JSON converter">
      <Box sx={{ p: 1 }}>
        <span>JSON</span>
        <TextField
          label=""
          multiline
          rows={10}
          name="JSON"
          variant="outlined"
          size="small"
          fullWidth
          onChange={onChangeHandler}
          value={form.JSON}
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <span>YAML</span>
        <TextField
          label=""
          multiline
          rows={10}
          name="YAML"
          variant="outlined"
          size="small"
          fullWidth
          onChange={onChangeHandler}
          value={form.YAML}
        />
      </Box>
    </Layout>
  )
}

export default Index
