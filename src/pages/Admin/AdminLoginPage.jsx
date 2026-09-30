import React, { useState, useEffect } from 'react';
import { login, getSession, checkIsAdmin } from '../../services/authService';
import Button from '../../components/common/Button/Button';
import './AdminLoginPage.css';

export default function AdminLoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Auto-redirect if already logged in and admin
  useEffect(() => {
    const checkExistingSession = async () => {
      const session = await getSession();
      if (session) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) {
          onNavigate('admin');
        } else {
          setError('You are logged in, but you do not have admin access.');
        }
      }
    };
    checkExistingSession();
  }, [onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { success, error: loginError } = await login(email, password);

    if (!success) {
      setError(loginError || 'Invalid login credentials.');
      setLoading(false);
      return;
    }

    // Verify Admin Authorization
    const isAdmin = await checkIsAdmin();
    if (isAdmin) {
      onNavigate('admin');
    } else {
      setError('Access Denied: Your account is not authorized as an admin.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page section">
      <div className="container">
        <div className="admin-login-card">
          <h2>Admin Access</h2>
          <p className="admin-note">
            Authorized personnel only.
          </p>

          {error && <div className="admin-error">{error}</div>}
          {message && <div className="admin-message">{message}</div>}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" variant="signal" size="md" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="admin-login-footer">
            <button type="button" className="text-link" onClick={() => onNavigate('home')}>
              ← Return to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
