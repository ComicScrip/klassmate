import Avatar from './Avatar';
import './Card.css';

const Card = () => {
  return (
    <div className="card">
      <div className="meta">
        <div>Some info</div>
        <Avatar
          avatarUrl="https://randomuser.me/api/portraits/women/25.jpg"
          alt="user avatar"
          size={50}
          borderColor="green"
        />
        <div>Some other info</div>
      </div>
      <div className="general">
        <h4 className="name">John Doe</h4>
        <p className="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut sint
          molestias consequuntur excepturi aliquam. Nobis dolor reprehenderit
          quis repellendus ipsa qui fugiat, sint nisi doloremque corrupti sed
          amet quia in.
        </p>
      </div>
    </div>
  );
};

export default Card;
