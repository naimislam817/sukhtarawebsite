import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotel } from '../../context/HotelContext';
import '../../styles/admin.css';

const NavIcon = ({ type }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    images: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    restaurant: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    rooms: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 22V8a1 1 0 0 1 1-1h4V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18"/>
        <path d="M3 22h18M9 22v-4h6v4"/>
      </svg>
    ),
    bookings: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    support: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    logout: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    )
  };
  return icons[type] || null;
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { refreshData } = useHotel();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    try {
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Automatically close mobile sidebar on route transition
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Mobile Drawer Overlay */}
      <div 
        className={`admin-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar (Desktop Sticky + Mobile Drawer) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-title">
            <span className="admin-sidebar-logo-dot" />
            <span>Hotel Shuktara</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Navigation"
          >
            <NavIcon type="close" />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon"><NavIcon type="dashboard" /></span>
            <span className="admin-nav-text">Dashboard</span>
          </NavLink>
          <NavLink 
            to="/admin/homepage-images" 
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon"><NavIcon type="images" /></span>
            <span className="admin-nav-text">Homepage Images</span>
          </NavLink>
          <NavLink 
            to="/admin/restaurant" 
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon"><NavIcon type="restaurant" /></span>
            <span className="admin-nav-text">Rasun Restaurant</span>
          </NavLink>
          <NavLink 
            to="/admin/rooms" 
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon"><NavIcon type="rooms" /></span>
            <span className="admin-nav-text">Rooms</span>
          </NavLink>
          <NavLink 
            to="/admin/bookings" 
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon"><NavIcon type="bookings" /></span>
            <span className="admin-nav-text">Bookings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-add-btn" onClick={() => { setSidebarOpen(false); navigate('/admin/rooms'); }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add New Room</span>
          </button>

          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar-sublink">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>View Live Site</span>
          </a>

          <button className="admin-sidebar-sublink" onClick={handleLogout}>
            <NavIcon type="logout" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <NavIcon type="menu" />
            </button>

            <span className="admin-topbar-mobile-title">
              Hotel Shuktara
            </span>

            <div className="admin-search-wrapper">
              <span className="admin-search-icon">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input type="text" className="admin-search-input" placeholder="Search rooms..." />
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button
              className="admin-action-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 20,
                fontSize: '0.82rem',
                fontWeight: 600,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
              onClick={handleGlobalRefresh}
              title="Refresh and sync data with live site"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
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
              <span>{isRefreshing ? 'Syncing...' : 'Sync Site'}</span>
            </button>

            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site-link">
              Live Site ↗
            </a>
            <button className="admin-logout-btn" onClick={handleLogout} title="Log Out">
              Logout
            </button>
            <div 
              style={{
                width: 36, height: 36, borderRadius: '50%', background: '#12463d',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
              }}
              title={user?.email || 'Admin'}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
