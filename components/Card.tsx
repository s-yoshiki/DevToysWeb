import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link'

export default function OutlinedCard(
  {
    title,
    category,
    path,
    desc
  }: {
    title?: string,
    category?: string,
    path?: string
    desc?: string
  }
) {
  const card = (
    <React.Fragment>
      <CardContent >
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="div">
          <Link href={path || ''}>
            {title || ''}
          </Link>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {category || ''}
        </Typography>
        <Typography variant="body2">
          {desc || ''}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={path || ''}>Show More</Button>
      </CardActions>
    </React.Fragment>
  );
  return (
    <Box sx={{padding: '5px'}}>
      <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 275, minHeight: 200, maxHeight: 200 }}>{card}</Card>
    </Box>
  );
}