import homeData from '../../data/homeData.json';
import SectionTitle from '../common/SectionTitle';
import '../../styles/home.css';

const facilityIcons = {
  concierge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1H8V6a4 4 0 0 1 4-4zM4 11h16M12 7v4M5 22h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z"></path>
    </svg>
  ),
  dining: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"></path>
    </svg>
  ),
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M2 12h20M6.5 17.5h11M4 6.5v11M20 6.5v11"></path>
    </svg>
  ),
  conference: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  airport: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5 5.2 3.5L5 14l-3-1-.5.5 3 2.5 2.5 3 .5-.5-1-3 3.5-3.5 3.5 5.2.5-.3c.4-.2.6-.6.5-1.1z"></path>
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"></path>
    </svg>
  )
};

const FacilitiesSection = () => {
  const { facilities } = homeData;

  return (
    <section className="facilities-section">
      <div className="facilities-section__container">
        <SectionTitle title={facilities.title} />
        <div className="facilities-section__list">
          {facilities.items.map((item, index) => (
            <div 
              className={`facilities-section__item reveal-fade-up delay-${(index % 2) + 1}`} 
              key={index}
            >
              <div className="facilities-section__icon">
                {facilityIcons[item.icon]}
              </div>
              <div className="facilities-section__info">
                <h3 className="facilities-section__item-title">{item.title}</h3>
                <p className="facilities-section__item-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
