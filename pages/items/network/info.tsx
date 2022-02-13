import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
// let type = connection.effectiveType;

// const updateConnectionStatus = () => {
//   // console.log("接続タイプが" + type + "から" + connection.effectiveType + "に変化");
//   type = connection.effectiveType;
// }

// connection.addEventListener('change', updateConnectionStatus);


export default () => {
  let [form, setForm] = useState({
    err: '',
    err2: '',
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        const json = await res.json()
        alert(JSON.stringify(json))
        form.err2 = JSON.stringify(json)
      } catch(e) {
        alert(e)
        form.err2 = 'ng'
        form.err = JSON.stringify(e)
      }
      setForm({...form});
    }
    getUser()
  }, [])

  return (
    <Layout>
      <Box sx={{ p: 1 }} >
        <span>Date</span>
      {JSON.stringify(form)}
      </Box>
    </Layout>
  )
}