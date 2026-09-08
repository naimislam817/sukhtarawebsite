import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import siteData from '../../data/siteData.json';
import '../../styles/navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always close mobile menu and ensure scroll is unlocked on any route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  // Handle body scroll locking safely via CSS class
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
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
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar__menu ${isMobileMenuOpen ? 'navbar__menu--open' : ''}`}>
            {siteData.navLinks.map((link) => (
              link.dropdown ? (
                <div className="navbar__dropdown" key={link.label}>
                  <span className="navbar__link navbar__link--dropdown">
                    {link.label}
                    <svg className="navbar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
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
            <Link to="/book" className="navbar__book-btn" onClick={closeMobileMenu}>
              BOOK NOW
            </Link>
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
