import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CryptoJS from 'crypto-js'

const sampleJWT = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRhcm8gWWFtZGEiLCJpYXQiOjE1MTYyMzkwMjJ9.y2fzIzmjE174WN66kLftCaoqBWxJOYgEZafbly2x-UY`
.trim()

const base64ToStr = (s: string): string => CryptoJS.enc.Base64.parse(s).toString(CryptoJS.enc.Utf8)

const decodeJWT = (token: string) => {                                        
  const [p1,p2,p3] = token.split('.').map(e => {
    let base64 = e.replace(/-/g, '+').replace(/_/g, '/')
    return base64
  })
  return {
    header: JSON.parse(base64ToStr(p1)),
    payload: JSON.parse(base64ToStr(p2)),
  }
}; 

const jsonStringify = (obj :any) => JSON.stringify(obj, null, '    ')


const Index = () => {
  let [form, setForm] = useState({
    src: sampleJWT,
    header: jsonStringify(decodeJWT(sampleJWT).header),
    payload: jsonStringify(decodeJWT(sampleJWT).payload),
  });
  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = {
      src: '',
      header: '',
      payload: '',
    }
    switch (target.name) {
      case 'src':
        try {
          let obj = decodeJWT(value)
          tmp.header = jsonStringify(obj.header)
          tmp.payload = jsonStringify(obj.payload)
        } catch (e) {
          tmp.header = form.header
          tmp.payload = form.payload
        }
        break;
      case 'header':
        tmp.src = form.src
        break;
      case 'payload':
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
        <span>JWT Token</span>
        <TextField label="" multiline rows={5} name="src" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.src} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Header</span>
        <TextField label="" multiline rows={10} name="header" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.header} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Payload</span>
        <TextField label="" multiline rows={10} name="payload" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.payload} />
      </Box>
    </Layout>
  )
}

export default Index