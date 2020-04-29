import React, { useState } from 'react';
import Axios from 'axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Menu as MenuIcon,
  Brightness7 as Brightness7Icon,
  Brightness4 as Brightness4Icon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as AccountCircleIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  AssignmentLate as AssignmentLateIcon,
  FormatListBulleted as TasksIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDispatch,  useSelector } from 'react-redux';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import { IRootReducer } from '../../redux/IRootReducer';
import IUser from '../../interfaces/User';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    '&:hover': {
      cursor: 'pointer',
    }
  },
  iconButton: {
    color: '#FFFFFF',
    margin: theme.spacing(0.5),
  },
  sideNav: {
    width: '320px',
  },
  routerLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { isTechnician }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);

  const [menuIsOpen, setmenuIsOpen] = useState(false);
  const [theme] = useState(localStorage.getItem('theme') || 'light');

  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
    window.location.reload();
  }

  async function handleLogout() {
    await Axios.post('/api/user/logout');
    localStorage.setItem('authed', 'false');
    dispatch(changeAuthed(false));
  }

  const handleToggleMenu = () => {
    menuIsOpen ? setmenuIsOpen(false) : setmenuIsOpen(true);
  };

  const sideNav = (
    <div className={classes.sideNav}
      role='presentation'
      onClick={handleToggleMenu}
      onKeyDown={handleToggleMenu}>
      <List>
        <Link to='/dashboard' className={classes.routerLink}>
          <ListItem button>
            <ListItemIcon className='drawer-icon'>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
        </Link>
        <Link to='/tickets' className={classes.routerLink}>
          <ListItem button>
            <ListItemIcon className='drawer-icon'>
              <AssignmentLateIcon />
            </ListItemIcon>
            <ListItemText primary='Tickets' />
          </ListItem>
        </Link>
        <Link to='/tasks' className={classes.routerLink}>
          <ListItem button>
            <ListItemIcon className='drawer-icon'>
              <TasksIcon />
            </ListItemIcon>
            <ListItemText primary='Tasks List' />
          </ListItem>
        </Link>
        {
          isTechnician ? <Link to='/clients' className={classes.routerLink}>
            <ListItem button>
              <ListItemIcon className='drawer-icon'>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary='Clients' />
            </ListItem>
          </Link> : null
        }
        <Link to='/technicians' className={classes.routerLink}>
          <ListItem button>
            <ListItemIcon className='drawer-icon'>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary='Technicians' />
          </ListItem>
        </Link>
        <Link to='/profile' className={classes.routerLink}>
          <ListItem button>
            <ListItemIcon className='drawer-icon'>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary='My Profile' />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <AppBar position='static'>
      <Toolbar>
        <Tooltip title='Menu'>
          <IconButton edge='start' className={classes.menuButton} onClick={handleToggleMenu} color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <SwipeableDrawer open={menuIsOpen} onOpen={handleToggleMenu} onClose={handleToggleMenu} className={'side-drawer'}>
          {sideNav}
        </SwipeableDrawer>
        <Typography variant='h6' className={classes.title}>
          <Tooltip title='Go to Dashboard' placement='bottom-start'>
            <Link to='/dashboard' className={classes.routerLink}>HelpDesk</Link>
          </Tooltip>
        </Typography>
        <Tooltip title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          <IconButton edge='start' className={classes.iconButton} onClick={toggleTheme}>
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title='Log Out'>
          <IconButton edge='start' className={classes.iconButton} onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
