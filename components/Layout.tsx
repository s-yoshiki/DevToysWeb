import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

import SideBar from './Toolbar/SideBar'
import AppBar from './Toolbar/AppBar'
import { useEffect } from 'react'
import Typography from '@mui/material/Typography';
// const drawerWidth: number = 240;

const theme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});

type Props = {
  children: React.ReactNode
  title?: string
}

const Layout = ({ children, title }: Props) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  }
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar open toggleDrawer title={title}></AppBar>
      <SideBar toggleDrawer={toggleDrawer} open={open} ></SideBar>
      {/* <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
      </Box> */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
      </Box>
    </Box>
    </ThemeProvider>
  );
}

export default Layout
