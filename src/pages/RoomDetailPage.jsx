import { useParams, Link } from 'react-router-dom';
import roomsData from '../data/roomsData.json';
import { useHotel } from '../context/HotelContext';
import { getValidRoomImage } from '../utils/roomImages';
import PageBanner from '../components/common/PageBanner';
import RoomCarousel from '../components/rooms/RoomCarousel';
import '../styles/roomDetail.css';


const RoomDetailPage = () => {
  const { slug } = useParams();
  const { rooms } = useHotel();

  const allRooms = rooms && rooms.length > 0 ? rooms : roomsData.rooms;
  const room = allRooms.find((r) => r.slug === slug || String(r.id) === slug) ||
    roomsData.rooms.find((r) => r.slug === slug);

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
    { label: room.name, path: `/rooms/${room.slug || room.id}` },
  ];

  const priceDisplay = room.price
    ? `৳ ${Number(room.price).toLocaleString('en-BD')}`
    : null;

  // Build the complete list of images for this room (main image + gallery images)
  const mainImage = getValidRoomImage(room.image, room.name);
  const galleryImages = Array.isArray(room.images) ? room.images.filter(Boolean) : [];
  // Merge main image with additional gallery images without duplicating
  const allImages = [mainImage, ...galleryImages.filter(img => img !== mainImage)];

  return (
    <>
      <PageBanner title={room.name} breadcrumbItems={breadcrumb} />

      <section className="room-detail">
        <div className="room-detail__container">

          {/* Interactive Card Carousel (or Single Hero Image if only 1 photo) */}
          <div style={{ position: 'relative' }}>
            {priceDisplay && (
              <div style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 30,
                background: 'rgba(18, 70, 61, 0.94)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: 24,
                fontSize: '1rem',
                fontWeight: 700,
                border: '1px solid rgba(200, 149, 108, 0.55)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
              }}>
                {priceDisplay} <span style={{ fontSize: '0.78rem', fontWeight: 400, opacity: 0.85 }}>/ night</span>
              </div>
            )}

            {allImages.length > 1 ? (
              <RoomCarousel images={allImages} roomName={room.name} />
            ) : (
              <div className="room-detail__image-wrapper" style={{ margin: '0 auto 40px' }}>
                <img
                  src={mainImage}
                  alt={room.name}
                  className="room-detail__image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/rooms/premium-deluxe-king.png';
                  }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="room-detail__body">

            {/* Room Details label */}
            <div className="room-detail__section">
              <h2 className="room-detail__section-title">Room Details</h2>
              <div className="room-detail__divider" />

              <h3 className="room-detail__info-heading">Information</h3>
              <p className="room-detail__description">{room.fullDescription || room.description}</p>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
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
            )}

            {/* CTA */}
            <div className="room-detail__cta">
              <Link
                to={`/book?room=${encodeURIComponent(room.name)}`}
                className="room-detail__book-btn"
              >
                BOOK THIS ROOM
              </Link>
              <Link to="/rooms" className="room-detail__back-btn">← BACK TO ROOMS</Link>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default RoomDetailPage;
