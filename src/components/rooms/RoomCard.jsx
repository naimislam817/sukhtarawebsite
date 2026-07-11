import { Link } from 'react-router-dom';
import '../../styles/rooms.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-card__image-wrapper">
        <img src={room.image} alt={room.name} className="room-card__image" />
      </div>
      <div className="room-card__content">
        <h3 className="room-card__name">{room.name}</h3>
        <p className="room-card__description">{room.description}</p>
        <Link to={`/rooms/${room.slug}`} className="room-card__btn">
          CHECK DETAILS
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
