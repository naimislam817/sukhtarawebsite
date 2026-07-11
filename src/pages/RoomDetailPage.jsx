import { useParams, Link } from 'react-router-dom';
import roomsData from '../data/roomsData.json';
import PageBanner from '../components/common/PageBanner';
import '../styles/roomDetail.css';

const RoomDetailPage = () => {
  const { slug } = useParams();
  const room = roomsData.rooms.find((r) => r.slug === slug);

  if (!room) {
    return (
      <div className="room-detail-notfound">
        <h2>Room not found.</h2>
        <Link to="/rooms" className="btn-primary">Back to Rooms</Link>
      </div>
    );
  }

  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' },
    { label: room.name, path: `/rooms/${room.slug}` },
  ];

  return (
    <>
      <PageBanner title={room.name} breadcrumbItems={breadcrumb} />

      <section className="room-detail">
        <div className="room-detail__container">

          {/* Room Image */}
          <div className="room-detail__image-wrapper">
            <img src={room.image} alt={room.name} className="room-detail__image" />
          </div>

          {/* Content */}
          <div className="room-detail__body">

            {/* Room Details label */}
            <div className="room-detail__section">
              <h2 className="room-detail__section-title">Room Details</h2>
              <div className="room-detail__divider" />

              <h3 className="room-detail__info-heading">Information</h3>
              <p className="room-detail__description">{room.fullDescription}</p>
            </div>

            {/* Amenities */}
            <div className="room-detail__section">
              <h2 className="room-detail__section-title">Amenities</h2>
              <div className="room-detail__divider" />
              <ul className="room-detail__amenities">
                {room.amenities.map((item, index) => (
                  <li key={index} className="room-detail__amenity-item">
                    <span className="room-detail__amenity-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="room-detail__cta">
              <Link to="/book" className="room-detail__book-btn">BOOK THIS ROOM</Link>
              <Link to="/rooms" className="room-detail__back-btn">← BACK TO ROOMS</Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetailPage;
