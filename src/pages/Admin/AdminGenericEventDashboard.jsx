import React, { useState, useEffect } from 'react';
import { getEventRegistrations, updateRegistrationStatus, getEventTeams } from '../../services/genericEventsService';
import Button from '../../components/common/Button/Button';

export default function AdminGenericEventDashboard({ event }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div style={{ marginTop: '1rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{event.title} Dashboard</h2>
      <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Manage registrations, teams, and settings for this event.</p>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {['overview', 'registrations', 'teams', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === tab ? '#0f0' : '#fff',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              padding: '0.5rem 1rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && <OverviewTab event={event} />}
        {activeTab === 'registrations' && <RegistrationsTab eventId={event.id} />}
        {activeTab === 'teams' && <TeamsTab eventId={event.id} />}
        {activeTab === 'settings' && <SettingsTab event={event} />}
      </div>
    </div>
  );
}

function OverviewTab({ event }) {
  return (
    <div>
      <h3>Event Overview</h3>
      <pre style={{ background: '#111', padding: '1rem', color: '#0f0', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(event, null, 2)}
      </pre>
    </div>
  );
}

function RegistrationsTab({ eventId }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegs();
  }, [eventId]);

  const fetchRegs = async () => {
    setLoading(true);
    const { data } = await getEventRegistrations(eventId);
    setRegistrations(data || []);
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateRegistrationStatus(id, status);
    fetchRegs();
  };

  if (loading) return <p>Loading registrations...</p>;

  return (
    <div>
      <h3>Registrations</h3>
      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ padding: '0.5rem' }}>ID</th>
              <th style={{ padding: '0.5rem' }}>Student ID</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.5rem' }}>{r.id.substring(0,8)}...</td>
                <td style={{ padding: '0.5rem' }}>{r.student_id}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ color: r.status === 'approved' ? '#0f0' : r.status === 'rejected' ? '#f00' : '#ffa500' }}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  {r.status !== 'approved' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(r.id, 'approved')}>Approve</Button>
                  )}
                  {r.status !== 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(r.id, 'rejected')}>Reject</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TeamsTab({ eventId }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [eventId]);

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await getEventTeams(eventId);
    setTeams(data || []);
    setLoading(false);
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <div>
      <h3>Teams</h3>
      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {teams.map(t => (
            <div key={t.id} style={{ border: '1px solid #333', padding: '1rem', borderRadius: '4px' }}>
              <h4>{t.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.7 }}>({t.id.substring(0,8)})</span></h4>
              <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                {t.event_team_members && t.event_team_members.map(m => (
                  <li key={m.registration_id}>
                    Registration: {m.registration_id.substring(0,8)}... | Role: {m.role || 'Member'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ event }) {
  return (
    <div>
      <h3>Event Settings</h3>
      <p style={{ opacity: 0.7 }}>Settings interface for {event.title} goes here.</p>
    </div>
  );
}
