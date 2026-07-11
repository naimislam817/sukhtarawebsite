import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site-wrapper">
      <TopBar />
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

