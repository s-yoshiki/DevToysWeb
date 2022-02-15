import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

let list = [
  {
    src: '&',
    dst: '&amp;',
  },
  {
    src: "'",
    dst: '&#x27;',
  },
  {
    src: '`',
    dst: '&#x60;',
  },
  {
    src: '"',
    dst: '&quot;',
  },
  {
    src: '<',
    dst: '&lt;',
  },
  {
    src: '>',
    dst: '&gt;',
  },
  {
    src: ' ',
    dst: '&nbsp;',
  }
]

const escapeHTML = (arg: string) => {
  let result = arg
  list.forEach(e => {
    result = result.split(e.src).join(e.dst)
  })
  return result
}

const unescapeHTML = (arg: string) => {
  let result = arg
  list.forEach(e => {
    result = result.split(e.dst).join(e.src)
  })
  return result
}

const sample = '<body><script></script></body>'

const Index = () => {
  let [form, setForm] = useState({
    src: sample,
    dst: escapeHTML(sample)
  });
  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = {
      src: '',
      dst: '',
    }
    switch (target.name) {
      case 'src':
        try {
          tmp.dst = escapeHTML(value)
        } catch (e) {
          tmp.dst = form.dst
        }
        break;
      case 'dst':
        try {
          tmp.src = unescapeHTML(value)
        } catch (e) {
          tmp.src = form.src
        }
        break;
      default:
        break;
    }
    setForm({ ...tmp, [target.name]: value });
  }

  return (
    <Layout title="HTML Escape / Unescape">
      <Box sx={{ p: 1 }} >
        <span>Encoded</span>
        <TextField label="" multiline rows={10} name="src" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.src} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Decoded</span>
        <TextField label="" multiline rows={10} name="dst" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.dst} />
      </Box>
    </Layout>
  )
}

export default Index