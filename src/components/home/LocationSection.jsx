import { useState } from 'react';
import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const LocationSection = () => {
  const { location } = homeData;
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'map'

  const googleMapsEmbedUrl = 'https://www.google.com/maps?q=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215&output=embed';
  const googleMapsDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215';

  return (
    <section className="location" id="location" aria-labelledby="location-heading">
      <div className="location__container">
        {/* Left: Interactive Media Card (Photo vs Google Map) */}
        <div className="location__image-wrapper reveal-fade-up">
          <div className="location__glow-backdrop" aria-hidden="true" />

          {/* View Mode Switcher Pills */}
          <div className="location__view-toggle" role="tablist" aria-label="Location view mode">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'photo'}
              className={`location__toggle-btn ${activeTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveTab('photo')}
              title="Show Hotel Photo"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Hotel View</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'map'}
              className={`location__toggle-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
              title="Show Interactive Google Map"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Google Map</span>
            </button>
          </div>

          {activeTab === 'photo' ? (
            <>
              <img src={location.image} alt="Hotel Shuktara Location in Dhaka" className="location__image" />
              <div className="location__badge">
                <span className="location__badge-number">{location.badge}</span>
                <span className="location__badge-text">{location.badgeText}</span>
              </div>
            </>
          ) : (
            <div className="location__map-embed">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Shuktara Location on Google Maps"
              />
            </div>
          )}
        </div>

        {/* Right: Content & Location Details */}
        <div className="location__content reveal-fade-up delay-2">
          <div className="location__pill">
            <span className="location__pill-dot" />
            <span>PRIME COMMERCIAL HUB &bull; DHAKA 1215</span>
          </div>

          <h2 id="location-heading" className="location__title">{location.title}</h2>
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

          {/* Action Row */}
          <div className="location__actions">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="location__directions-btn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Get Directions</span>
            </a>

            <button
              type="button"
              className="location__toggle-map-link"
              onClick={() => setActiveTab(activeTab === 'photo' ? 'map' : 'photo')}
            >
              {activeTab === 'photo' ? (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                    <line x1="8" y1="2" x2="8" y2="18"/>
                    <line x1="16" y1="6" x2="16" y2="22"/>
                  </svg>
                  <span>Open Interactive Map</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>View Hotel Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
