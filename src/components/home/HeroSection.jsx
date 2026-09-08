import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const HeroSection = () => {
  const { hero } = homeData;

  return (
    <section className="hero">
      <div 
        className="hero__bg" 
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="hero__overlay">
        <div className="hero__content">
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
