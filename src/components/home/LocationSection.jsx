import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const LocationSection = () => {
  const { location } = homeData;

  return (
    <section className="location">
      <div className="location__container">
        <div className="location__image-wrapper reveal-fade-up">
          <div className="location__glow-backdrop" aria-hidden="true" />
          <img src={location.image} alt="Hotel Shuktara Location" className="location__image" />
          <div className="location__badge">
            <span className="location__badge-number">{location.badge}</span>
            <span className="location__badge-text">{location.badgeText}</span>
          </div>
        </div>
        <div className="location__content reveal-fade-up delay-2">
          <div className="location__pill">
            <span className="location__pill-dot" />
            <span>PRIME COMMERCIAL HUB &bull; DHAKA 1215</span>
          </div>
          <h2 className="location__title">{location.title}</h2>
          <p className="location__description">{location.description}</p>
          <div className="location__highlights">
            <div className="location__chip">
              <span className="location__chip-icon">🚇</span>
              <span>Near Metro & Bus Hub</span>
            </div>
            <div className="location__chip">
              <span className="location__chip-icon">🍽️</span>
              <span>2 In-House Restaurants</span>
            </div>
            <div className="location__chip">
              <span className="location__chip-icon">✈️</span>
              <span>Airport Transfer Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
