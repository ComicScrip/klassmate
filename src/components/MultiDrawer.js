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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SportsKabaddi from '@material-ui/icons/SportsKabaddi';
import clsx from 'clsx';
import React from 'react';

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

  const toggleDrawer = (anchor, open) => () => {
    setOpenStates({ ...openStates, [anchor]: !open });
  };

  const getLinkIcon = (text) =>
    ({
      Dojo: <SportsKabaddi />,
      'Create groups': <Groups />,
      Activity: <PlayArrowIcon />,
      Profile: <AccountBoxIcon />,
      Logout: <ExitToAppIcon />,
    }[text]);

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
        {['Activity', 'Create groups', 'Dojo'].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon>{getLinkIcon(text)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Profile', 'Logout'].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon>{getLinkIcon(text)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
