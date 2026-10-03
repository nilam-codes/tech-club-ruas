import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../../services/authService';
import Button from '../../components/common/Button/Button';
import './AdminLoginPage.css';

export default function AdminForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await sendPasswordResetEmail(email);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to send reset email.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page section">
      <div className="container">
        <div className="admin-login-card">
          <h2>Reset Password</h2>
          <p className="admin-note">Enter your admin email to receive a recovery link.</p>

          {error && <div className="admin-error">{error}</div>}
          {success ? (
            <div className="admin-message" style={{ background: 'rgba(0,255,100,0.1)', color: '#00ff64', padding: '16px', borderRadius: '4px', textAlign: 'center', marginBottom: '24px' }}>
              Reset link sent! Please check your email.
            </div>
          ) : (
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
                  autoComplete="email"
                />
              </div>

              <Button type="submit" variant="signal" size="md" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="admin-login-footer" style={{ marginTop: '24px' }}>
            <button type="button" className="text-link" onClick={() => onNavigate('admin/login')}>
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

