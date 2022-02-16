import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  let [dst, setDst] = useState('');
  let [mag, setMag] = useState(1);

  const onChangeHandler = (e: any) => {
    setDst(e.target.value);
  }

  const onClickEvent = (e: any) => {
    let value = dst
    for (let i = 0; i < Number(mag); i++) {
      value += uuidv4() + "\n"
    }
    setDst(value);
  }

  return (
    <Layout title="UUIDs Generater">
      <Box sx={{ p: 1 }} >
        <Button onClick={onClickEvent} variant="contained">
          Generate UUIDs
        </Button>
        {" x "}
        <TextField label="number" multiline rows={1} name="dst" variant="outlined" size="small" onChange={(e) => setMag(Number(e.target.value))} value={mag} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>UUIDs</span>
        <TextField label="" multiline rows={20} name="dst" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={dst} />
      </Box>
    </Layout>
  )
}

export default Index