import { useState, useRef, useCallback } from 'react';
import { useHotel } from '../../context/HotelContext';
import RoomModal from '../../components/admin/RoomModal';
import { getValidRoomImage } from '../../utils/roomImages';
import '../../styles/admin.css';


const ITEMS_PER_PAGE = 7;

const AdminRoomsPage = () => {
  const { rooms, addRoom, updateRoom, toggleRoomStatus, deleteRoom, reorderRooms, refreshData } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    // Dispatch local sync signal so any open site tabs pick it up immediately
    try {
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
    setIsRefreshing(false);
    setRefreshNotice(true);
    setTimeout(() => setRefreshNotice(false), 3000);
  };

  // ── Drag-and-drop state ────────────────────────────
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const isSearching = search.trim().length > 0;

  const filtered = rooms.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatCategory = (cat) => {
    if (!cat) return 'Standard Single';
    const c = String(cat).toLowerCase().trim();
    if (c === 'standard-single' || c === 'single' || c === 'standard') return 'Standard Single';
    if (c === 'superior-king') return 'Superior King';
    if (c === 'deluxe-king' || c === 'king') return 'Deluxe King';
    if (c === 'premium-deluxe-king') return 'Premium Deluxe King';
    if (c === 'superior-twin') return 'Superior Twin';
    if (c === 'deluxe-twin' || c === 'twin') return 'Deluxe Twin';
    if (c === 'premium-triple' || c === 'triple') return 'Premium Triple';
    return cat;
  };

  const handleSave = async (roomData, imageFile) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData, imageFile);
      } else {
        await addRoom(roomData, imageFile);
      }
      setShowModal(false);
      setEditingRoom(null);
      setRefreshNotice(true);
      setTimeout(() => setRefreshNotice(false), 3500);
    } catch (err) {
      console.error('Save room error:', err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteRoom(id);
    setConfirmDelete(null);
  };

  const formatPrice = (price) => {
    return `৳ ${Number(price).toLocaleString('en-BD')}`;
  };

  // ── Drag handlers (work on full rooms array, not paginated) ──
  const handleDragStart = useCallback((e, index) => {
    // index is the position in the FULL rooms array
    dragItem.current = index;
    setDraggingId(rooms[index]?.id);
    e.dataTransfer.effectAllowed = 'move';
    // Set a transparent drag image for cleaner look
    const el = e.target.closest('tr');
    if (el) {
      e.dataTransfer.setDragImage(el, 20, 20);
    }
  }, [rooms]);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverItem.current = index;
    setDragOverId(rooms[index]?.id);
  }, [rooms]);

  const handleDragEnd = useCallback(() => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const reordered = [...rooms];
      const [draggedRoom] = reordered.splice(dragItem.current, 1);
      reordered.splice(dragOverItem.current, 0, draggedRoom);

      // Assign new sort_order values
      const withOrder = reordered.map((room, i) => ({
        ...room,
        sort_order: i,
      }));

      reorderRooms(withOrder);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
    setDragOverId(null);
  }, [rooms, reorderRooms]);

  // Convert paginated index to full array index
  const toFullIndex = (paginatedIdx) => {
    if (isSearching) return null; // disable drag during search
    return (page - 1) * ITEMS_PER_PAGE + paginatedIdx;
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Rooms Management</h1>
          <p className="admin-page-subtitle">Manage your property's room inventory, pricing, and availability.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="admin-action-btn"
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: 8,
              cursor: isRefreshing ? 'wait' : 'pointer',
              background: '#ffffff',
              border: '1px solid #cbd5e1'
            }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh room data and sync order with the main website"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: isRefreshing ? 'adminSpin 1s linear infinite' : 'none'
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh & Sync'}
          </button>

          <button className="admin-gold-btn" onClick={() => { setEditingRoom(null); setShowModal(true); }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Room
          </button>
        </div>
      </div>

      {refreshNotice && (
        <div style={{
          padding: '10px 16px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 8,
          color: '#065f46',
          fontSize: '0.86rem',
          fontWeight: 500,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Room order synchronized! The public site will now display rooms in this exact order.
        </div>
      )}

      {/* Reorder hint */}
      {!isSearching && (
        <div className="admin-reorder-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 8 3 12 7 16" /><polyline points="17 8 21 12 17 16" />
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
          Drag the <strong>⠿</strong> handle to reorder rooms. The same order is shown on the public website.
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            className="admin-search-input"
            style={{ width: '100%', paddingLeft: 40, height: 42, borderRadius: 8 }}
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              {!isSearching && <th style={{ width: 44 }}></th>}
              <th>Image</th>
              <th>Room Details</th>
              <th>Price / Night</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={isSearching ? 5 : 6} style={{ textAlign: 'center', padding: '40px 24px', color: '#94a3b8', fontStyle: 'italic' }}>
                  {search ? 'No rooms match your search.' : 'No rooms yet. Click "+ Add New Room" to get started.'}
                </td>
              </tr>
            ) : paginated.map((room, pIdx) => {
              const fullIdx = toFullIndex(pIdx);
              const isDragging = room.id === draggingId;
              const isDragOver = room.id === dragOverId;

              return (
                <tr
                  key={room.id}
                  className={`${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                  draggable={!isSearching}
                  onDragStart={(e) => fullIdx !== null && handleDragStart(e, fullIdx)}
                  onDragOver={(e) => fullIdx !== null && handleDragOver(e, fullIdx)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={() => setDragOverId(null)}
                >
                  {/* Drag handle */}
                  {!isSearching && (
                    <td style={{ width: 44, paddingLeft: 8, paddingRight: 0 }}>
                      <div className="admin-drag-handle" title="Drag to reorder">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <circle cx="9" cy="5" r="1.5"/>
                          <circle cx="15" cy="5" r="1.5"/>
                          <circle cx="9" cy="12" r="1.5"/>
                          <circle cx="15" cy="12" r="1.5"/>
                          <circle cx="9" cy="19" r="1.5"/>
                          <circle cx="15" cy="19" r="1.5"/>
                        </svg>
                      </div>
                    </td>
                  )}

                  <td>
                    <img
                      src={getValidRoomImage(room.image, room.name)}
                      alt={room.name}
                      className="admin-room-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/rooms/deluxe-king.png';
                      }}
                    />
                  </td>

                  <td>
                    <div className="admin-room-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="admin-room-title">{room.name}</span>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: '#f1f5f9',
                          color: '#0f766e',
                          border: '1px solid #cbd5e1'
                        }}>
                          {formatCategory(room.category)}
                        </span>
                      </div>
                      <span className="admin-room-desc">{room.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-price-pill">{formatPrice(room.price)}</span>
                  </td>
                  <td>
                    <button
                      className={`admin-status-pill ${room.status === 'published' ? 'published' : 'draft'}`}
                      onClick={() => toggleRoomStatus(room.id)}
                      title="Click to toggle status"
                    >
                      <span className="admin-status-dot" />
                      {room.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => handleEdit(room)}>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button className="admin-action-btn delete" onClick={() => setConfirmDelete(room.id)}>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="admin-table-footer">
          <span>Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries</span>
          <div className="admin-pagination">
            <button className="admin-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`admin-page-btn${page === i + 1 ? ' active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button className="admin-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <RoomModal
          room={editingRoom}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingRoom(null); }}
        />
      )}

      {/* Delete Confirm Dialog */}
      {confirmDelete && (
        <div className="admin-modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" style={{ fontSize: '1.15rem' }}>Delete Room?</h3>
              <button className="admin-modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="admin-modal-body" style={{ paddingTop: 16 }}>
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                This action cannot be undone. The room will be permanently removed from the system.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="admin-btn-save"
                style={{ background: '#ef4444' }}
                onClick={() => handleDelete(confirmDelete)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRoomsPage;
