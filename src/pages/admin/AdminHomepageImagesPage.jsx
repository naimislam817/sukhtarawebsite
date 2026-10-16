import { useRef, useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import '../../styles/admin.css';

const ImageUploadCard = ({ label, currentSrc, onUpload, saving, caption }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [newCaption, setNewCaption] = useState(caption || '');

  const processFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    onUpload(file, newCaption);
  };

  return (
    <div className="admin-media-card">
      <h3 className="admin-media-title">{label}</h3>

      {/* Current image */}
      <div className="admin-media-preview-lg">
        <img
          src={preview || currentSrc}
          alt={label}
          onError={(e) => { e.target.src = '/images/hero/hero-bg.jpg'; }}
        />
      </div>

      {caption !== undefined && (
        <input
          type="text"
          className="admin-form-input"
          placeholder="Caption (optional)"
          value={newCaption}
          onChange={e => setNewCaption(e.target.value)}
        />
      )}

      {/* Dropzone */}
      <div
        className={`admin-dropzone${dragOver ? ' dragover' : ''}`}
        style={{ padding: '20px 16px' }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="admin-dropzone-icon" style={{ width: 36, height: 36, marginBottom: 8 }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p className="admin-dropzone-title" style={{ fontSize: '0.85rem' }}>
          {saving ? 'Uploading...' : 'Click or drag to replace image'}
        </p>
        <p className="admin-dropzone-subtitle">JPG, PNG or WEBP (max. 15MB)</p>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
      </div>
    </div>
  );
};

const AdminHomepageImagesPage = () => {
  const { 
    homepage, 
    updateHero, 
    updateSingleExperienceImage, 
    contact, 
    updateContact 
  } = useHotel();

  const [heroSaving, setHeroSaving] = useState(false);
  const [expSaving, setExpSaving] = useState(null);
  const [contactSaving, setContactSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Contact form state initialized from context
  const [contactForm, setContactForm] = useState({
    phone1: contact?.phones?.[0]?.display || contact?.phones?.[0]?.raw || '+880 1400-334422',
    phone2: contact?.phones?.[1]?.display || contact?.phones?.[1]?.raw || '+880 2-98888777',
    whatsapp: contact?.whatsapp?.display || contact?.whatsapp?.number || '+880 1400-334422',
    email1: contact?.emails?.[0]?.email || 'info@hotelshuktara.com',
    email2: contact?.emails?.[1]?.email || 'reservation@hotelshuktara.com',
    address: contact?.address || 'HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215'
  });

  // Keep contact form synced if context updates
  useEffect(() => {
    if (contact) {
      setContactForm({
        phone1: contact?.phones?.[0]?.display || contact?.phones?.[0]?.raw || '+880 1400-334422',
        phone2: contact?.phones?.[1]?.display || contact?.phones?.[1]?.raw || '+880 2-98888777',
        whatsapp: contact?.whatsapp?.display || contact?.whatsapp?.number || '+880 1400-334422',
        email1: contact?.emails?.[0]?.email || 'info@hotelshuktara.com',
        email2: contact?.emails?.[1]?.email || 'reservation@hotelshuktara.com',
        address: contact?.address || 'HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215'
      });
    }
  }, [contact]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleHeroUpload = async (file) => {
    setHeroSaving(true);
    await updateHero({}, file);
    setHeroSaving(false);
    showToast('✓ Hero image updated successfully!');
  };

  const handleExpUpload = async (index, file, caption) => {
    setExpSaving(index);
    await updateSingleExperienceImage(index, file, caption);
    setExpSaving(null);
    showToast(`✓ Experience image ${index + 1} updated!`);
  };

  const handleContactSave = async (e) => {
    e.preventDefault();
    setContactSaving(true);
    const updated = {
      ...contact,
      address: contactForm.address,
      phones: [
        {
          display: contactForm.phone1,
          raw: contactForm.phone1.replace(/[^0-9+]/g, ''),
          label: contact?.phones?.[0]?.label || 'Front Desk & Reservations'
        },
        {
          display: contactForm.phone2,
          raw: contactForm.phone2.replace(/[^0-9+]/g, ''),
          label: contact?.phones?.[1]?.label || 'Banquet & Events Desk'
        }
      ],
      emails: [
        {
          email: contactForm.email1,
          label: contact?.emails?.[0]?.label || 'General Inquiries'
        },
        {
          email: contactForm.email2,
          label: contact?.emails?.[1]?.label || 'Room Reservations'
        }
      ],
      whatsapp: {
        number: contactForm.whatsapp.replace(/[^0-9]/g, ''),
        display: contactForm.whatsapp,
        prefilledMessage: contact?.whatsapp?.prefilledMessage || "Hello, I'd like to inquire about a room."
      }
    };

    await updateContact(updated);
    setContactSaving(false);
    showToast('✓ Contact numbers and details saved! Updated site-wide (Header, Footer, Contact Us page).');
  };

  const experiences = homepage?.experiences?.images || [];

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, background: '#12463d', color: '#fff',
          padding: '14px 22px', borderRadius: 10, zIndex: 99999, fontSize: '0.92rem',
          fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', border: '1px solid #c8956c',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          {toast}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage & Site Settings</h1>
          <p className="admin-page-subtitle">
            Update hotel contact phone numbers, emails, hero banner, and experiences gallery.
          </p>
        </div>
        <div>
          <a
            href="/admin/contact"
            className="admin-action-btn"
            style={{
              padding: '10px 16px',
              fontSize: '0.86rem',
              fontWeight: 600,
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none'
            }}
          >
            <span>📞 Edit Footer & Contact Numbers ➔</span>
          </a>
        </div>
      </div>

      {/* SECTION 1: Hotel Contact Numbers & Details (Updates Whole Site) */}
      <div style={{ marginBottom: 40 }}>
        <div className="admin-media-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                📞 Hotel Contact Numbers & Info
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                Updating these fields instantly reflects throughout the whole website — including Navbar, TopBar, Footer, Floating WhatsApp, and the Contact Us page.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
              Site-Wide Sync
            </span>
          </div>

          <form onSubmit={handleContactSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Primary Phone (Reservations & Front Desk)
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={contactForm.phone1}
                onChange={e => setContactForm({ ...contactForm, phone1: e.target.value })}
                placeholder="+880 1400-334422"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Secondary Phone (Banquet & Events Desk)
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={contactForm.phone2}
                onChange={e => setContactForm({ ...contactForm, phone2: e.target.value })}
                placeholder="+880 2-98888777"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                WhatsApp Inquiries Number
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={contactForm.whatsapp}
                onChange={e => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                placeholder="+880 1400-334422"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Primary Email
              </label>
              <input
                type="email"
                className="admin-form-input"
                value={contactForm.email1}
                onChange={e => setContactForm({ ...contactForm, email1: e.target.value })}
                placeholder="info@hotelshuktara.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Reservation Email
              </label>
              <input
                type="email"
                className="admin-form-input"
                value={contactForm.email2}
                onChange={e => setContactForm({ ...contactForm, email2: e.target.value })}
                placeholder="reservation@hotelshuktara.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Hotel Physical Address
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={contactForm.address}
                onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                placeholder="HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215"
                required
              />
            </div>

            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="submit"
                disabled={contactSaving}
                className="admin-action-btn"
                style={{
                  background: 'linear-gradient(135deg, #FFE8B6 0%, #DFA04E 50%, #B77322 100%)',
                  color: '#12352E',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  padding: '12px 28px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: contactSaving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(223, 160, 78, 0.35)'
                }}
              >
                {contactSaving ? (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'adminSpin 1s linear infinite' }}>
                      <polyline points="23 4 23 10 17 10"/>
                      <polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    <span>Save Contact Information</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          🖼️ Hero Banner Image
        </h2>
        <div style={{ maxWidth: 600 }}>
          <ImageUploadCard
            label="Main Hero Background"
            currentSrc={homepage?.hero?.backgroundImage}
            onUpload={handleHeroUpload}
            saving={heroSaving}
          />
        </div>
      </div>

      {/* Experiences Section */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          ✨ Unforgettable Experiences Gallery
        </h2>
        <div className="admin-grid-2">
          {experiences.map((img, idx) => (
            <ImageUploadCard
              key={img.id || idx}
              label={`Experience ${idx + 1} — ${img.alt || img.caption || ''}`}
              currentSrc={img.src}
              caption={img.caption || ''}
              onUpload={(file, caption) => handleExpUpload(idx, file, caption)}
              saving={expSaving === idx}
            />
          ))}
          {experiences.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: 40, fontStyle: 'italic' }}>
              No experience images found. Ensure the backend server is running.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminHomepageImagesPage;
