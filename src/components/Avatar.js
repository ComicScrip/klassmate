import './Avatar.css';

const Avatar = ({ avatarUrl, alt, size = 50, borderColor = '' }) => {
  return (
    <img
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: borderColor ? `5px solid ${borderColor}` : 'none',
      }}
      className="avatar"
      src={avatarUrl}
      alt={alt}
    />
  );
};

export default Avatar;
