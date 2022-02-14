import { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Index = () => {
  let [form, setForm] = useState({
    decimal: '0',
    hexdeciaml: '0',
    octal: '0',
    binary: '0',
  });

  const fillForm = (v: number) => {
    if (isNaN(v)) {
      v = 0
    }
    return {
      decimal: v.toString(10),
      hexdeciaml: v.toString(16),
      octal: v.toString(8),
      binary: v.toString(2),
    }
  }

  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = {
      decimal: '1',
      hexdeciaml: '1',
      octal: '1',
      binary: '1',
    }
    switch (target.name) {
      case 'Decimal':
        tmp = fillForm(Number(value))
        break;
      case 'Hexdeciaml':
        tmp = fillForm(parseInt(value, 16))
        break;
      case 'Octal':
        tmp = fillForm(parseInt(value, 8))
        break;
      case 'Binary':
        tmp = fillForm(parseInt(value, 2))
        break;
      default:
        break;
    }
    setForm({ ...tmp, [target.name]: value });
  }

  return (
    <Layout title="Number Base Converter">
      <Box sx={{ p: 1 }} >
        <span>Decimal</span>
        <TextField label="" name="Decimal" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.decimal} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Hexdeciaml</span>
        <TextField label="" name="Hexdeciaml" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.hexdeciaml} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Octal</span>
        <TextField label="" name="Octal" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.octal} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Binary</span>
        <TextField label="" name="Binary" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.binary} />
      </Box>
    </Layout>
  )
}

export default Index