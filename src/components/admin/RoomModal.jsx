import { useState, useRef } from 'react';
import '../../styles/admin.css';

const RoomModal = ({ room = null, onSave, onClose }) => {
  const isEdit = !!room;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: room?.name || '',
    price: room?.price || '',
    description: room?.description || '',
    status: room?.status || 'published',
    amenities: room?.amenities?.join(', ') || '',
    category: room?.category || 'standard',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(room?.image || null);
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
    };

    await onSave(roomData, imageFile);
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
                <label className="admin-form-label">Category</label>
                <select name="category" className="admin-form-select" value={form.category} onChange={handleChange}>
                  <option value="single">Single</option>
                  <option value="twin">Twin</option>
                  <option value="king">King</option>
                  <option value="triple">Triple</option>
                  <option value="standard">Standard</option>
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
