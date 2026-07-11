import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import siteData from '../../data/siteData.json';
import '../../styles/navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeMobileMenu}>
          <img src={siteData.logo} alt={siteData.hotelName} />
        </Link>

        <button
          className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          style={{ display: window.innerWidth <= 900 ? 'flex' : 'none' }}
        >
          <span style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -8px)' : 'none' }}></span>
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
  );
};

export default Navbar;
