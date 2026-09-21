import { useRef, useState } from 'react';
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
  const { homepage, updateHero, updateSingleExperienceImage, uploadImage } = useHotel();
  const [heroSaving, setHeroSaving] = useState(false);
  const [expSaving, setExpSaving] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
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

  const experiences = homepage?.experiences?.images || [];

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, background: '#12463d', color: '#fff',
          padding: '12px 20px', borderRadius: 10, zIndex: 9999, fontSize: '0.9rem',
          fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          {toast}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Images</h1>
          <p className="admin-page-subtitle">Update the Hero banner and Unforgettable Experiences gallery.</p>
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
