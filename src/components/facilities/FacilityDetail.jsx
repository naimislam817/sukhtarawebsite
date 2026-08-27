import '../../styles/facilities.css';

const FacilityDetail = ({ facility }) => {
  return (
    <>
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
            <div className="facility-detail__description">
              {facility.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
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

      {facility.informationDetails && (
        <section className="facility-specs">
          <div className="facility-specs__container">
            <h3 className="facility-specs__title">Information & Hall Features</h3>
            <div className="facility-specs__grid">
              {facility.informationDetails.map((item, idx) => (
                <div key={idx} className="facility-specs__card">
                  <span className="facility-specs__label">{item.label}</span>
                  <span className="facility-specs__value">{item.value}</span>
                </div>
              ))}
            </div>

            {(facility.layoutNote || facility.suitableFor) && (
              <div className="facility-meta-grid">
                {facility.layoutNote && (
                  <div className="facility-meta-card">
                    <h4 className="facility-meta-card__title">Hall Capacity & Layout</h4>
                    <p className="facility-meta-card__text">{facility.layoutNote}</p>
                  </div>
                )}
                {facility.suitableFor && (
                  <div className="facility-meta-card">
                    <h4 className="facility-meta-card__title">Suitable For</h4>
                    <div className="facility-chips">
                      {facility.suitableFor.map((tag, idx) => (
                        <span key={idx} className="facility-chip">✓ {tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {facility.gallery && (
        <section className="facility-gallery">
          <div className="facility-gallery__container">
            <h3 className="facility-gallery__title">Our Ambiance</h3>
            <div className="facility-gallery__grid">
              {facility.gallery.map((imgUrl, i) => (
                <div key={i} className={`facility-gallery__item facility-gallery__item--${i + 1}`}>
                  <img src={imgUrl} alt={`${facility.name} Ambiance ${i + 1}`} className="facility-gallery__image" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FacilityDetail;
