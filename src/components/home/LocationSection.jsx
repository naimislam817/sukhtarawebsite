import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const LocationSection = () => {
  const { location } = homeData;

  return (
    <section className="location">
      <div className="location__container">
        <div className="location__image-wrapper">
          <img src={location.image} alt="Hotel Shuktara Location" className="location__image" />
          <div className="location__badge">
            <span className="location__badge-number">{location.badge}</span>
            <span className="location__badge-text">{location.badgeText}</span>
          </div>
        </div>
        <div className="location__content">
          <h2 className="location__title">{location.title}</h2>
          <p className="location__description">{location.description}</p>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
