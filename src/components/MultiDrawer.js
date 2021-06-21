import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Groups from '@material-ui/icons/Group';
import NoteIcon from '@material-ui/icons/Note';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SportsKabaddi from '@material-ui/icons/SportsKabaddi';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/currentUser';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function MultiDrawer({ openStates, setOpenStates }) {
  const classes = useStyles();

  const { logout } = useContext(CurrentUserContext);

  const toggleDrawer = (anchor, open) => () => {
    setOpenStates({ ...openStates, [anchor]: !open });
  };
  const closeAllDrawers = () => {
    // TODO: try to figure out why it does not work without setTimeout
    setTimeout(() => {
      setOpenStates({ top: false, bottom: false, right: false, left: false });
    }, 50);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link to="/notes" onClick={closeAllDrawers}>
          <ListItem button>
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary="Notes" />
          </ListItem>
        </Link>
        <Link to="/dojo" onClick={closeAllDrawers}>
          <ListItem button>
            <ListItemIcon>
              <SportsKabaddi />
            </ListItemIcon>
            <ListItemText primary="Dojo" />
          </ListItem>
        </Link>
        <Link to="/createGroups" onClick={closeAllDrawers}>
          <ListItem button>
            <ListItemIcon>
              <Groups />
            </ListItemIcon>
            <ListItemText primary="Create groups" />
          </ListItem>
        </Link>
        <Link to="/activities" onClick={closeAllDrawers}>
          <ListItem button>
            <ListItemIcon>
              <PlayArrowIcon />
            </ListItemIcon>
            <ListItemText primary="Activities" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <Link to="/profile" onClick={closeAllDrawers}>
          <ListItem button>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
        <Link
          to="/"
          onClick={() => {
            logout();
            closeAllDrawers();
          }}
        >
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <SwipeableDrawer
            onOpen={toggleDrawer(anchor, openStates[anchor])}
            onClose={toggleDrawer(anchor, openStates[anchor])}
            open={openStates[anchor]}
            anchor={anchor}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
