import homeData from '../../data/homeData.json';
import SectionTitle from '../common/SectionTitle';
import '../../styles/home.css';

const ExperiencesGallery = () => {
  const { experiences } = homeData;

  return (
    <section className="experiences">
      <div className="experiences__container">
        <SectionTitle title={experiences.title} />
        <div className="experiences__grid">
          {experiences.images.map((img, index) => (
            <div 
              className={`experiences__item reveal-fade-up delay-${(index % 4) + 1}`} 
              key={index}
            >
              <img src={img.src} alt={img.alt} className="experiences__image" />
              <div className="experiences__overlay">
                <span className="experiences__caption">{img.alt}</span>
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
