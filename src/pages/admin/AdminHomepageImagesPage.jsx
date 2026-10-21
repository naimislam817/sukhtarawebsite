import { useRef, useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import '../../styles/admin.css';

const ImageUploadCard = ({ label, currentSrc, onUpload, saving, caption, uploadError }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [newCaption, setNewCaption] = useState(caption || '');

  const processFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    // Show a local preview immediately so the admin sees the image
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

      {/* Upload error banner */}
      {uploadError && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '10px 14px', marginTop: 10, fontSize: '0.82rem', color: '#991b1b',
          lineHeight: 1.5
        }}>
          <strong>⚠ Upload failed:</strong> {uploadError}
          <br />
          <span style={{ opacity: 0.8 }}>
            Make sure the <code>hotel-images</code> bucket exists in Supabase Storage and is set to <strong>Public</strong>.
          </span>
        </div>
      )}

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
          {saving ? 'Uploading to cloud…' : 'Click or drag to replace image'}
        </p>
        <p className="admin-dropzone-subtitle">JPG, PNG or WEBP (max. 10 MB)</p>
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
    updateCta 
  } = useHotel();

  const [heroSaving, setHeroSaving] = useState(false);
  const [expSaving, setExpSaving] = useState(null);
  const [ctaSaving, setCtaSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', isError: false });
  const [heroUploadError, setHeroUploadError] = useState('');
  const [expUploadErrors, setExpUploadErrors] = useState({});

  // CTA form state
  const [ctaForm, setCtaForm] = useState({
    title: homepage?.cta?.title || 'Your Room at Shuktara is Waiting',
    subtitle: homepage?.cta?.subtitle || 'Book directly with our 24/7 reservation team\nfor preferential corporate rates and\ncomplimentary airport pickup.'
  });

  useEffect(() => {
    if (homepage?.cta) {
      setCtaForm({
        title: homepage.cta.title || 'Your Room at Shuktara is Waiting',
        subtitle: homepage.cta.subtitle || 'Book directly with our 24/7 reservation team\nfor preferential corporate rates and\ncomplimentary airport pickup.'
      });
    }
  }, [homepage?.cta]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast({ msg: '', isError: false }), isError ? 8000 : 3500);
  };

  const handleHeroUpload = async (file) => {
    setHeroSaving(true);
    setHeroUploadError('');
    try {
      await updateHero({}, file);
      showToast('✓ Hero image uploaded and saved! Visible on all devices.');
    } catch (err) {
      const msg = err.message || 'Upload failed.';
      setHeroUploadError(msg);
      showToast(`✗ ${msg}`, true);
    } finally {
      setHeroSaving(false);
    }
  };

  const handleExpUpload = async (index, file, caption) => {
    setExpSaving(index);
    setExpUploadErrors(prev => ({ ...prev, [index]: '' }));
    try {
      await updateSingleExperienceImage(index, file, caption);
      showToast(`✓ Experience image ${index + 1} uploaded and saved!`);
    } catch (err) {
      const msg = err.message || 'Upload failed.';
      setExpUploadErrors(prev => ({ ...prev, [index]: msg }));
      showToast(`✗ ${msg}`, true);
    } finally {
      setExpSaving(null);
    }
  };

  const handleCtaSave = async (e) => {
    e.preventDefault();
    setCtaSaving(true);
    await updateCta({
      title: ctaForm.title,
      subtitle: ctaForm.subtitle
    });
    setCtaSaving(false);
    showToast('✓ CTA banner settings updated!');
  };

  const experiences = homepage?.experiences?.images || [];

  return (
    <>
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 24, right: 24,
          background: toast.isError ? '#7f1d1d' : '#12463d',
          color: '#fff',
          padding: '14px 22px', borderRadius: 10, zIndex: 99999, fontSize: '0.88rem',
          fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: `1px solid ${toast.isError ? '#fca5a5' : '#c8956c'}`,
          display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 420, lineHeight: 1.5
        }}>
          {toast.msg}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage & Media Settings</h1>
          <p className="admin-page-subtitle">
            Update hero banner background, reservation CTA banner, and experiences gallery.
          </p>
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
            uploadError={heroUploadError}
          />
        </div>
      </div>

      {/* Reservation CTA Banner Section */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            🌟 Homepage Reservation Banner (CTA)
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Updates "Your Room at Shuktara is Waiting" section
          </span>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, maxWidth: 750 }}>
          <form onSubmit={handleCtaSave}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Banner Title
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={ctaForm.title}
                onChange={e => setCtaForm({ ...ctaForm, title: e.target.value })}
                placeholder="Your Room at Shuktara is Waiting"
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Banner Subtitle / Description (Line breaks supported)
              </label>
              <textarea
                className="admin-form-input"
                rows={3}
                value={ctaForm.subtitle}
                onChange={e => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
                placeholder="Book directly with our 24/7 reservation team&#10;for preferential corporate rates and&#10;complimentary airport pickup."
                required
                style={{ resize: 'vertical' }}
              />
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>
                💡 <strong>Dynamic Call & Email Buttons:</strong> The "Call Direct" phone number and Reservation Email buttons automatically pull their values from the primary phone and email configured in the Contact Information section above.
              </p>
            </div>

            <button
              type="submit"
              disabled={ctaSaving}
              className="admin-btn admin-btn--primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px' }}
            >
              {ctaSaving ? 'Saving Banner...' : 'Save Banner Changes'}
            </button>
          </form>
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
              uploadError={expUploadErrors[idx] || ''}
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
