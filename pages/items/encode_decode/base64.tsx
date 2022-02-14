import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CryptoJS from 'crypto-js'

// note: Thanks! -> https://gist.github.com/joecliff/10948117

const strToBase64 = (s: string): string => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(s))

const base64ToStr = (s: string): string => CryptoJS.enc.Base64.parse(s).toString(CryptoJS.enc.Utf8)

const SAMPLE = 'Hello World!'

const Index = () => {
  let [form, setForm] = useState({
    src: SAMPLE,
    dst: strToBase64(SAMPLE)
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
          tmp.dst = strToBase64(value)
        } catch (e) {
          tmp.dst = form.dst
        }
        break;
      case 'dst':
        try {
          tmp.src = base64ToStr(value)
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
    <Layout title="Base64 Encoder / Decoder">
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