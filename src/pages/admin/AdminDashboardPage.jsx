import { useHotel } from '../../context/HotelContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const StatCard = ({ value, label, icon, color }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12,
    padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}>
    <div style={{
      width: 50, height: 50, borderRadius: 12, background: color + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>{label}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { rooms, bookings } = useHotel();
  const navigate = useNavigate();

  const published = rooms.filter(r => r.status === 'published').length;
  const drafts = rooms.filter(r => r.status === 'draft').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening at Hotel Shuktara.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20, marginBottom: 36 }}>
        <StatCard
          value={rooms.length}
          label="Total Rooms"
          color="#12463d"
          icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V8a1 1 0 0 1 1-1h4V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18"/><path d="M3 22h18M9 22v-4h6v4"/></svg>}
        />
        <StatCard
          value={published}
          label="Published Rooms"
          color="#16a34a"
          icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard
          value={drafts}
          label="Draft Rooms"
          color="#f59e0b"
          icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
        />
        <StatCard
          value={pendingBookings}
          label="Pending Bookings"
          color="#f43f5e"
          icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
      </div>

      {/* Recent Bookings */}
      <div className="admin-table-card" style={{ marginBottom: 32 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Recent Bookings</h3>
          <button className="admin-action-btn" onClick={() => navigate('/admin/bookings')}>View All</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 5).map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{b.id}</td>
                <td>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b' }}>{b.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.email}</div>
                </td>
                <td style={{ fontSize: '0.88rem', color: '#475569' }}>{b.roomPreference}</td>
                <td style={{ fontSize: '0.88rem', color: '#475569' }}>{b.checkIn}</td>
                <td>
                  <span className={`admin-status-pill ${b.status === 'Confirmed' ? 'published' : b.status === 'Pending' ? 'draft' : 'draft'}`}
                    style={{ cursor: 'default' }}>
                    <span className="admin-status-dot" />
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px 24px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button className="admin-gold-btn" onClick={() => navigate('/admin/rooms')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Room
        </button>
        <button className="admin-action-btn" style={{ padding: '12px 18px', fontSize: '0.9rem' }} onClick={() => navigate('/admin/homepage-images')}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Update Homepage Images
        </button>
      </div>
    </>
  );
};

export default AdminDashboardPage;
