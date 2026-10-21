import { useState, useRef } from 'react';
import { getValidRoomImage } from '../../utils/roomImages';
import '../../styles/admin.css';

const ROOM_CATEGORIES_LIST = [
  { id: 'standard-single', label: 'Standard Single' },
  { id: 'superior-king', label: 'Superior King' },
  { id: 'deluxe-king', label: 'Deluxe King' },
  { id: 'premium-deluxe-king', label: 'Premium Deluxe King' },
  { id: 'superior-twin', label: 'Superior Twin' },
  { id: 'deluxe-twin', label: 'Deluxe Twin' },
  { id: 'premium-triple', label: 'Premium Triple' },
];

const normalizeCat = (cat) => {
  if (!cat) return 'standard-single';
  const c = String(cat).toLowerCase().trim();
  if (c === 'single' || c === 'standard' || c === 'standard-single' || c === 'standard single') return 'standard-single';
  if (c === 'superior-king' || c === 'superior king') return 'superior-king';
  if (c === 'deluxe-king' || c === 'deluxe king' || c === 'king') return 'deluxe-king';
  if (c === 'premium-deluxe-king' || c === 'premium deluxe king') return 'premium-deluxe-king';
  if (c === 'superior-twin' || c === 'superior twin') return 'superior-twin';
  if (c === 'deluxe-twin' || c === 'deluxe twin' || c === 'twin') return 'deluxe-twin';
  if (c === 'premium-triple' || c === 'premium triple' || c === 'triple') return 'premium-triple';
  return cat;
};

const RoomModal = ({ room = null, onSave, onClose }) => {
  const isEdit = !!room;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: room?.name || '',
    price: room?.price || '',
    description: room?.description || '',
    status: room?.status || 'published',
    amenities: room?.amenities?.join(', ') || '',
    category: normalizeCat(room?.category),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    room?.image ? getValidRoomImage(room.image, room.name) : null
  );

  // Additional gallery images
  const [existingGallery, setExistingGallery] = useState(
    Array.isArray(room?.images) ? room.images : []
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const galleryInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    setNewGalleryFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewGalleryPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingGalleryImage = (indexToRemove) => {
    setExistingGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewGalleryImage = (indexToRemove) => {
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleFileSelect = (e) => {
    processImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const roomData = {
      ...form,
      price: Number(form.price) || 0,
      amenities: form.amenities
        ? form.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : [],
      images: existingGallery,
    };

    await onSave(roomData, imageFile, newGalleryFiles);
    setSaving(false);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{isEdit ? 'Edit Room' : 'Add New Room'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Row 1: Name + Price */}
            <div className="admin-modal-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Room Name</label>
                <input
                  type="text"
                  name="name"
                  className="admin-form-input"
                  placeholder="e.g., Deluxe King Room"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Price (BDT) / Night</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#64748b', fontSize: '0.95rem', fontWeight: 700, pointerEvents: 'none'
                  }}>৳</span>
                  <input
                    type="number"
                    name="price"
                    className="admin-form-input"
                    style={{ paddingLeft: 28 }}
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                name="description"
                className="admin-form-textarea"
                placeholder="Enter details about the room amenities, view, and features..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Row 2: Status + Category */}
            <div className="admin-modal-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select name="status" className="admin-form-select" value={form.status} onChange={handleChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Category (7 Hotel Categories)</label>
                <select name="category" className="admin-form-select" value={form.category} onChange={handleChange}>
                  {ROOM_CATEGORIES_LIST.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div className="admin-form-group">
              <label className="admin-form-label">Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                className="admin-form-input"
                placeholder="Wi-Fi, Air Conditioning, TV, Minibar..."
                value={form.amenities}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div className="admin-form-group">
              <label className="admin-form-label">Room Image</label>
              <div
                className={`admin-dropzone${dragOver ? ' dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="admin-dropzone-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </div>
                <p className="admin-dropzone-title">Click to upload or drag and drop</p>
                <p className="admin-dropzone-subtitle">SVG, PNG, JPG or GIF (max. 15MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </div>

              {imagePreview && (
                <div className="admin-preview-box">
                  <img src={imagePreview} alt="Preview" className="admin-preview-img" />
                  <button
                    type="button"
                    className="admin-preview-remove"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                  >✕</button>
                </div>
              )}
            </div>

            {/* Room Carousel / Additional Gallery Images */}
            <div className="admin-form-group" style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <label className="admin-form-label" style={{ marginBottom: 2 }}>
                    📸 Room Gallery & Carousel Images (Multiple)
                  </label>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                    Add extra photos (bathroom, view, balcony, bedding) to display in the interactive carousel.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-action-btn"
                  onClick={() => galleryInputRef.current?.click()}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 6,
                    background: '#12463d',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>+ Add Photos</span>
                </button>
              </div>

              <input
                type="file"
                ref={galleryInputRef}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleGallerySelect}
              />

              {/* Grid of gallery thumbnails */}
              {(existingGallery.length > 0 || newGalleryPreviews.length > 0) ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                  gap: 10,
                  marginTop: 12
                }}>
                  {existingGallery.map((imgUrl, idx) => (
                    <div key={`existing-${idx}`} style={{
                      position: 'relative',
                      borderRadius: 6,
                      overflow: 'hidden',
                      height: 75,
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}>
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(idx)}
                        style={{
                          position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.65)',
                          color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20,
                          cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Remove image"
                      >✕</button>
                    </div>
                  ))}

                  {newGalleryPreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} style={{
                      position: 'relative',
                      borderRadius: 6,
                      overflow: 'hidden',
                      height: 75,
                      border: '2px solid #22c55e',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}>
                      <img src={preview} alt="New upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryImage(idx)}
                        style={{
                          position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.85)',
                          color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20,
                          cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Remove"
                      >✕</button>
                      <span style={{
                        position: 'absolute', bottom: 2, left: 2, background: 'rgba(34,197,94,0.9)',
                        color: '#fff', fontSize: '9px', fontWeight: 700, padding: '1px 4px', borderRadius: 3
                      }}>NEW</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 8,
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    marginTop: 8
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    No extra gallery photos yet. Click <strong>+ Add Photos</strong> to select multiple pictures.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn-save" disabled={saving}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? 'Saving...' : 'Save Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
