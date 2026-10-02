import React, { useState, useEffect } from 'react';
import { getSession, checkIsAdmin, logout } from '../../services/authService';
import Button from '../../components/common/Button/Button';
import AdminRegistrationsPanel from './AdminRegistrationsPanel';
import AdminTeamsPanel from './AdminTeamsPanel';
import AdminRoundsPanel from './AdminRoundsPanel';
import AdminSubmissionsPanel from './AdminSubmissionsPanel';
import AdminVotingPanel from './AdminVotingPanel';
import AdminArchivePanel from './AdminArchivePanel';
import './AdminDashboardPage.css';

export default function AdminDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const session = await getSession();
      if (!session) {
        onNavigate('admin/login');
        return;
      }

      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        onNavigate('admin/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    init();
  }, [onNavigate]);

  const handleLogout = async () => {
    await logout();
    onNavigate('admin/login');
  };

  if (loading) {
    return (
      <div className="admin-page section">
        <div className="container">
          <p className="admin-loading-text">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page section">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Control Panel</h1>
            <p className="admin-subtitle">Welcome, {user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <div className="admin-layout">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <button 
                className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
                onClick={() => setActiveTab('registrations')}
              >
                Registrations
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'teams' ? 'active' : ''}`}
                onClick={() => setActiveTab('teams')}
              >
                Teams
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'rounds' ? 'active' : ''}`}
                onClick={() => setActiveTab('rounds')}
              >
                Round Control
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                Submissions
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'voting' ? 'active' : ''}`}
                onClick={() => setActiveTab('voting')}
              >
                Voting
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Results
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('archive')}
              >
                Event Archive
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="admin-content">
            {activeTab === 'overview' && (
              <div className="admin-panel">
                <h2>System Overview</h2>
                <p className="admin-panel-text">
                  Welcome to the TECH CLUB administration system. Select a module from the sidebar to manage club operations.
                </p>
                <div className="admin-placeholder-grid">
                  <div className="admin-placeholder-card">
                    <span className="placeholder-icon">Sz</span>
                    <h3>Modules Online</h3>
                    <p>Foundation system operational.</p>
                  </div>
                  <div className="admin-placeholder-card">
                    <span className="placeholder-icon">s</span>
                    <h3>Security</h3>
                    <p>Row-Level Security active.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && (
              <AdminRegistrationsPanel />
            )}

            {activeTab === 'teams' && (
              <AdminTeamsPanel />
            )}

            {activeTab === 'rounds' && (
              <AdminRoundsPanel />
            )}

            {activeTab === 'submissions' && (
              <AdminSubmissionsPanel />
            )}

            {(activeTab === 'voting' || activeTab === 'results') && (
              <AdminVotingPanel />
            )}

            {activeTab === 'archive' && (
              <AdminArchivePanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

