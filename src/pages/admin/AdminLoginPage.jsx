import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hotelshuktara.com');
  const [password, setPassword] = useState('admin123');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/admin/rooms');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const fillDemo = () => {
    setEmail('admin@hotelshuktara.com');
    setPassword('admin123');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/images/logo.jpg" alt="Hotel Shuktara" onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#12463d" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
          }} />
        </div>

        <h1 className="admin-login-title">Hotel Shuktara</h1>
        <p className="admin-login-subtitle">Admin Panel</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label className="admin-input-label">Email Address</label>
            <div className="admin-input-box">
              <span className="admin-input-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="email"
                className="admin-input"
                placeholder="admin@hotelshuktara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Password</label>
            <div className="admin-input-box">
              <span className="admin-input-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPwd ? 'text' : 'password'}
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="admin-input-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="admin-login-row">
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className="admin-forgot-link">Forgot Password?</a>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '12px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center', margin: 0, fontWeight: 600 }}>
                {error}
              </p>
              {error.toLowerCase().includes('invalid') && (
                <p style={{ color: '#64748b', fontSize: '0.78rem', textAlign: 'center', marginTop: 6, marginBottom: 0 }}>
                  Did you add <strong>admin@hotelshuktara.com</strong> in your Supabase dashboard under <em>Authentication → Users</em>?
                </p>
              )}
            </div>
          )}


          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <button type="button" className="admin-demo-pill" onClick={fillDemo}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Demo credentials already filled
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
