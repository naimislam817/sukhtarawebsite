import { Link } from 'react-router-dom';
import siteData from '../../data/siteData.json';
import '../../styles/footer.css';

const Footer = () => {
  const { contact, socialLinks, footerLinks, footerDescription } = siteData;

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column footer__column--brand">
          <div className="footer__logo">
            <img src={siteData.logo} alt={siteData.hotelName} />
          </div>
          <h3 className="footer__hotel-name">{siteData.hotelName}</h3>
          <p className="footer__description">{footerDescription}</p>
          <div className="footer__payment">
            <p className="footer__payment-title">WE ACCEPT</p>
            <div className="footer__payment-icons">
              <div className="footer__payment-icon">VISA</div>
              <div className="footer__payment-icon">MC</div>
              <div className="footer__payment-icon">AMEX</div>
            </div>
          </div>
        </div>

        <div className="footer__column footer__column--links">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__link-list">
            {footerLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.path} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__column footer__column--contact">
          <h3 className="footer__heading">Contact</h3>
          <div className="footer__contact-items">
            <div className="footer__contact-item">
              <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{contact.address}</span>
            </div>
            <div className="footer__contact-item">
              <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{contact.emails[0]}<br />{contact.emails[1]}</span>
            </div>
            <div className="footer__contact-item">
              <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{contact.phones[0]}<br />{contact.phones[1]}</span>
            </div>
          </div>

          <div className="footer__social">
            <p className="footer__social-title">STAY CONNECTED</p>
            <p className="footer__social-subtitle">Follow us in the social media</p>
            <div className="footer__social-icons">
              <a href={socialLinks.facebook} className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={socialLinks.twitter} className="footer__social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href={socialLinks.tripadvisor} className="footer__social-link" aria-label="TripAdvisor" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path></svg>
              </a>
              <a href={socialLinks.instagram} className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© ALL RIGHTS RESERVED HOTEL SHUKTARA (PVT.) LTD.</p>
      </div>
    </footer>
  );
};

export default Footer;
