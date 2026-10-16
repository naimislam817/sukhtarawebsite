import { useHotel } from '../../context/HotelContext';
import '../../styles/home.css';

const CTASection = () => {
  const { homepage, contact } = useHotel();

  const cta = homepage?.cta || {};
  const title = cta.title || 'Your Room at Shuktara is Waiting';
  const subtitle = cta.subtitle || 'Book directly with our 24/7 reservation team\nfor preferential corporate rates and\ncomplimentary airport pickup.';

  const phoneDisplay = contact?.phones?.[0]?.display || contact?.phones?.[0]?.raw || '+880 1400 334422';
  const phoneRaw = contact?.phones?.[0]?.raw || phoneDisplay.replace(/[^0-9+]/g, '');
  const email = contact?.emails?.[1]?.email || contact?.emails?.[0]?.email || 'reservation@hotelshuktara.com';

  return (
    <section className="cta" aria-labelledby="cta-heading">
      <div className="cta__overlay"></div>
      <div className="cta__content reveal-fade-up">
        {/* Star Icon Badge */}
        <div className="cta__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#DFA04E" stroke="#DFA04E" strokeWidth="0.5">
            <polygon points="12,1.5 15,9 22.5,9.5 17,14.8 18.8,22.5 12,18.5 5.2,22.5 7,14.8 1.5,9.5 9,9" />
          </svg>
        </div>

        {/* Heading */}
        <h2 id="cta-heading" className="cta__title">
          {title}
        </h2>

        {/* Multiline Subtitle */}
        <p className="cta__subtitle">
          {subtitle.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < subtitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>

        {/* Action Buttons */}
        <div className="cta__actions">
          {/* Call Direct Pill (Solid Gold/Amber) */}
          <a
            href={`tel:${phoneRaw}`}
            className="cta__btn cta__btn--call"
            aria-label={`Call Direct ${phoneDisplay}`}
          >
            <svg
              className="cta__btn-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>Call Direct: {phoneDisplay}</span>
          </a>

          {/* Email Reservation Pill (Dark Emerald Translucent) */}
          <a
            href={`mailto:${email}`}
            className="cta__btn cta__btn--email"
            aria-label={`Email ${email}`}
          >
            <svg
              className="cta__btn-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{email}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
