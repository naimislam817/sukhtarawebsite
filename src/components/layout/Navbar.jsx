import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import siteData from '../../data/siteData.json';
import '../../styles/navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  const toggleDropdown = (label) => {
    setOpenMobileDropdown(prev => (prev === label ? null : label));
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          <Link to="/" className="navbar__logo" onClick={closeMobileMenu}>
            <img src={siteData.logo} alt={siteData.hotelName} />
          </Link>

          <button
            className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar__menu ${isMobileMenuOpen ? 'navbar__menu--open' : ''}`}>
            {/* Mobile Drawer Header */}
            <div className="navbar__drawer-header">
              <div className="navbar__drawer-brand">
                <img src={siteData.logo} alt={siteData.hotelName} />
              </div>
              <button
                className="navbar__drawer-close"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="navbar__drawer-links">
              {siteData.navLinks.map((link) => (
                link.dropdown ? (
                  <div
                    className={`navbar__dropdown ${openMobileDropdown === link.label ? 'navbar__dropdown--open' : ''}`}
                    key={link.label}
                  >
                    <button
                      type="button"
                      className="navbar__link navbar__link--dropdown"
                      onClick={() => toggleDropdown(link.label)}
                      aria-expanded={openMobileDropdown === link.label}
                    >
                      <span>{link.label}</span>
                      <svg className="navbar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className="navbar__dropdown-menu">
                      {link.dropdown.map((subLink) => (
                        <NavLink
                          key={subLink.path}
                          to={subLink.path}
                          className={({ isActive }) => `navbar__dropdown-item ${isActive ? 'navbar__dropdown-item--active' : ''}`}
                          onClick={closeMobileMenu}
                        >
                          {subLink.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                )
              ))}
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="navbar__drawer-footer">
              <Link to="/book" className="navbar__book-btn" onClick={closeMobileMenu}>
                BOOK NOW
              </Link>
              <div className="navbar__drawer-contact">
                <a href="tel:+8801400334422" className="navbar__drawer-phone">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  +880 1400-334422
                </a>
                <span className="navbar__drawer-address">
                  Sher-E-Bangla Nagar, Dhaka
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`navbar__backdrop ${isMobileMenuOpen ? 'navbar__backdrop--visible' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;
