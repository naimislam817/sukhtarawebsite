import { useRef, useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import '../../styles/admin.css';

const AdminRasunPage = () => {
  const { 
    rasun, 
    updateRasunMainImage, 
    updateRasunAmbianceImage, 
    updateRasunMenuPdf, 
    refreshData 
  } = useHotel();

  const [savingMain, setSavingMain] = useState(false);
  const [savingMenu, setSavingMenu] = useState(false);
  const [savingGalleryIndex, setSavingGalleryIndex] = useState(null);
  const [toast, setToast] = useState('');
  const [dragOverMain, setDragOverMain] = useState(false);
  const [dragOverMenu, setDragOverMenu] = useState(false);

  const mainInputRef = useRef(null);
  const menuInputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Main Image upload
  const handleMainImageChange = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('⚠️ Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setSavingMain(true);
    const url = await updateRasunMainImage(file);
    setSavingMain(false);
    if (url) {
      showToast('✓ Main Rasun Restaurant image updated successfully!');
    }
  };

  // Menu PDF upload
  const handleMenuPdfChange = async (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showToast('⚠️ Please upload a valid PDF document for the food menu.');
      return;
    }
    setSavingMenu(true);
    const url = await updateRasunMenuPdf(file);
    setSavingMenu(false);
    if (url) {
      showToast('✓ Rasun Food Menu PDF updated successfully!');
    }
  };

  // Ambiance gallery upload
  const handleAmbianceChange = async (index, file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('⚠️ Please upload a valid image file.');
      return;
    }
    setSavingGalleryIndex(index);
    const url = await updateRasunAmbianceImage(index, file);
    setSavingGalleryIndex(null);
    if (url) {
      showToast(`✓ Ambiance photo ${index + 1} updated successfully!`);
    }
  };

  const gallery = rasun?.ambianceGallery || [];
  // Ensure at least 5 slots are displayed for the 5 ambiance positions
  const ambianceSlots = [0, 1, 2, 3, 4].map(idx => ({
    index: idx,
    src: gallery[idx] || `/images/facilities/restaurant/gallery-${idx + 1}.jpg`
  }));

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#12463d',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: 10,
          zIndex: 99999,
          fontSize: '0.92rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid #c8956c'
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Rasun Restaurant Management</h1>
          <p className="admin-page-subtitle">
            Manage the main featured picture, our ambiance gallery, and the downloadable food menu PDF.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a
            href="/facilities/restaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-action-btn"
            style={{
              padding: '11px 18px',
              fontSize: '0.88rem',
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
            <span>Preview Restaurant Page</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>

      {/* SECTION 1: Main Rasun Image & Food Menu PDF */}
      <div className="admin-grid-2">
        {/* Main Image */}
        <div className="admin-media-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="admin-media-title">Main Rasun Image</h3>
            <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, color: '#64748b' }}>
              Primary Hero Display
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            This photo is shown prominently alongside the restaurant description and booking links.
          </p>

          <div className="admin-media-preview-lg">
            <img
              src={rasun?.mainImage || '/images/facilities/restraurant.jpg'}
              alt="Rasun Main"
              onError={(e) => { e.target.src = '/images/facilities/restraurant.jpg'; }}
            />
          </div>

          <div
            className={`admin-dropzone${dragOverMain ? ' dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverMain(true); }}
            onDragLeave={() => setDragOverMain(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverMain(false);
              handleMainImageChange(e.dataTransfer.files[0]);
            }}
            onClick={() => mainInputRef.current?.click()}
          >
            <div className="admin-dropzone-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <p className="admin-dropzone-title">
              {savingMain ? 'Uploading and saving...' : 'Click or drop new main photo here'}
            </p>
            <p className="admin-dropzone-subtitle">JPG, PNG or WEBP (recommended 1200x800)</p>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleMainImageChange(e.target.files[0])}
            />
          </div>
        </div>

        {/* Food Menu PDF */}
        <div className="admin-media-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="admin-media-title">Food Menu Document (PDF)</h3>
            <span style={{ fontSize: '0.78rem', background: '#ecfdf5', padding: '4px 8px', borderRadius: 6, color: '#047857', fontWeight: 600 }}>
              Live Menu PDF
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Uploaded PDF is downloaded when visitors click <strong>"FOOD MENU"</strong> on the restaurant page.
          </p>

          <div style={{
            minHeight: 180,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            gap: 12
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
            }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                Current Active Menu
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4, wordBreak: 'break-all' }}>
                {rasun?.menuPdf || '/menus/rasun-menu.pdf'}
              </div>
            </div>
            <a
              href={rasun?.menuPdf || '/menus/rasun-menu.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.82rem',
                color: '#12463d',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#ffffff',
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid #cbd5e1'
              }}
            >
              <span>View Current Menu</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          <div
            className={`admin-dropzone${dragOverMenu ? ' dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverMenu(true); }}
            onDragLeave={() => setDragOverMenu(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverMenu(false);
              handleMenuPdfChange(e.dataTransfer.files[0]);
            }}
            onClick={() => menuInputRef.current?.click()}
          >
            <div className="admin-dropzone-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="admin-dropzone-title">
              {savingMenu ? 'Uploading and replacing menu...' : 'Upload & replace with new menu (PDF)'}
            </p>
            <p className="admin-dropzone-subtitle">Accepts .PDF files up to 25MB</p>
            <input
              ref={menuInputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleMenuPdfChange(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Our Ambiance Gallery */}
      <div style={{ marginTop: 36 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            Our Ambiance Gallery (5 Photos)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            These 5 images form the decorative masonry ambiance grid on the Rasun Restaurant facility page. Click or drop any image to replace it individually.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20
        }}>
          {ambianceSlots.map((slot) => {
            const isSaving = savingGalleryIndex === slot.index;
            return (
              <AmbianceCard
                key={slot.index}
                index={slot.index}
                src={slot.src}
                saving={isSaving}
                onUpload={(file) => handleAmbianceChange(slot.index, file)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

// Ambiance Card Component
const AmbianceCard = ({ index, src, saving, onUpload }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="admin-media-card" style={{ padding: 18, gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#1e293b' }}>
          Ambiance Photo #{index + 1}
        </h4>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
          Slot {index + 1} of 5
        </span>
      </div>

      <div style={{
        position: 'relative',
        height: 180,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        background: '#f1f5f9'
      }}>
        <img
          src={src}
          alt={`Ambiance ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.src = '/images/facilities/restraurant.jpg'; }}
        />
        {saving && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(18, 70, 61, 0.75)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            gap: 8
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'adminSpin 1s linear infinite' }}>
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span>Saving...</span>
          </div>
        )}
      </div>

      <div
        className={`admin-dropzone${dragOver ? ' dragover' : ''}`}
        style={{ padding: '14px 12px' }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="admin-dropzone-icon" style={{ width: 32, height: 32, marginBottom: 6 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p className="admin-dropzone-title" style={{ fontSize: '0.82rem', margin: 0 }}>
          {saving ? 'Replacing...' : `Replace Photo #${index + 1}`}
        </p>
        <p className="admin-dropzone-subtitle" style={{ fontSize: '0.72rem', marginTop: 2 }}>
          JPG, PNG or WEBP
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => onUpload(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default AdminRasunPage;
