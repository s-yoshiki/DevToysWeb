import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const sampleJson = [
  {
    "id": "1",
    "name": "Taro"
  },
  {
    "id": "2",
    "name": "Tom"
  },
  {
    "id": "3",
    "name": "Eddy"
  }
]

const Index = () => {
  let [form, setForm] = useState({
    src: JSON.stringify(sampleJson,null,''),
    dst: JSON.stringify(sampleJson,null,'    '),
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
          tmp.dst = JSON.stringify(JSON.parse(value),null,'    ')
        } catch (e) {
          tmp.dst = form.dst
        }
        break;
      case 'dst':
        tmp.src = form.src
        break;
      default:
        break;
    }
    setForm({ ...tmp, [target.name]: value });
  }

  return (
    <Layout title="JSON Formatter">
      <Box sx={{ p: 1 }} >
        <span>Input</span>
        <TextField label="" multiline rows={5} name="src" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.src} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Output</span>
        <TextField label="" multiline rows={10} name="dst" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.dst} />
      </Box>
    </Layout>
  )
}

export default Index