import React from 'react';
import Axios from 'axios';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Menu as MenuIcon,
  Brightness7 as Brightness7Icon,
  Brightness4 as Brightness4Icon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

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
  }
}));

export default function Navbar(props: INavbarProps) {
  const classes = useStyles();
  const history = useHistory();

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
    props.setAuthed(false);
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title} onClick={() => history.push('/dashboard')}>
          HelpDesk
        </Typography>
        <IconButton edge='start' className={classes.iconButton} onClick={toggleTheme}>
          { localStorage.getItem('theme') === 'dark' ? <Brightness7Icon /> : <Brightness4Icon /> }
        </IconButton>
        <IconButton edge='start' className={classes.iconButton} onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

interface INavbarProps {
  setAuthed: Function,
}
