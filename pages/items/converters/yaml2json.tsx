import { useState } from 'react'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const yaml2json = require('js-yaml');
const json2yaml = require('json2yaml');

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
    JSON: JSON.stringify(sampleJson,null,"    "),
    YAML: json2yaml.stringify(sampleJson),
  });
  const onChangeHandler = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let tmp = {
      JSON: '',
      YAML: '',
    }
    switch (target.name) {
      case 'JSON':
        try {
          tmp.YAML = json2yaml.stringify(JSON.parse(value))
        } catch (e) {
          tmp.YAML = form.YAML
        }
        break;
      case 'YAML':
        try {
          tmp.JSON = JSON.stringify(yaml2json.load(value), null, '    ')
        } catch (e) {
          tmp.JSON = form.JSON
        }
        break;
      default:
        break;
    }
    setForm({ ...tmp, [target.name]: value });
  }

  return (
    <Layout title="YAML <> JSON converter">
      <Box sx={{ p: 1 }} >
        <span>JSON</span>
        <TextField label="" multiline rows={10} name="JSON" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.JSON} />
      </Box>
      <Box sx={{ p: 1 }} >
        <span>YAML</span>
        <TextField label="" multiline rows={10} name="YAML" variant="outlined" size="small" fullWidth onChange={onChangeHandler} value={form.YAML} />
      </Box>
    </Layout>
  )
}

export default Index