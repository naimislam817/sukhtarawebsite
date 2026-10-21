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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselTrackRef = useRef(null);

  // Use admin-managed published rooms if available, else fall back to homeData
  const displayRooms = rooms && rooms.length > 0
    ? rooms
        .filter(r => r.status === 'published')
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
    setCurrentIndex(idx);
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
    const cardWidth = carouselTrackRef.current.children[0]?.offsetWidth || 340;
    const newIdx = Math.round(scrollLeft / (cardWidth + 24));
    if (newIdx >= 0 && newIdx < total && newIdx !== currentIndex) {
      setCurrentIndex(newIdx);
    }
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, currentIndex - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(total - 1, currentIndex + 1));
  };

  return (
    <section className="accommodations">
      <div className="accommodations__container">
        <div className="accommodations__header-row">
          <SectionTitle title={accommodations.title} light />

          {/* Desktop Carousel Controls */}
          {total > 1 && (
            <div className="accommodations__desktop-nav" aria-label="Room slides navigation">
              <button 
                type="button" 
                className="accommodations__nav-btn"
                onClick={slidePrev}
                disabled={currentIndex === 0}
                aria-label="Previous rooms"
              >
                ‹
              </button>
              <button 
                type="button" 
                className="accommodations__nav-btn"
                onClick={slideNext}
                disabled={currentIndex === total - 1}
                aria-label="Next rooms"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Accommodations Slider Track (Desktop & Mobile Swipe/Snap Carousel) */}
        <div 
          className="accommodations__carousel-track"
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

        {/* Carousel Indicators & Navigation Controls */}
        {total > 1 && (
          <div className="accommodations__carousel-footer">
            <button 
              type="button" 
              className="accommodations__nav-btn accommodations__nav-btn--mobile"
              onClick={slidePrev}
              disabled={currentIndex === 0}
              aria-label="Previous room"
            >
              ‹
            </button>
            
            <div className="accommodations__dots" role="tablist" aria-label="Room slides">
              {displayRooms.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  className={`accommodations__dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              type="button" 
              className="accommodations__nav-btn accommodations__nav-btn--mobile"
              onClick={slideNext}
              disabled={currentIndex === total - 1}
              aria-label="Next room"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccommodationsSection;

