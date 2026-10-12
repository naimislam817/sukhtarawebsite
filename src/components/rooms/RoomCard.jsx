import { Link } from 'react-router-dom';
import { getValidRoomImage } from '../../utils/roomImages';
import '../../styles/rooms.css';

const RoomCard = ({ room }) => {
  const priceDisplay = room.price
    ? `৳ ${Number(room.price).toLocaleString('en-BD')}`
    : null;

  const validImage = getValidRoomImage(room.image, room.name);

  return (
    <div className="room-card reveal-fade-up">
      <div className="room-card__image-wrapper">
        <img
          src={validImage}
          alt={room.name}
          className="room-card__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/rooms/deluxe-king.png';
          }}
        />

        {priceDisplay && (
          <span className="room-card__price-tag">
            {priceDisplay} <small>/ night</small>
          </span>
        )}
      </div>
      <div className="room-card__content">
        <h3 className="room-card__name">{room.name}</h3>
        <p className="room-card__description">{room.description}</p>
        <Link to={`/rooms/${room.slug || room.id}`} className="room-card__btn">
          CHECK DETAILS
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;

