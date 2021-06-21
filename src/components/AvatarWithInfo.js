import Popover from '@material-ui/core/Popover';
import { useState } from 'react';
import Avatar from './Avatar';

const AvatarWithInfo = ({
  avatarUrl,
  size,
  borderColor,
  meetUrl,
  discordId,
  firstName,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const shouldShowPopover = discordId || meetUrl;

  return (
    <div>
      <div
        onClick={handleClick}
        className={`${shouldShowPopover ? 'cursor-pointer' : ''}`}
      >
        <Avatar
          avatarUrl={avatarUrl}
          size={size || 50}
          borderColor={borderColor}
        />
        {firstName && <p className="text-center">{firstName}</p>}
      </div>

      {shouldShowPopover && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className="p-5">
            {meetUrl && (
              <p>
                <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                  Meet
                </a>
              </p>
            )}
            {discordId && (
              <p>
                <a
                  href={`https://discord.com/users/${discordId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </p>
            )}
          </div>
        </Popover>
      )}
    </div>
  );
};

export default AvatarWithInfo;
