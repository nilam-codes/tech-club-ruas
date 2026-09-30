import React, { useState, useEffect } from 'react';
import { getRounds, getSubmissions } from '../../services/gameService';

export default function AdminSubmissionsPanel() {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRounds = async () => {
      const result = await getRounds();
      if (result.success && result.data.length > 0) {
        setRounds(result.data);
        setSelectedRound(result.data[0].id);
      }
      setLoading(false);
    };
    fetchRounds();
  }, []);

  useEffect(() => {
    if (selectedRound) {
      const fetchSubs = async () => {
        setLoading(true);
        const result = await getSubmissions(selectedRound);
        if (result.success) setSubmissions(result.data);
        setLoading(false);
      };
      fetchSubs();
    }
  }, [selectedRound]);

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Submissions</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {rounds.map(r => (
            <button 
              key={r.id} 
              onClick={() => setSelectedRound(r.id)}
              style={{
                background: selectedRound === r.id ? 'var(--color-brand-orange)' : 'transparent',
                color: selectedRound === r.id ? 'black' : 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              R{r.round_number}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-state-message">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="admin-state-message">No submissions for this round yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-brand-orange)', marginBottom: '12px' }}>{sub.teams.team_name}</h3>
              {sub.chosen_option && <p style={{ marginBottom: '8px', fontSize: '14px' }}><strong>Choice:</strong> {sub.chosen_option}</p>}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {sub.image_path && (
                  <div style={{ flex: '1 1 300px' }}>
                    <img src={sub.image_path} alt="Submission" style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                  </div>
                )}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sub.hero_name && <div><strong>Hero:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.hero_name}</p></div>}
                  {sub.superpower && <div><strong>Power:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.superpower}</p></div>}
                  {sub.description && <div><strong>Description:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.description}</p></div>}
                  
                  {sub.interpretation_1 && <div><strong>Interpretation 1:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.interpretation_1}</p></div>}
                  {sub.interpretation_2 && <div><strong>Interpretation 2:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.interpretation_2}</p></div>}
                  {sub.interpretation_3 && <div><strong>Interpretation 3:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.interpretation_3}</p></div>}
                  
                  {sub.opposing_instruction_1 && <div><strong>Opposing 1:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.opposing_instruction_1}</p></div>}
                  {sub.opposing_instruction_2 && <div><strong>Opposing 2:</strong><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{sub.opposing_instruction_2}</p></div>}
                  
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 'auto', paddingTop: '16px' }}>Submitted at: {new Date(sub.submitted_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

