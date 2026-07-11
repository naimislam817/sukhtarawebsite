import { useState, useEffect } from 'react';
import siteData from '../../data/siteData.json';
import '../../styles/whatsapp.css';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { whatsapp } = siteData.contact;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`whatsapp-btn ${isVisible ? 'whatsapp-btn--visible' : ''}`}
    >
      {/* Official WhatsApp logo SVG */}
      <svg
        className="whatsapp-btn__icon"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2C8.268 2 2 8.268 2 16c0 2.466.668 4.773 1.832 6.757L2 30l7.463-1.796A13.924 13.924 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 4.5C9.596 4.5 4.5 9.596 4.5 16c0 2.21.638 4.272 1.74 6.013l.245.39-1.04 3.8 3.91-1.022.38.228A11.456 11.456 0 0 0 16 27.5c6.404 0 11.5-5.096 11.5-11.5S22.404 4.5 16 4.5Zm-4.863 6.902c.197-.01.413-.008.607.002.233.012.463.068.665.497.248.524.791 1.926.86 2.065.07.14.115.302.023.487-.091.184-.137.299-.272.46-.136.162-.286.361-.407.484-.136.136-.277.284-.12.556.158.272.703 1.16 1.508 1.877.785.7 1.46 1.004 1.785 1.118.325.115.516.096.706-.058.19-.155.812-.948.96-1.22.148-.271.296-.226.498-.135.203.09 1.285.606 1.506.716.22.11.367.165.42.258.055.092.055.531-.127 1.044-.183.512-.96 1.02-1.377 1.078-.408.056-.784.08-2.646-.625-2.22-.847-3.673-3.068-3.783-3.21-.11-.14-.898-1.193-.898-2.276 0-1.083.568-1.614.77-1.836.201-.222.44-.278.587-.278Z"
          fill="currentColor"
        />
      </svg>
      <span className="whatsapp-btn__tooltip">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
