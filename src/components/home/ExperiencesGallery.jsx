import homeData from '../../data/homeData.json';
import { useHotel } from '../../context/HotelContext';
import SectionTitle from '../common/SectionTitle';
import '../../styles/home.css';

const ExperiencesGallery = () => {
  const { experiences } = homeData;
  const { homepage } = useHotel();

  const galleryImages =
    homepage?.experiences?.images && homepage.experiences.images.length > 0
      ? homepage.experiences.images
      : experiences.images;

  return (
    <section className="experiences">
      <div className="experiences__container">
        <SectionTitle title={experiences.title} />
        <div className="experiences__grid">
          {galleryImages.map((img, index) => (
            <div 
              className={`experiences__item reveal-fade-up delay-${(index % 4) + 1}`} 
              key={img.id || index}
            >
              <img
                src={img.src}
                alt={img.alt || img.caption || 'Experience'}
                className="experiences__image"
                onError={(e) => {
                  e.target.src = '/images/hero/hero-bg.jpg';
                }}
              />
              <div className="experiences__overlay">
                <span className="experiences__caption">{img.caption || img.alt}</span>
                <span className="experiences__icon">✦</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencesGallery;

