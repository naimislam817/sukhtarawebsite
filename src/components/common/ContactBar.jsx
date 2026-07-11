import '../../styles/facilities.css';

const ContactBar = ({ phone, phoneAvailability, email }) => {
  return (
    <section className="contact-bar">
      <div className="contact-bar__container">
        <div className="contact-bar__item">
          <div className="contact-bar__icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="contact-bar__text">
            <p className="contact-bar__label">PHONE: {phone}</p>
            <span className="contact-bar__line"></span>
            <p className="contact-bar__sub">{phoneAvailability}</p>
          </div>
        </div>
        <div className="contact-bar__item">
          <div className="contact-bar__icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div className="contact-bar__text">
            <p className="contact-bar__label">EMAIL US</p>
            <span className="contact-bar__line"></span>
            <p className="contact-bar__sub">{email}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBar;
