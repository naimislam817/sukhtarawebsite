import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import PageLoader from '../common/PageLoader';

const Layout = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen on every page change
    setIsLoading(true);
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }, 500);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [pathname]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [isLoading, pathname]);

  return (
    <div className="site-wrapper">
      <PageLoader isLoading={isLoading} />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;

