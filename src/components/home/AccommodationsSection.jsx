import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import { useHotel } from '../../context/HotelContext';
import SectionTitle from '../common/SectionTitle';
import { getValidRoomImage } from '../../utils/roomImages';
import '../../styles/home.css';

const AccommodationsSection = () => {
  const { accommodations } = homeData;
  const { rooms } = useHotel();
  const [mobileIndex, setMobileIndex] = useState(0);
  const carouselTrackRef = useRef(null);

  // Use admin-managed published rooms if available, else fall back to homeData
  const displayRooms = rooms && rooms.length > 0
    ? rooms
        .filter(r => r.status === 'published')
        .slice(0, 6)
        .map(r => ({
          name: r.name,
          description: r.description,
          image: getValidRoomImage(r.image, r.name),
          slug: r.slug || r.id,
          price: r.price
        }))
    : accommodations.rooms.map(r => ({
        ...r,
        image: getValidRoomImage(r.image, r.name),
      }));

  const total = displayRooms.length;

  const scrollToSlide = (idx) => {
    setMobileIndex(idx);
    if (carouselTrackRef.current) {
      const card = carouselTrackRef.current.children[idx];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleScroll = () => {
    if (!carouselTrackRef.current) return;
    const scrollLeft = carouselTrackRef.current.scrollLeft;
    const cardWidth = carouselTrackRef.current.children[0]?.offsetWidth || 300;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx >= 0 && newIdx < total && newIdx !== mobileIndex) {
      setMobileIndex(newIdx);
    }
  };

  return (
    <section className="accommodations">
      <div className="accommodations__container">
        <SectionTitle title={accommodations.title} light />

        {/* Accommodations Grid (Desktop: 3-column / Mobile: Horizontal Swipe Snap Carousel) */}
        <div 
          className="accommodations__grid accommodations__grid--mobile-carousel"
          ref={carouselTrackRef}
          onScroll={handleScroll}
        >
          {displayRooms.map((room, index) => (
            <div 
              className={`accommodations__card reveal-fade-up delay-${(index % 3) + 1}`} 
              key={room.slug || index}
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
                {room.price && (
                  <span className="accommodations__price-badge">
                    ৳{Number(room.price).toLocaleString('en-BD')} <small>/ night</small>
                  </span>
                )}
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

        {/* Mobile Carousel Indicators & Arrow Controls */}
        <div className="accommodations__mobile-nav" aria-hidden="true">
          <button 
            type="button" 
            className="accommodations__nav-btn"
            onClick={() => scrollToSlide(Math.max(0, mobileIndex - 1))}
            disabled={mobileIndex === 0}
            aria-label="Previous room"
          >
            ‹
          </button>
          
          <div className="accommodations__dots">
            {displayRooms.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`accommodations__dot ${idx === mobileIndex ? 'active' : ''}`}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            type="button" 
            className="accommodations__nav-btn"
            onClick={() => scrollToSlide(Math.min(total - 1, mobileIndex + 1))}
            disabled={mobileIndex === total - 1}
            aria-label="Next room"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;

