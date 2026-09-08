import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import SectionTitle from '../common/SectionTitle';
import '../../styles/home.css';

const AccommodationsSection = () => {
  const { accommodations } = homeData;

  return (
    <section className="accommodations">
      <div className="accommodations__container">
        <SectionTitle title={accommodations.title} light />
        <div className="accommodations__grid">
          {accommodations.rooms.map((room, index) => (
            <div 
              className={`accommodations__card reveal-fade-up delay-${(index % 3) + 1}`} 
              key={index}
            >
              <div className="accommodations__image-wrapper">
                <img src={room.image} alt={room.name} className="accommodations__image" />
                <span className="accommodations__badge">
                  ★ {index === 0 ? 'SIGNATURE' : index === 1 ? 'PREMIUM' : 'POPULAR'}
                </span>
              </div>
              <div className="accommodations__info">
                <h3 className="accommodations__name">{room.name}</h3>
                <p className="accommodations__desc">{room.description}</p>
                <Link to="/rooms" className="accommodations__link">
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
