import { styled, CSSObject, Theme } from '@mui/material/styles';
import * as React from 'react';
import Link from 'next/link'
import {
  People as PeopleIcon,
  BarChart as BarChartIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Assignment as AssignmentIcon,
  Layers as LayersIcon,
  StarBorder,
} from '@mui/icons-material';
import {
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  ListSubheader,
  ListItemButton,
  Collapse,
} from '@mui/material';
import MenuList from '@mui/material/MenuList';
import contentsList from '../../lib/contentList'
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth: number = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const MenuRow = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  if (Array.isArray(item.child) && item.child.length > 0) {
    return (
      <>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {open ? <ExpandMore /> : <ChevronRightIcon />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit >

          <List component="div" disablePadding dense>
            {item.child.map((e: any, i: number) => (
              <Link href={e.path} key={i}>
                <ListItemButton >
                  <ListItemIcon>
                    {/* <StarBorder /> */}
                  </ListItemIcon>
                  <ListItemText secondary={e.name} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      </>
    )
  } else {
    return (
      <>
        <Link href={item.path} passHref>
          <ListItemButton href={item.path}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </Link>
      </>
    )
  }
}

const MainListItems = ({ data = [] }: { data: any }) => {
  return (
    <MenuList dense>
      {data.map((e: any, i: number) => {
        return (
          <>
            <Divider />
            <MenuRow item={e} key={i}></MenuRow>
          </>
        )
      })}
      <Divider />
    </MenuList>
  )
};

const ListItems = ({ open, toggleDrawer }: { open: any, toggleDrawer: any }) => {
  return (
    <Drawer variant="permanent" open={open} >
      <Toolbar
        variant="dense"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <MainListItems data={contentsList}></MainListItems>
      {/* <List>{mainListItems}</List> */}
      {/* <Divider /> */}
      {/* <ListSubheader inset>Saved reports</ListSubheader> */}
      {/* <>{secondaryListItems}</> */}
    </Drawer>
  )
}

export default ListItems