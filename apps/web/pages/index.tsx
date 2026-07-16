import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '../components/Card'
import Layout from '../components/Layout'
import { getChilds } from '../lib/contentList'

const Index = () => {
  return (
    <Layout>
      <Box sx={{ paddingTop: '40px' }}></Box>
      <span>All Tools</span>
      <Box sx={{ paddingTop: '20px' }}></Box>
      <Grid container spacing={2}>
        {getChilds().map((e) => {
          return (
            <Card
              title={e.name}
              category={e.category}
              path={e.path}
              desc={e.desc}
              key={e.path}
            ></Card>
          )
        })}
      </Grid>
    </Layout>
  )
}

export default Index
