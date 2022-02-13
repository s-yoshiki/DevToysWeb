import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const date2dtls = (d: Date) => {
  return [
    d.getFullYear(),
    '-',
    ('0' + (d.getMonth() + 1)).slice(-2),
    '-',
    ('0' + d.getDate()).slice(-2),
    'T',
    ('0' + d.getHours()).slice(-2),
    ':',
    ('0' + d.getMinutes()).slice(-2),
    ':',
    ('0' + d.getSeconds()).slice(-2),
  ].join('')
}

const generateDates = (d: Date) => {
  return {
    Date: date2dtls(d),
    UnixTime: Math.floor(d.getTime() / 1000),
    UnixTimeMs: d.getTime(),
    ISO8601: d.toISOString().split('.')[0] + 'Z',
    ISO8601Ms: d.toISOString(),
  }
}

const Index = () => {
  let [form, setForm] = useState(generateDates(new Date()));

  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = generateDates(new Date())
    let value2: Date
    switch (target.name) {
      case 'UnixTime':
        value2 = new Date(Number(value) * 1000)
        break;
      default:
        value2 = new Date(value)
        break;
    }
    try {
      tmp = generateDates(value2)
    } catch (e) {
      setForm({ ...tmp, [target.name]: value });
      return
    }
    setForm({ ...tmp, [target.name]: value });
  }

  return (
    <Layout>
      <Box sx={{ p: 1 }} >
        <span>Date</span>
        <TextField
          name="Date"
          variant="outlined" 
          size="small"
          type="datetime-local"
          fullWidth
          onChange={onChangeHandler}
          value={form.Date}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Unix Time</span>
        <TextField label="" name="UnixTime" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.UnixTime} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>Unix Time (ms)</span>
        <TextField label="" name="UnixTimeMs" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.UnixTimeMs} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>ISO 8601</span>
        <TextField label="" name="ISO8601" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.ISO8601} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>ISO 8601 (ms)</span>
        <TextField label="" name="ISO8601Ms" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.ISO8601Ms} />
      </Box>
    </Layout>
  )
}

export default Index