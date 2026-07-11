import '../../styles/facilities.css';

const FacilityDetail = ({ facility }) => {
  return (
    <section className="facility-detail">
      <div className="facility-detail__container">
        <div className="facility-detail__image-wrapper">
          <img src={facility.image} alt={facility.name} className="facility-detail__image" />
        </div>
        <div className="facility-detail__content">
          {facility.tagline && (
            <p className="facility-detail__tagline">{facility.tagline}</p>
          )}
          <h2 className="facility-detail__title">
            {facility.name}
          </h2>
          <p className="facility-detail__description">{facility.description}</p>
          <div className="facility-detail__buttons">
            {facility.buttons.map((btn, index) => (
              <a key={index} href={btn.path} className="facility-detail__btn">
                {btn.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilityDetail;
