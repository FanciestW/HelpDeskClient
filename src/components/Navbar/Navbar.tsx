import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Menu as MenuIcon,
  Brightness7 as Brightness7Icon,
  Brightness4 as Brightness4Icon
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
}));

export default function Navbar() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title} onClick={() => history.push('/dashboard')}>
          HelpDesk
        </Typography>
        <IconButton edge='start'>
          { }
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

interface NavbarProps {
  theme?: 'light' | 'dark';
}
