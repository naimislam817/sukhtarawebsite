import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import PageLoader from '../common/PageLoader';

// Module-level flag: only show loader on the very first page load / hard refresh.
// Once it has fired once, subsequent SPA navigations skip it entirely.
let hasLoadedOnce = false;

const Layout = () => {
  const { pathname } = useLocation();
  // Start with loader active only if this is the very first mount
  const [isLoading, setIsLoading] = useState(!hasLoadedOnce);
  const isFirstMount = useRef(!hasLoadedOnce);

  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (isFirstMount.current) {
      // First page load — show the cinematic loader for 850ms then clear
      const timer = setTimeout(() => {
        setIsLoading(false);
        hasLoadedOnce = true;
        isFirstMount.current = false;
      }, 850);
      return () => clearTimeout(timer);
    }
    // Subsequent nav clicks — no loader, nothing to do
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

