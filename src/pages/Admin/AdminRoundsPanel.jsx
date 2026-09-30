import React, { useState, useEffect } from 'react';
import { getRounds, updateRoundStatus, initializeRoundsIfEmpty } from '../../services/gameService';
import Button from '../../components/common/Button/Button';

export default function AdminRoundsPanel() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRounds = async () => {
    setLoading(true);
    await initializeRoundsIfEmpty();
    const result = await getRounds();
    if (result.success) setRounds(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const handleStatusChange = async (roundId, status) => {
    const result = await updateRoundStatus(roundId, status);
    if (result.success) fetchRounds();
    else alert(result.error);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Round Control</h2>
        <p className="admin-panel-text">Manage the game flow</p>
      </div>

      {loading ? (
        <div className="admin-state-message">Loading rounds...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {rounds.map(round => (
            <div key={round.id} style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-brand-orange)' }}>{round.title}</h3>
                <span className="mono-badge" style={{ background: round.status === 'active' || round.status === 'voting' ? 'rgba(0,255,100,0.1)' : 'rgba(255,255,255,0.1)', color: round.status === 'active' || round.status === 'voting' ? '#00ff64' : 'white' }}>
                  STATUS: {round.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button 
                  variant={round.status === 'locked' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'locked')}
                  disabled={round.status === 'locked'}
                >
                  Lock
                </Button>
                <Button 
                  variant={round.status === 'active' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'active')}
                  disabled={round.status === 'active'}
                >
                  Open Submissions
                </Button>
                <Button 
                  variant={round.status === 'submission_closed' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'submission_closed')}
                  disabled={round.status === 'submission_closed'}
                >
                  Close Submissions
                </Button>
                <Button 
                  variant={round.status === 'voting' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'voting')}
                  disabled={round.status === 'voting' || round.round_number === 1}
                >
                  Open Voting
                </Button>
                <Button 
                  variant={round.status === 'voting_closed' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'voting_closed')}
                  disabled={round.status === 'voting_closed' || round.round_number === 1}
                >
                  Close Voting
                </Button>
                <Button 
                  variant={round.status === 'completed' ? 'signal' : 'outline'} 
                  size="sm" 
                  onClick={() => handleStatusChange(round.id, 'completed')}
                  disabled={round.status === 'completed'}
                >
                  Complete
                </Button>
              </div>
              {round.round_number === 1 && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '12px' }}>Note: Round 1 has no voting phase.</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

