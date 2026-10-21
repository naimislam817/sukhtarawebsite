import '../../styles/home.css';

const MapSection = () => {
  const googleMapsEmbedUrl =
    'https://maps.google.com/maps?q=Hotel+Sukhtara+Indira+Road+Farmgate+Dhaka+1215+Bangladesh&t=m&z=16&ie=UTF8&iwloc=&output=embed';
  const googleMapsDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Hotel+Sukhtara+Indira+Road+Farmgate+Dhaka+1215+Bangladesh';

  return (
    <section className="map-section" aria-label="Find us on the map">
      {/* Header strip */}
      <div className="map-section__header">
        <div className="map-section__header-inner">
          <div className="map-section__pill">
            <span className="map-section__pill-dot" />
            <span>PRIME CENTRAL LOCATION</span>
          </div>
          <h2 className="map-section__title">Find Us in Dhaka</h2>
          <p className="map-section__subtitle">
            Located on Indira Road in Farmgate, Dhaka — effortless connectivity to metro transit,
            government offices, airport expressways, and diplomatic zones.
          </p>

          {/* Info chips row */}
          <div className="map-section__chips">
            <div className="map-section__chip">
              <span>📍</span>
              <span>Indira Road, Farmgate, Dhaka 1215</span>
            </div>
            <div className="map-section__chip">
              <span>🚇</span>
              <span>Near Metro &amp; Bus Hub</span>
            </div>
            <div className="map-section__chip">
              <span>✈️</span>
              <span>Airport Transfer Available</span>
            </div>
          </div>

          {/* Directions CTA */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-section__directions-btn"
            aria-label="Open Google Maps directions to Hotel Sukhtara"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Full-width embedded map */}
      <div className="map-section__embed-wrapper">
        <iframe
          src={googleMapsEmbedUrl}
          title="Hotel Sukhtara Location on Google Maps"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="map-section__iframe"
        />
        {/* Decorative top fade to blend with header */}
        <div className="map-section__top-fade" aria-hidden="true" />
      </div>
    </section>
  );
};

export default MapSection;
