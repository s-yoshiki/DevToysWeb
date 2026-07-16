import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Layout from '../../../components/Layout'

const Index = () => {
  const [dst, setDst] = useState('')
  const [mag, setMag] = useState(1)

  const onChangeHandler = (e: any) => {
    setDst(e.target.value)
  }

  const onClickEvent = (_e: any) => {
    let value = dst
    for (let i = 0; i < Number(mag); i++) {
      value += `${uuidv4()}\n`
    }
    setDst(value)
  }

  return (
    <Layout title="UUIDs Generater">
      <Box sx={{ p: 1 }}>
        <Button onClick={onClickEvent} variant="contained">
          Generate UUIDs
        </Button>
        {' x '}
        <TextField
          label="number"
          multiline
          rows={1}
          name="dst"
          variant="outlined"
          size="small"
          onChange={(e) => setMag(Number(e.target.value))}
          value={mag}
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <span>UUIDs</span>
        <TextField
          label=""
          multiline
          rows={20}
          name="dst"
          variant="outlined"
          size="small"
          fullWidth
          onChange={onChangeHandler}
          value={dst}
        />
      </Box>
    </Layout>
  )
}

export default Index
