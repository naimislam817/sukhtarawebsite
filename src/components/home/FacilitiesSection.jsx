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
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
      <path d="M7 2v20"></path>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
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
  ),
  parking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4"></rect>
      <path d="M9 17V7h4.5a3.5 3.5 0 0 1 0 6H9"></path>
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="facilities-icon-coffee">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
      <path className="coffee-steam coffee-steam--1" d="M6 1.5c.6 1-.6 2 0 3"></path>
      <path className="coffee-steam coffee-steam--2" d="M10 1c.6 1.5-.6 2.5 0 4"></path>
      <path className="coffee-steam coffee-steam--3" d="M14 1.5c.6 1-.6 2 0 3"></path>
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
              className={`facilities-section__item ${item.highlight ? 'facilities-section__item--highlight' : ''} reveal-fade-up delay-${(index % 2) + 1}`} 
              key={index}
            >
              {item.badge && (
                <span className="facilities-section__badge">
                  {item.badge}
                </span>
              )}
              <div className="facilities-section__icon">
                {facilityIcons[item.icon]}
              </div>
              <div className="facilities-section__info">
                <h3 className="facilities-section__item-title">{item.title}</h3>
                <p className="facilities-section__item-desc">{item.description}</p>
                {item.features && (
                  <div className="facilities-section__features">
                    {item.features.map((feat, fIndex) => (
                      <span className="facilities-section__feature-tag" key={fIndex}>
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
