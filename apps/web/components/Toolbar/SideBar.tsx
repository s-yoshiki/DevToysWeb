import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Toolbar,
} from '@mui/material'
import MenuList from '@mui/material/MenuList'
import { type CSSObject, styled, type Theme } from '@mui/material/styles'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import contentsList from '../../lib/contentList'

const drawerWidth: number = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

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
})

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
)

const MenuRow = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(!open)
  }
  if (Array.isArray(item.child) && item.child.length > 0) {
    return (
      <>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
          {open ? <ExpandMore /> : <ChevronRightIcon />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {item.child.map((e: any) => (
              <ListItemButton component={Link} href={e.path} key={e.path}>
                <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                <ListItemText secondary={e.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    )
  } else {
    return (
      <ListItemButton component={Link} href={item.path}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItemButton>
    )
  }
}

const MainListItems = ({ data = [] }: { data: any }) => {
  return (
    <MenuList dense>
      {data.map((e: any) => {
        return (
          <Fragment key={e.path ?? e.name}>
            <Divider />
            <MenuRow item={e}></MenuRow>
          </Fragment>
        )
      })}
      <Divider />
    </MenuList>
  )
}

const ListItems = ({ open, toggleDrawer }: { open: any; toggleDrawer: any }) => {
  return (
    <Drawer variant="permanent" open={open}>
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
