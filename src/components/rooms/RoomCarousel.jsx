import { useState, useRef, useEffect } from 'react';
import '../../styles/roomCarousel.css';

/**
 * Interactive React Card Carousel for Room Detail page
 * Supports:
 * - Fluid smooth sliding track
 * - Interactive side cards with 3D depth and scale
 * - Touch swipe for mobile devices
 * - Thumbnail strip navigation
 * - Autoplay with pause on hover
 * - Keyboard left/right arrow navigation
 */
const RoomCarousel = ({ images = [], roomName = 'Room' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Normalize image list (remove empty/null)
  const validImages = Array.isArray(images)
    ? images.filter(Boolean)
    : [];

  const total = validImages.length;

  // Autoplay
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  if (total === 0) return null;

  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <div 
      className="room-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={`${roomName} Photo Gallery`}
    >
      {/* Main 3D Card Stage */}
      <div className="room-carousel-stage">
        {validImages.map((src, idx) => {
          // Calculate offset relative to active card
          let offset = idx - activeIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCurrent = offset === 0;
          const isPrev = offset === -1 || (activeIndex === 0 && idx === total - 1 && total > 2);
          const isNext = offset === 1 || (activeIndex === total - 1 && idx === 0 && total > 2);
          const isVisible = isCurrent || isPrev || isNext;

          let cardClass = 'room-carousel-card';
          if (isCurrent) cardClass += ' room-carousel-card--active';
          else if (isPrev) cardClass += ' room-carousel-card--prev';
          else if (isNext) cardClass += ' room-carousel-card--next';
          else cardClass += ' room-carousel-card--hidden';

          return (
            <div
              key={idx}
              className={cardClass}
              onClick={() => {
                if (isPrev) prevSlide();
                else if (isNext) nextSlide();
              }}
              style={{
                zIndex: isCurrent ? 10 : isVisible ? 5 : 1
              }}
            >
              <div className="room-carousel-card-inner">
                <img
                  src={src}
                  alt={`${roomName} - View ${idx + 1}`}
                  className="room-carousel-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/rooms/premium-deluxe-king.png';
                  }}
                />
                <div className="room-carousel-card-overlay" />
                <span className="room-carousel-counter">
                  {idx + 1} / {total}
                </span>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              className="room-carousel-btn room-carousel-btn--prev"
              onClick={prevSlide}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="room-carousel-btn room-carousel-btn--next"
              onClick={nextSlide}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar */}
      {total > 1 && (
        <div className="room-carousel-thumbnails">
          {validImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              className={`room-carousel-thumb ${idx === activeIndex ? 'room-carousel-thumb--active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCarousel;
