import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import { useHotel } from '../../context/HotelContext';
import { contactConfig } from '../../data/contactConfig';
import '../../styles/home.css';

const HeroSection = () => {
  const { hero } = homeData;
  const { homepage, contact: liveContact } = useHotel();
  const heroBg = homepage?.hero?.backgroundImage || hero.backgroundImage;

  // Extract primary phone for direct call button
  const phoneObj = liveContact?.phones?.[0] || contactConfig.phones[0];
  const phoneRaw = phoneObj?.raw || '+8801400334422';
  const phoneDisplay = phoneObj?.display || '01400-334422';

  return (
    <section className="hero">
      <div 
        className="hero__bg" 
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div className="hero__overlay">
        {/* Floating cinematic ambient light orbs */}
        <div className="hero__orb hero__orb--1" aria-hidden="true" />
        <div className="hero__orb hero__orb--2" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-beacon" />
            <span>EXQUISITE HOSPITALITY IN DHAKA</span>
          </div>
          <h1 className="hero__title">
            {hero.titleLine1}<br />
            <span className="hero__title-highlight">{hero.titleHighlight}</span>{' '}
            {hero.titleLine2}
          </h1>
          <p className="hero__description">{hero.description}</p>
          <div className="hero__buttons">
            <Link to={hero.ctaButtons[0].path} className="hero__btn hero__btn--outline">
              {hero.ctaButtons[0].label}
            </Link>
            <Link to="/book" className="hero__btn hero__btn--solid">
              {hero.ctaButtons[1].label}
            </Link>
            <a 
              href={`tel:${phoneRaw}`} 
              className="hero__btn hero__btn--call"
              aria-label={`Call direct ${phoneDisplay}`}
            >
              <svg 
                className="hero__btn-icon" 
                viewBox="0 0 24 24" 
                width="16" 
                height="16" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>CALL NOW</span>
            </a>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
