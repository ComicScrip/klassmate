import Avatar from './Avatar';

const Card = () => {
  return (
    <div className="card">
      <div className="meta">
        <div>Some info</div>
        <Avatar />
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
