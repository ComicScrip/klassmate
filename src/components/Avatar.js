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
      src={
        avatarUrl ||
        'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
      }
      alt={alt}
    />
  );
};

export default Avatar;
