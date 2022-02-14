import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import CryptoJS from 'crypto-js'

interface HashList {
  name: string,
  value: string,
}

interface getAllHashOpt {
  output?: any
}

const getAllHash = (src: string, opt: getAllHashOpt = {output: CryptoJS.enc.Hex}): Array<HashList> => {
  const out = opt.output
  return [
    {
      name: 'MD5',
      value: CryptoJS.MD5(src).toString(out),
    },
    {
      name: 'SHA1',
      value: CryptoJS.SHA1(src).toString(out),
    },
    {
      name: 'SHA256',
      value: CryptoJS.SHA256(src).toString(out),
    },
    {
      name: 'SHA512',
      value: CryptoJS.SHA512(src).toString(out),
    },
    {
      name: 'SHA3 (512)',
      value: CryptoJS.SHA3(src, { outputLength: 512 }).toString(out),
    },
    {
      name: 'SHA3 (384)',
      value: CryptoJS.SHA3(src, { outputLength: 384 }).toString(out),
    },
    {
      name: 'SHA3 (256)',
      value: CryptoJS.SHA3(src, { outputLength: 256 }).toString(out),
    },
    {
      name: 'SHA3 (224)',
      value: CryptoJS.SHA3(src, { outputLength: 224 }).toString(out),
    },
  ]
}

const SAMPLE = 'Hello World!'

const Index = () => {
  let [src, setSrc] = useState(SAMPLE);
  let [form, setForm] = useState<Array<HashList>>([]);
  const onChangeHandler = (e: any) => {
    const value = e.target.value
    setSrc(value)
    setForm(getAllHash(value));
  }

  return (
    <Layout title="Hash generater">
      <Box sx={{ p: 1 }} >
        <span>Input</span>
        <TextField label="" multiline rows={5} name="src" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={src} />
      </Box>
      {form.map((e: HashList) => {
        return <>
          <Box sx={{ p: 1 }} >
            <span>{e.name}</span>
            <TextField
              label=""
              multiline
              rows={1}
              name="dst"
              variant="outlined"
              size="small"
              fullWidth
              value={e.value}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </>
      })}
    </Layout>
  )
}

export default Index