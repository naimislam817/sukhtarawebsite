import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import { useHotel } from '../../context/HotelContext';
import SectionTitle from '../common/SectionTitle';
import { getValidRoomImage } from '../../utils/roomImages';
import '../../styles/home.css';

const AccommodationsSection = () => {
  const { accommodations } = homeData;
  const { rooms } = useHotel();

  // Use admin-managed published rooms if available, else fall back to homeData
  const displayRooms = rooms && rooms.length > 0
    ? rooms
        .filter(r => r.status === 'published')
        .slice(0, 3)
        .map(r => ({
          name: r.name,
          description: r.description,
          image: getValidRoomImage(r.image, r.name),
          slug: r.slug || r.id,
        }))
    : accommodations.rooms.map(r => ({
        ...r,
        image: getValidRoomImage(r.image, r.name),
      }));

  return (
    <section className="accommodations">
      <div className="accommodations__container">
        <SectionTitle title={accommodations.title} light />
        <div className="accommodations__grid">
          {displayRooms.map((room, index) => (
            <div 
              className={`accommodations__card reveal-fade-up delay-${(index % 3) + 1}`} 
              key={index}
            >
              <div className="accommodations__image-wrapper">
                <img
                  src={room.image}
                  alt={room.name}
                  className="accommodations__image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/rooms/premium-deluxe-king.png';
                  }}
                />
                <span className="accommodations__badge">
                  ★ {index === 0 ? 'SIGNATURE' : index === 1 ? 'PREMIUM' : 'POPULAR'}
                </span>
              </div>
              <div className="accommodations__info">
                <h3 className="accommodations__name">{room.name}</h3>
                <p className="accommodations__desc">{room.description}</p>
                <Link to={`/rooms/${room.slug}`} className="accommodations__link">
                  <span>View Details</span>
                  <span className="accommodations__arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;

