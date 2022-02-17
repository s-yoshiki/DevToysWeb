import Layout from '../components/Layout'
import Box from '@mui/material/Box';
import Card from '../components/Card'
import {getChilds} from '../lib/contentList'
import Grid from '@mui/material/Grid';



const Index = () => {
  return (
    <Layout>
      <Box sx={{'paddingTop': '40px'}}>
      </Box>
      <span>All Tools</span>
      <Box sx={{'paddingTop': '20px'}}>
      </Box>
      <Grid container spacing={2}>
        {getChilds().map(e => {
          return (
            <Card 
              title={e.name} 
              category={e.category} 
              path={e.path}
              desc={e.desc}
            ></Card>
          )
        })}
      </Grid>
    </Layout>
  )
}

export default Index