import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Layout from '../../../components/Layout'

const sample = 'abcde12345あいうえおアイウエオ$%&!?'

const Index = () => {
  const [form, setForm] = useState({
    src: sample,
    dst: encodeURIComponent(sample),
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
          tmp.dst = encodeURIComponent(value)
        } catch (_e) {
          tmp.dst = form.dst
        }
        break
      case 'dst':
        try {
          tmp.src = decodeURIComponent(value)
        } catch (_e) {
          tmp.src = form.src
        }
        break
      default:
        break
    }
    setForm({ ...tmp, [target.name]: value })
  }

  return (
    <Layout title="URL Encoder / Decoder">
      <Box sx={{ p: 1 }}>
        <span>Encoded</span>
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
        <span>Decoded</span>
        <TextField
          label=""
          multiline
          rows={5}
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
