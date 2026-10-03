import React, { useState, useEffect } from 'react';
import { updatePassword } from '../../services/authService';
import Button from '../../components/common/Button/Button';
import './AdminLoginPage.css';

export default function AdminResetPasswordPage({ onNavigate }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes('access_token=')) {
      window.history.replaceState(null, '', window.location.pathname + '#admin/reset-password');
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await updatePassword(password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('admin/login');
      }, 2000);
    } else {
      setError(res.error || 'Failed to update password');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page section bg-grid-texture">
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="admin-login-card">
          <div className="meta-label" style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--color-brand-orange)' }}>
            TECH CLUB ADMIN
          </div>
          <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '32px' }}>
            RESET ADMIN PASSWORD
          </h1>

          {error && <div className="admin-error-message">{error}</div>}
          {success && (
            <div className="admin-success-message" style={{ background: 'rgba(0,255,100,0.1)', color: '#00ff64', padding: '16px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center' }}>
              Password updated successfully! Redirecting...
            </div>
          )}

          {!success && (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" variant="signal" size="lg" disabled={loading} style={{ marginTop: '16px' }}>
                {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </Button>
            </form>
          )}
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button 
              onClick={() => onNavigate && onNavigate('admin/login')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
