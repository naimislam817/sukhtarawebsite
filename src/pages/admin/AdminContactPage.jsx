import { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { contactConfig } from '../../data/contactConfig';
import '../../styles/admin.css';

const AdminContactPage = () => {
  const { contact, updateContact } = useHotel();

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Form fields state
  const [form, setForm] = useState({
    // Primary & Secondary Phone Numbers (used on Contact Us & Footer)
    phone1: '',
    phone1Label: 'Front Desk & Reservations',
    phone2: '',
    phone2Label: 'Banquet & Events Desk',
    
    // Optional separate footer override
    customFooterPhones: false,
    footerPhone1: '',
    footerPhone2: '',

    // WhatsApp
    whatsapp: '',
    whatsappMsg: 'Hello, I\'d like to inquire about a room.',

    // Emails
    email1: '',
    email2: '',

    // Address
    address: ''
  });

  // Sync form with context whenever contact changes
  useEffect(() => {
    if (contact) {
      const p1 = contact.phones?.[0]?.display || contact.phones?.[0]?.raw || contact.phones?.[0] || '+880 1400-334422';
      const p2 = contact.phones?.[1]?.display || contact.phones?.[1]?.raw || contact.phones?.[1] || '+880 2-98888777';
      const fp1 = contact.footerPhones?.[0] || '';
      const fp2 = contact.footerPhones?.[1] || '';

      setForm({
        phone1: p1,
        phone1Label: contact.phones?.[0]?.label || 'Front Desk & Reservations',
        phone2: p2,
        phone2Label: contact.phones?.[1]?.label || 'Banquet & Events Desk',

        customFooterPhones: !!(contact.footerPhones && contact.footerPhones.length > 0 && (fp1 || fp2)),
        footerPhone1: fp1 || p1,
        footerPhone2: fp2 || p2,

        whatsapp: contact.whatsapp?.display || contact.whatsapp?.number || '+880 1400-334422',
        whatsappMsg: contact.whatsapp?.prefilledMessage || 'Hello, I\'d like to inquire about a room.',

        email1: contact.emails?.[0]?.email || contact.emails?.[0] || 'info@hotelshuktara.com',
        email2: contact.emails?.[1]?.email || contact.emails?.[1] || 'reservation@hotelshuktara.com',

        address: contact.address || 'HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215'
      });
    }
  }, [contact]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updated = {
      ...contact,
      address: form.address.trim(),
      phones: [
        {
          display: form.phone1.trim(),
          raw: form.phone1.replace(/[^0-9+]/g, ''),
          label: form.phone1Label.trim() || 'Front Desk & Reservations'
        },
        {
          display: form.phone2.trim(),
          raw: form.phone2.replace(/[^0-9+]/g, ''),
          label: form.phone2Label.trim() || 'Banquet & Events Desk'
        }
      ],
      footerPhones: form.customFooterPhones
        ? [form.footerPhone1.trim(), form.footerPhone2.trim()].filter(Boolean)
        : [],
      emails: [
        {
          email: form.email1.trim(),
          label: 'General Inquiries'
        },
        {
          email: form.email2.trim(),
          label: 'Room Reservations'
        }
      ],
      whatsapp: {
        number: form.whatsapp.replace(/[^0-9]/g, ''),
        display: form.whatsapp.trim(),
        prefilledMessage: form.whatsappMsg.trim()
      }
    };

    await updateContact(updated);
    setSaving(false);
    showToast('✓ Phone numbers & contact info updated! Synced live to Footer and Contact Us page.');
  };

  const activeFooterP1 = form.customFooterPhones ? form.footerPhone1 : form.phone1;
  const activeFooterP2 = form.customFooterPhones ? form.footerPhone2 : form.phone2;

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#12463d',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: 10,
          zIndex: 99999,
          fontSize: '0.92rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid #c8956c',
          fontWeight: 600
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Us & Footer Settings</h1>
          <p className="admin-page-subtitle">
            Edit phone numbers, email addresses, WhatsApp, and location details shown in the site Footer and Contact Us page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
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
            <span>Preview Contact Page ↗</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
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
            <span>Preview Footer on Home ↗</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28, marginBottom: 36 }}>
          
          {/* ── CARD 1: PHONE NUMBERS (PRIMARY & SECONDARY) ── */}
          <div className="admin-media-card" style={{ padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#ecfdf5',
                  color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <h3 className="admin-media-title" style={{ margin: 0 }}>
                  Phone Numbers (Footer & Contact Us)
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#047857', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>
                Live Everywhere
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px' }}>
              These numbers appear in the <strong>Footer on all pages</strong>, on the <strong>Contact Us</strong> page cards, and in the <strong>Mobile Sticky Bar</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {/* Phone 1 */}
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                    Primary Phone Number *
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Main Call Link</span>
                </div>
                <input
                  type="text"
                  className="admin-form-input"
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                  value={form.phone1}
                  onChange={e => setForm({ ...form, phone1: e.target.value })}
                  placeholder="+880 1400-334422"
                  required
                />
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                    Label / Description (e.g. Front Desk & Reservations)
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.phone1Label}
                    onChange={e => setForm({ ...form, phone1Label: e.target.value })}
                    placeholder="Front Desk & Reservations"
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 6 }}>
                  Renders as: <code style={{ color: '#047857' }}>tel:{form.phone1.replace(/[^0-9+]/g, '')}</code>
                </div>
              </div>

              {/* Phone 2 */}
              <div style={{ background: '#f8fafc', padding: 18, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                    Secondary Phone Number *
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Support / Banquet</span>
                </div>
                <input
                  type="text"
                  className="admin-form-input"
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                  value={form.phone2}
                  onChange={e => setForm({ ...form, phone2: e.target.value })}
                  placeholder="+880 2-98888777"
                  required
                />
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>
                    Label / Description (e.g. Banquet & Events Desk)
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.phone2Label}
                    onChange={e => setForm({ ...form, phone2Label: e.target.value })}
                    placeholder="Banquet & Events Desk"
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 6 }}>
                  Renders as: <code style={{ color: '#047857' }}>tel:{form.phone2.replace(/[^0-9+]/g, '')}</code>
                </div>
              </div>
            </div>

            {/* Optional Separate Footer Customization Toggle */}
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={form.customFooterPhones}
                  onChange={e => setForm({ ...form, customFooterPhones: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#12352E' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Use different phone numbers specifically in the Footer (Optional)
                </span>
              </label>

              {form.customFooterPhones && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 14 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      Footer Phone Line 1
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.footerPhone1}
                      onChange={e => setForm({ ...form, footerPhone1: e.target.value })}
                      placeholder="+880 1400-334422"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      Footer Phone Line 2
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={form.footerPhone2}
                      onChange={e => setForm({ ...form, footerPhone2: e.target.value })}
                      placeholder="+880 2-98888777"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CARD 2: WHATSAPP, EMAILS & ADDRESS ── */}
          <div className="admin-media-card" style={{ padding: 26 }}>
            <h3 className="admin-media-title" style={{ marginBottom: 6 }}>
              WhatsApp, Emails & Physical Address
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px' }}>
              Syncs with the Contact Us page, footer items, and floating WhatsApp widget.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* WhatsApp */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  WhatsApp Inquiries Number
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+880 1400-334422"
                  required
                />
              </div>

              {/* WhatsApp Prefilled Message */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  WhatsApp Default Message
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={form.whatsappMsg}
                  onChange={e => setForm({ ...form, whatsappMsg: e.target.value })}
                  placeholder="Hello, I'd like to inquire about a room."
                />
              </div>

              {/* Email 1 */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Primary Email (General Inquiries)
                </label>
                <input
                  type="email"
                  className="admin-form-input"
                  value={form.email1}
                  onChange={e => setForm({ ...form, email1: e.target.value })}
                  placeholder="info@hotelshuktara.com"
                  required
                />
              </div>

              {/* Email 2 */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Reservations Email (Receives Form Submissions)
                </label>
                <input
                  type="email"
                  className="admin-form-input"
                  value={form.email2}
                  onChange={e => setForm({ ...form, email2: e.target.value })}
                  placeholder="reservation@hotelshuktara.com"
                  required
                />
              </div>

              {/* Address */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Full Physical Address
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215"
                  required
                />
              </div>
            </div>
          </div>

          {/* ── CARD 3: LIVE PREVIEW OF FOOTER & CONTACT US ── */}
          <div className="admin-media-card" style={{ padding: 26, background: '#f8fafc' }}>
            <h3 className="admin-media-title" style={{ marginBottom: 6 }}>
              👀 Live Output Preview
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px' }}>
              Here is how your phone numbers and details will appear to visitors on the live site right after saving:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              
              {/* Footer Preview */}
              <div style={{
                background: '#0C1311',
                color: '#ffffff',
                padding: 22,
                borderRadius: 12,
                border: '1px solid rgba(223, 160, 78, 0.3)'
              }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: 1, color: '#F4C46C', fontWeight: 700, marginBottom: 12 }}>
                  Site Footer &bull; Contact Column
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: '#F4C46C' }}>📍</span>
                    <span style={{ opacity: 0.85 }}>{form.address || 'Address'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: '#F4C46C' }}>✉️</span>
                    <span style={{ opacity: 0.85 }}>
                      {form.email1}<br />{form.email2}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: '#F4C46C' }}>📞</span>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                      {activeFooterP1 || 'Primary Phone'}<br />
                      {activeFooterP2 || 'Secondary Phone'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Us Card Preview */}
              <div style={{
                background: '#ffffff',
                padding: 22,
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: 1, color: '#047857', fontWeight: 700, marginBottom: 12 }}>
                  Contact Us Page &bull; Call Directly Card
                </div>
                
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF6EC', color: '#12352E', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📞
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#12352E', fontFamily: 'serif' }}>
                    Call Us Directly
                  </h4>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#12352E' }}>
                    {form.phone1 || 'Primary Phone'}
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#12352E', marginTop: 4 }}>
                    {form.phone2 || 'Secondary Phone'}
                  </div>
                  <span style={{ display: 'inline-block', marginTop: 8, background: '#ecfdf5', color: '#047857', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
                    24/7 Front Desk
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ── SAVE BUTTON ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-action-btn"
              style={{
                background: 'linear-gradient(135deg, #FFE8B6 0%, #DFA04E 50%, #B77322 100%)',
                color: '#12352E',
                fontWeight: 700,
                fontSize: '0.96rem',
                padding: '14px 34px',
                borderRadius: 10,
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 6px 18px rgba(223, 160, 78, 0.4)'
              }}
            >
              {saving ? (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'adminSpin 1s linear infinite' }}>
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  <span>Save Phone Numbers & Contact Details</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </>
  );
};

export default AdminContactPage;
