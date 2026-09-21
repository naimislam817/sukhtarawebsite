import { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import '../../styles/admin.css';

const AdminBookingsPage = () => {
  const { bookings, updateBookingStatus } = useHotel();
  const [filter, setFilter] = useState('All');

  const statuses = ['All', 'Pending', 'Confirmed', 'Cancelled'];
  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  const statusClass = (status) => {
    if (status === 'Confirmed') return 'published';
    if (status === 'Cancelled') return 'draft';
    return 'draft';
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-subtitle">View and manage all guest booking requests.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {statuses.map(s => (
          <button
            key={s}
            className={`admin-action-btn${filter === s ? ' active' : ''}`}
            style={filter === s ? { background: '#12463d', color: '#fff', borderColor: '#12463d' } : {}}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest Details</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 24px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No {filter !== 'All' ? filter.toLowerCase() : ''} bookings found.
                </td>
              </tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 700, fontSize: '0.88rem', color: '#12463d' }}>{b.id}</td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>{b.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.email}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.phone}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>{b.roomPreference}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.numRooms} room(s), {b.numGuests} guest(s)</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>In: {b.checkIn}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>Out: {b.checkOut}</div>
                </td>
                <td>
                  <span className={`admin-status-pill ${statusClass(b.status)}`} style={{ cursor: 'default' }}>
                    <span className="admin-status-dot" />
                    {b.status}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    {b.status === 'Pending' && (
                      <>
                        <button className="admin-action-btn" style={{ color: '#16a34a' }}
                          onClick={() => updateBookingStatus(b.id, 'Confirmed')}>
                          Confirm
                        </button>
                        <button className="admin-action-btn delete"
                          onClick={() => updateBookingStatus(b.id, 'Cancelled')}>
                          Cancel
                        </button>
                      </>
                    )}
                    {b.status !== 'Pending' && (
                      <button className="admin-action-btn"
                        onClick={() => updateBookingStatus(b.id, 'Pending')}>
                        Reset
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminBookingsPage;
