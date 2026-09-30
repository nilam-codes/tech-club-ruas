import React, { useState, useEffect } from 'react';
import { getTeams, createTeam, assignMemberToTeam, removeMemberFromTeam } from '../../services/gameService';
import { getRegistrationsForEvent } from '../../services/registrationService';
import Button from '../../components/common/Button/Button';
import { UPCOMING_FLAGSHIP_EVENT } from '../../data/eventsData';

const EVENT_ID = UPCOMING_FLAGSHIP_EVENT.id;

export default function AdminTeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [teamFormError, setTeamFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [teamsRes, regRes] = await Promise.all([
      getTeams(),
      getRegistrationsForEvent(EVENT_ID)
    ]);
    if (teamsRes.success) setTeams(teamsRes.data);
    if (regRes.success) setRegistrations(regRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamFormError('');
    if (!newTeamName.trim() || !newTeamCode.trim()) {
      setTeamFormError('Both name and code are required.');
      return;
    }
    const result = await createTeam(newTeamName.trim(), newTeamCode.trim());
    if (result.success) {
      setNewTeamName('');
      setNewTeamCode('');
      fetchData();
    } else {
      setTeamFormError(result.error);
    }
  };

  const handleAssign = async (teamId, registrationId) => {
    const result = await assignMemberToTeam(teamId, registrationId);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error);
    }
  };

  const handleRemove = async (teamId, registrationId) => {
    const result = await removeMemberFromTeam(teamId, registrationId);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error);
    }
  };

  // Helper to map registration ID to registration details
  const getRegDetails = (id) => registrations.find(r => r.id === id);

  // Find participants not currently in any team
  const assignedRegIds = new Set(teams.flatMap(t => t.team_members.map(tm => tm.registration_id)));
  const unassignedRegs = registrations.filter(r => !assignedRegIds.has(r.id));

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Teams Management</h2>
        <p className="admin-panel-text">Total Teams: {teams.length}</p>
      </div>

      <div className="admin-add-form-container" style={{ marginBottom: '24px' }}>
        <h3>Create New Team</h3>
        {teamFormError && <div className="admin-error-msg">{teamFormError}</div>}
        <form className="admin-add-form" onSubmit={handleCreateTeam} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginTop: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Team Name</label>
            <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required placeholder="e.g. Byte Busters" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Team Code (Password)</label>
            <input type="text" value={newTeamCode} onChange={(e) => setNewTeamCode(e.target.value)} required placeholder="e.g. 1234" />
          </div>
          <Button type="submit" variant="signal" size="md">Create</Button>
        </form>
      </div>

      {loading ? (
        <div className="admin-state-message">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="admin-state-message">No teams created yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {teams.map(team => (
            <div key={team.id} style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-brand-orange)' }}>{team.team_name}</h3>
                <span className="mono-badge">Code: {team.team_code}</span>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Members ({team.team_members.length})</h4>
                {team.team_members.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>No members assigned.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {team.team_members.map(tm => {
                      const details = getRegDetails(tm.registration_id);
                      if (!details) return null;
                      return (
                        <li key={tm.registration_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                          <div>
                            <span style={{ fontWeight: '500' }}>{details.full_name}</span>
                            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{details.student_id}</span>
                          </div>
                          <button onClick={() => handleRemove(team.id, tm.registration_id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Add Member</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select id={`select-${team.id}`} className="admin-select" style={{ flex: 1, padding: '8px' }}>
                    <option value="">Select unassigned participant...</option>
                    {unassignedRegs.map(r => (
                      <option key={r.id} value={r.id}>{r.full_name} ({r.student_id})</option>
                    ))}
                  </select>
                  <Button variant="outline" size="sm" onClick={() => {
                    const sel = document.getElementById(`select-${team.id}`);
                    if (sel.value) handleAssign(team.id, sel.value);
                  }}>Add</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

