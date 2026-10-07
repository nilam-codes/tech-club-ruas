import React, { useState, useEffect } from 'react';
import { getSession, checkIsAdmin, logout } from '../../services/authService';
import Button from '../../components/common/Button/Button';
import AdminRegistrationsPanel from './AdminRegistrationsPanel';
import AdminTeamsPanel from './AdminTeamsPanel';
import AdminRoundsPanel from './AdminRoundsPanel';
import AdminSubmissionsPanel from './AdminSubmissionsPanel';
import AdminVotingPanel from './AdminVotingPanel';
import AdminArchivePanel from './AdminArchivePanel';
import AdminClubTeamPanel from './AdminClubTeamPanel';
import AdminEventsManager from './AdminEventsManager';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Archive, 
  Users, 
  UserPlus, 
  Swords, 
  Upload, 
  Vote, 
  Trophy,
  Terminal,
  LogOut,
  Activity,
  ShieldCheck
} from 'lucide-react';
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
      <div className="admin-page section loading-state">
        <div className="container">
          <Terminal className="loading-icon" size={32} />
          <p className="admin-loading-text">INITIALIZING SECURE SESSION...</p>
        </div>
      </div>
    );
  }

  const renderNavGroup = (title, items) => (
    <div className="admin-nav-group">
      <h3 className="admin-nav-group-title">{title}</h3>
      <div className="admin-nav-items">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="admin-nav-icon" size={18} />
              <span>{item.label}</span>
              {isActive && <div className="admin-nav-active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      {/* Top Navigation Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-brand">
            <Terminal className="admin-brand-icon" size={24} />
            <span className="admin-brand-text">ADMIN_CONSOLE</span>
            <span className="admin-brand-version">v2.0</span>
          </div>
        </div>
        <div className="admin-topbar-right">
          <div className="admin-user-info">
            <ShieldCheck size={16} className="admin-user-icon" />
            <span className="admin-user-email">{user?.email}</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-content">
            {renderNavGroup('OVERVIEW', [
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }
            ])}
            
            {renderNavGroup('EVENT PLATFORM', [
              { id: 'events_manager', label: 'Events Manager', icon: CalendarPlus },
              { id: 'archive', label: 'Event Archive', icon: Archive }
            ])}

            {renderNavGroup('CLUB', [
              { id: 'club-team', label: 'Club Team', icon: Users }
            ])}

            {renderNavGroup('LEGACY (COOKED WITHOUT CODE)', [
              { id: 'registrations', label: 'Registrations', icon: UserPlus },
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'rounds', label: 'Round Control', icon: Swords },
              { id: 'submissions', label: 'Submissions', icon: Upload },
              { id: 'voting', label: 'Voting', icon: Vote },
              { id: 'results', label: 'Results', icon: Trophy }
            ])}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          <div className="admin-content-wrapper">
            {activeTab === 'overview' && (
              <div className="admin-overview-panel">
                <div className="admin-overview-header">
                  <h2>System Status</h2>
                  <div className="status-badge online">
                    <Activity size={14} />
                    <span>ALL SYSTEMS NOMINAL</span>
                  </div>
                </div>
                
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="stat-icon-wrapper cyan">
                      <LayoutDashboard size={24} />
                    </div>
                    <div className="stat-content">
                      <p className="stat-label">Platform Version</p>
                      <h4 className="stat-value">2.0.0-prod</h4>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="stat-icon-wrapper acid">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="stat-content">
                      <p className="stat-label">Security</p>
                      <h4 className="stat-value">RLS Active</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events_manager' && <AdminEventsManager />}
            {activeTab === 'registrations' && <AdminRegistrationsPanel />}
            {activeTab === 'teams' && <AdminTeamsPanel />}
            {activeTab === 'rounds' && <AdminRoundsPanel />}
            {activeTab === 'submissions' && <AdminSubmissionsPanel />}
            {(activeTab === 'voting' || activeTab === 'results') && <AdminVotingPanel />}
            {activeTab === 'club-team' && <AdminClubTeamPanel />}
            {activeTab === 'archive' && <AdminArchivePanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

