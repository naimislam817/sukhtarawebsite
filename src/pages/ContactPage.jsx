import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { contactConfig } from '../data/contactConfig';
import '../styles/contact.css';

const ContactPage = () => {
  const { contact: liveContact } = useHotel();
  const contact = liveContact || contactConfig;

  // SEO & Schema.org JSON-LD injection
  useEffect(() => {
    // 1. Page Title
    const originalTitle = document.title;
    document.title = 'Contact Hotel Shuktara | Farmgate, Dhaka';

    // 2. Meta tags helper
    const updateOrCreateMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    const metaDesc = updateOrCreateMeta(
      'name',
      'description',
      'Get in touch with Hotel Shuktara (Pvt.) Ltd. in Farmgate, Dhaka. Call, email, or visit us for room reservations, banquet bookings, or event inquiries.'
    );
    const ogTitle = updateOrCreateMeta('property', 'og:title', 'Contact Hotel Shuktara | Farmgate, Dhaka');
    const ogDesc = updateOrCreateMeta(
      'property',
      'og:description',
      'Contact Hotel Shuktara in Farmgate, Dhaka. 24/7 Front Desk, instant room bookings, and banquet reservations.'
    );
    const ogUrl = updateOrCreateMeta('property', 'og:url', window.location.href);
    const ogType = updateOrCreateMeta('property', 'og:type', 'website');

    // 3. Schema.org Hotel JSON-LD
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'shuktara-hotel-contact-jsonld';
    jsonLdScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: contact.hotelName || 'Hotel Shuktara (Pvt.) Ltd.',
      description: 'A modern, secure residential hotel located in Farmgate, Sher-E-Bangla Nagar, Dhaka.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.address || 'HH 20/A, Indira Road, Sher-E-Bangla Nagar',
        addressLocality: contact.city || 'Dhaka',
        postalCode: '1215',
        addressCountry: contact.country || 'Bangladesh'
      },
      telephone: contact.phones?.[0]?.display || contact.phones?.[0]?.raw || '+8801400334422',
      email: contact.emails?.[0]?.email || 'info@hotelshuktara.com',
      url: window.location.origin,
      checkinTime: contact.hours?.checkIn || '14:00',
      checkoutTime: contact.hours?.checkOut || '12:00',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        }
      ]
    });
    document.head.appendChild(jsonLdScript);

    return () => {
      document.title = originalTitle;
      const script = document.getElementById('shuktara-hotel-contact-jsonld');
      if (script) script.remove();
    };
  }, [contact]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: contactConfig.formSubjects?.[0] || 'Room Booking',
    checkIn: '',
    checkOut: '',
    message: '',
    botcheck: '' // Honeypot field
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const phone1 = contact.phones?.[0]?.display || contact.phones?.[0]?.raw || '+880 1400-334422';
  const phone1Raw = contact.phones?.[0]?.raw || phone1.replace(/[^0-9+]/g, '');
  const phone2 = contact.phones?.[1]?.display || contact.phones?.[1]?.raw || '+880 2-98888777';
  const phone2Raw = contact.phones?.[1]?.raw || phone2.replace(/[^0-9+]/g, '');

  const email1 = contact.emails?.[0]?.email || 'info@hotelshuktara.com';
  const email2 = contact.emails?.[1]?.email || 'reservation@hotelshuktara.com';

  const whatsappNum = contact.whatsapp?.number || '8801400334422';
  const whatsappMsg = encodeURIComponent(
    contact.whatsapp?.prefilledMessage || 'Hello, I would like to inquire about a room.'
  );

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Please provide your phone number.';
    } else if (!/^[0-9+\s\-()]{7,20}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter your message or inquiry.';
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit contact message.');
      }

      setSubmitSuccess(data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: contactConfig.formSubjects?.[0] || 'Room Booking',
        checkIn: '',
        checkOut: '',
        message: '',
        botcheck: ''
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitError(err.message || 'Something went wrong while sending your message. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* ── SECTION 1: HERO BANNER (~40vh) ────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero__overlay" aria-hidden="true" />
        <div className="contact-hero__glow" aria-hidden="true" />
        <div className="contact-hero__container">
          <nav className="contact-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="contact-hero__breadcrumb-link">Home</Link>
            <span className="contact-hero__breadcrumb-sep">&gt;</span>
            <span className="contact-hero__breadcrumb-current">Contact</span>
          </nav>
          <h1 className="contact-hero__title">Contact Us</h1>
          <p className="contact-hero__subtitle">
            We’d love to hear from you. Reach out to our hospitality team anytime.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ──────────────────────────────── */}
      <div className="contact-page">
        <div className="contact-page__container">
          
          {/* ── SECTION 2: QUICK-ACTION CARDS (3 across) ───── */}
          <section className="contact-quick" aria-label="Quick contact methods">
            {/* Card 1: Call Us */}
            <div className="contact-quick__card">
              <div className="contact-quick__icon-wrap">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h2 className="contact-quick__title">Call Us Directly</h2>
              <p className="contact-quick__subtitle">Available 24/7 for instant bookings</p>
              <a href={`tel:${phone1Raw}`} className="contact-quick__link">
                {phone1}
              </a>
              <a href={`tel:${phone2Raw}`} className="contact-quick__link">
                {phone2}
              </a>
              <span className="contact-quick__badge">
                <span className="contact-quick__badge-dot" />
                24/7 Front Desk
              </span>
            </div>

            {/* Card 2: Email Us */}
            <div className="contact-quick__card">
              <div className="contact-quick__icon-wrap">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="contact-quick__title">Email Support</h2>
              <p className="contact-quick__subtitle">Send inquiries or corporate RFPs</p>
              <a href={`mailto:${email1}`} className="contact-quick__link">
                {email1}
              </a>
              <a href={`mailto:${email2}`} className="contact-quick__link">
                {email2}
              </a>
              <span className="contact-quick__badge" style={{ background: '#f0fdf4', color: '#166534' }}>
                Quick Response
              </span>
            </div>

            {/* Card 3: WhatsApp Inquiry */}
            <div className="contact-quick__card">
              <div className="contact-quick__icon-wrap" style={{ color: '#25D366' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <h2 className="contact-quick__title">WhatsApp Chat</h2>
              <p className="contact-quick__subtitle">Instant concierge chat & quotes</p>
              <a
                href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-quick__link"
                style={{ fontWeight: 700 }}
              >
                Chat on WhatsApp ↗
              </a>
              <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
                {contact.whatsapp?.display || phone1}
              </span>
              <span className="contact-quick__badge" style={{ background: '#ecfdf5', color: '#047857' }}>
                Live Messaging
              </span>
            </div>
          </section>

          {/* ── SECTION 3: TWO-COLUMN (FORM + INFO CARD) ────── */}
          <section className="contact-main" aria-label="Send a message and location details">
            {/* Left: Contact Form */}
            <div className="contact-form-card">
              <div className="contact-form-card__header">
                <span className="contact-form-card__tag">Get In Touch</span>
                <h2 className="contact-form-card__title">Send Us a Message</h2>
                <p className="contact-form-card__desc">
                  Have a question about room reservations, corporate events, or our dining facilities? Fill out the form below.
                </p>
              </div>

              {/* Status Announcements (Aria-Live) */}
              <div aria-live="polite" role="status">
                {submitSuccess && (
                  <div className="contact-form__alert contact-form__alert--success">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div>
                      <strong>Message Sent Successfully!</strong>
                      <div style={{ marginTop: 2 }}>{submitSuccess}</div>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="contact-form__alert contact-form__alert--error">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      <strong>Failed to Send</strong>
                      <div style={{ marginTop: 2 }}>{submitError}</div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {/* Honeypot Spam Protection (Hidden from real users) */}
                <input
                  type="text"
                  name="botcheck"
                  value={formData.botcheck}
                  onChange={handleInputChange}
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Name */}
                <div className="contact-form__group">
                  <label htmlFor="contact-name" className="contact-form__label">
                    <span>Full Name <span className="contact-form__required">*</span></span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className={`contact-form__input ${formErrors.name ? 'contact-form__input--error' : ''}`}
                    placeholder="e.g. Rafiqul Islam"
                    value={formData.name}
                    onChange={handleInputChange}
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                  />
                  {formErrors.name && (
                    <span id="contact-name-error" className="contact-form__error" role="alert">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="contact-form__row-2">
                  <div className="contact-form__group">
                    <label htmlFor="contact-email" className="contact-form__label">
                      <span>Email Address <span className="contact-form__required">*</span></span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      className={`contact-form__input ${formErrors.email ? 'contact-form__input--error' : ''}`}
                      placeholder="e.g. rafiq@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.email}
                      aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                    />
                    {formErrors.email && (
                      <span id="contact-email-error" className="contact-form__error" role="alert">
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div className="contact-form__group">
                    <label htmlFor="contact-phone" className="contact-form__label">
                      <span>Phone Number <span className="contact-form__required">*</span></span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      className={`contact-form__input ${formErrors.phone ? 'contact-form__input--error' : ''}`}
                      placeholder="+880 1712-345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.phone}
                      aria-describedby={formErrors.phone ? 'contact-phone-error' : undefined}
                    />
                    {formErrors.phone && (
                      <span id="contact-phone-error" className="contact-form__error" role="alert">
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="contact-form__group">
                  <label htmlFor="contact-subject" className="contact-form__label">
                    <span>Subject / Inquiring About</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="contact-form__select"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    {(contactConfig.formSubjects || [
                      'Room Booking',
                      'Banquet/Events',
                      'Airport Transfer',
                      'General Inquiry'
                    ]).map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Check-in & Check-out Dates */}
                <div className="contact-form__row-2">
                  <div className="contact-form__group">
                    <label htmlFor="contact-checkin" className="contact-form__label">
                      <span>Check-In Date</span>
                      <span className="contact-form__optional">(Optional)</span>
                    </label>
                    <input
                      id="contact-checkin"
                      type="date"
                      name="checkIn"
                      className="contact-form__input"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="contact-form__group">
                    <label htmlFor="contact-checkout" className="contact-form__label">
                      <span>Check-Out Date</span>
                      <span className="contact-form__optional">(Optional)</span>
                    </label>
                    <input
                      id="contact-checkout"
                      type="date"
                      name="checkOut"
                      className="contact-form__input"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="contact-form__group">
                  <label htmlFor="contact-message" className="contact-form__label">
                    <span>Your Message <span className="contact-form__required">*</span></span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    className={`contact-form__textarea ${formErrors.message ? 'contact-form__textarea--error' : ''}`}
                    placeholder="Tell us about your requirements, dates, special event, or questions..."
                    value={formData.message}
                    onChange={handleInputChange}
                    aria-required="true"
                    aria-invalid={!!formErrors.message}
                    aria-describedby={formErrors.message ? 'contact-message-error' : undefined}
                  />
                  {formErrors.message && (
                    <span id="contact-message-error" className="contact-form__error" role="alert">
                      {formErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="contact-form__submit"
                >
                  {isSubmitting ? (
                    <>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'adminSpin 1s linear infinite' }}>
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Info Card */}
            <aside className="contact-info-card" aria-label="Hotel address and hours">
              <div>
                <h3 className="contact-info-card__title">Hotel Information</h3>
                <p className="contact-info-card__subtitle">
                  {contact.hotelName || 'Hotel Shuktara (Pvt.) Ltd.'}
                </p>

                <div className="contact-info-card__list">
                  {/* Address */}
                  <div className="contact-info-card__item">
                    <div className="contact-info-card__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <p className="contact-info-card__label">Location Address</p>
                      <p className="contact-info-card__val">
                        {contact.address || 'HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215'}
                      </p>
                    </div>
                  </div>

                  {/* Front Desk Hours */}
                  <div className="contact-info-card__item">
                    <div className="contact-info-card__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div>
                      <p className="contact-info-card__label">Front Desk Service</p>
                      <p className="contact-info-card__val">
                        Open 24 Hours / 7 Days
                        <span className="contact-info-card__badge">24/7</span>
                      </p>
                    </div>
                  </div>

                  {/* Check-in / Check-out */}
                  <div className="contact-info-card__item">
                    <div className="contact-info-card__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <p className="contact-info-card__label">Check-In / Check-Out</p>
                      <p className="contact-info-card__val">
                        Check-in: <strong>{contact.hours?.checkIn || '2:00 PM'}</strong><br />
                        Check-out: <strong>{contact.hours?.checkOut || '12:00 PM'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact */}
                  <div className="contact-info-card__item">
                    <div className="contact-info-card__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="contact-info-card__label">Direct Inquiries</p>
                      <p className="contact-info-card__val">
                        {phone1}<br />
                        {email1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div>
                <a
                  href={contact.map?.directionsUrl || 'https://www.google.com/maps/dir/?api=1&destination=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-card__direction-btn"
                >
                  <span>Get Directions</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </a>
              </div>
            </aside>
          </section>

          {/* ── SECTION 4: EMBEDDED GOOGLE MAP ──────────────── */}
          <section className="contact-map-section" aria-label="Interactive Google Map and nearby locations">
            <div className="contact-map-section__header">
              <span className="contact-map-section__tag">Prime Central Location</span>
              <h2 className="contact-map-section__title">Find Us in Dhaka</h2>
              <p className="contact-map-section__desc">
                Located on Indira Road in Farmgate, Dhaka — effortless connectivity to metro transit, government offices, airport expressways, and diplomatic zones.
              </p>
            </div>

            <div className="contact-map__wrapper">
              <iframe
                src="https://www.google.com/maps?q=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Shuktara location"
                className="contact-map__iframe"
              />
            </div>

            {/* Nearby Distances Chips (Configurable) */}
            <div className="contact-map__chips">
              {(contact.nearbyDistances || contactConfig.nearbyDistances).map((chip, idx) => (
                <div key={idx} className="contact-map__chip">
                  <div className="contact-map__chip-icon" aria-hidden="true">
                    {chip.icon === 'metro' ? (
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="3" width="16" height="16" rx="2"/>
                        <line x1="4" y1="11" x2="20" y2="11"/>
                        <line x1="12" y1="3" x2="12" y2="11"/>
                        <circle cx="8" cy="15" r="1.5"/>
                        <circle cx="16" cy="15" r="1.5"/>
                        <path d="M8 19l-2 3M16 19l2 3"/>
                      </svg>
                    ) : chip.icon === 'plane' ? (
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="contact-map__chip-title">{chip.title}</p>
                    <p className="contact-map__chip-dist">{chip.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 5: SOCIAL LINKS ROW ─────────────────── */}
          <section className="contact-social" aria-label="Connect on social networks">
            <h3 className="contact-social__title">Stay Connected</h3>
            <p className="contact-social__desc">
              Follow Hotel Shuktara for the latest promotions, dining specials, and hospitality updates.
            </p>
            <div className="contact-social__links">
              {/* Facebook */}
              <a
                href={contactConfig.socialLinks?.[0]?.url || 'https://facebook.com/hotelshuktara'}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social__btn"
                aria-label="Follow us on Facebook"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href={contactConfig.socialLinks?.[1]?.url || 'https://twitter.com/hotelshuktara'}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social__btn"
                aria-label="Follow us on Twitter / X"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={contactConfig.socialLinks?.[2]?.url || 'https://instagram.com/hotelshuktara'}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social__btn"
                aria-label="Follow us on Instagram"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={contactConfig.socialLinks?.[3]?.url || 'https://youtube.com/@hotelshuktara'}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social__btn"
                aria-label="Watch our videos on YouTube"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </section>

        </div>
      </div>

      {/* ── EXTRAS: STICKY MOBILE BOTTOM BAR ───────────────── */}
      <div className="contact-sticky-bar" aria-label="Mobile quick actions">
        <a
          href={`tel:${phone1Raw}`}
          className="contact-sticky-bar__btn contact-sticky-bar__btn--call"
          aria-label="Call front desk directly"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-sticky-bar__btn contact-sticky-bar__btn--whatsapp"
          aria-label="Message on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        <Link
          to="/book"
          className="contact-sticky-bar__btn contact-sticky-bar__btn--book"
          aria-label="Book a room now"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Book Now</span>
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
