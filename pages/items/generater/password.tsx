import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

const DEFAULT_ALLOW_STRING = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`

const getRandInt = (min: number = 0, max: number = 0): number => Math.floor(Math.random() * (max + 1 - min)) + min;

const getRandStr = (length: number, allowChar: string) => {
  let text = ``
  for (let i = 0; i < length; i++) {
    text += allowChar[getRandInt(0, allowChar.length - 1)]
  }
  return text
}

const Index = () => {
  let [form, setForm] = useState({
    number: 3,
    textLength: 8,
    allowChar: DEFAULT_ALLOW_STRING,
    dst: ''
  });

  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = {
      number: form.number,
      textLength: form.textLength,
      allowChar: form.allowChar,
      dst: form.dst
    }
    setForm({ ...tmp, [target.name]: value });
  }

  const onClickEvent = (e: any) => {
    let value = ``
    for (let i = 0; i < Number(form.number); i++) {
      value += getRandStr(
        Number(form.textLength),
        form.allowChar
      )
      value += "\n"
    }
    form.dst += value
    setForm({ ...form });
  }

  return (
    <Layout title="Random Password Generater">
      <Box sx={{ p: 1 }} >
        <Button onClick={onClickEvent} variant="contained">
          Generate Passwords
        </Button>
        {" x "}
        <TextField label="number" name="number" multiline rows={1} variant="outlined" size="small" onChange={onChangeHandler} value={form.number} />
        {" x "}
        <TextField label="text length" name="textLength" multiline rows={1} variant="outlined" size="small" onChange={onChangeHandler} value={form.textLength} />
      </Box>
      <Box sx={{ p: 1 }}>
        <TextField label="allow character" name="allowChar" multiline rows={1} variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.allowChar} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Passwords</span>
        <TextField label="" multiline rows={20} name="dst" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.dst} />
      </Box>
    </Layout>
  )
}

export default Index