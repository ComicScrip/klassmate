import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MultiDrawer from './MultiDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    outline: 'none',
  },
  title: {
    flexGrow: 1,
  },
}));

function Header({ auth = true }) {
  const classes = useStyles();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const open = !!userMenuAnchor;
  const [multiDrawerOpenStates, setMultiDrawerOpenStates] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setUserMenuAnchor(null);
  };

  const handleMainMenuButtonClick = () => {
    setMultiDrawerOpenStates((prev) => ({ ...prev, top: true }));
  };

  return (
    <AppBar position="static" className="h-16">
      <MultiDrawer
        openStates={multiDrawerOpenStates}
        setOpenStates={setMultiDrawerOpenStates}
      />
      <Toolbar className="pt-1">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleMainMenuButtonClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Klassmate
        </Typography>
        {auth && (
          <>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenuClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={userMenuAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <Link to="/profile">
                <MenuItem onClick={handleClose}>Profile</MenuItem>
              </Link>
              <Link to="/">
                <MenuItem onClick={handleClose}>Log out</MenuItem>
              </Link>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
