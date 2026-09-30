import React, { useState, useEffect } from 'react';
import { getRounds, getSubmissions, getVotes, getTeams } from '../../services/gameService';

export default function AdminVotingPanel() {
  const [rounds, setRounds] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [rRes, tRes] = await Promise.all([getRounds(), getTeams()]);
      
      let allSubs = [];
      let allVotes = [];
      
      if (rRes.success) {
        setRounds(rRes.data);
        for (const r of rRes.data) {
          const sRes = await getSubmissions(r.id);
          const vRes = await getVotes(r.id);
          if (sRes.success) allSubs = [...allSubs, ...sRes.data];
          if (vRes.success) allVotes = [...allVotes, ...vRes.data];
        }
      }
      
      if (tRes.success) setTeams(tRes.data);
      setSubmissions(allSubs);
      setVotes(allVotes);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calculate scores per team
  const calculateScores = () => {
    const scores = {};
    teams.forEach(t => {
      scores[t.id] = { name: t.team_name, r2: 0, r3: 0, total: 0 };
    });

    votes.forEach(v => {
      const sub = submissions.find(s => s.id === v.submission_id);
      if (!sub) return;
      const round = rounds.find(r => r.id === sub.round_id);
      if (!round) return;

      if (scores[sub.team_id]) {
        if (round.round_number === 2) scores[sub.team_id].r2 += v.score;
        if (round.round_number === 3) scores[sub.team_id].r3 += v.score;
        scores[sub.team_id].total += v.score;
      }
    });

    return Object.values(scores).sort((a, b) => b.total - a.total);
  };

  const leaderboard = calculateScores();

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Voting & Results</h2>
        <p className="admin-panel-text">Live scoring and leaderboard</p>
      </div>

      {loading ? (
        <div className="admin-state-message">Calculating scores...</div>
      ) : (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--color-brand-orange)' }}>THE COOKED CHAMPIONS</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>R2 Score</th>
                  <th>R3 Score</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((team, index) => (
                  <tr key={team.name} style={{ background: index === 0 ? 'rgba(255, 60, 0, 0.1)' : 'transparent' }}>
                    <td style={{ fontWeight: index < 3 ? 'bold' : 'normal', color: index === 0 ? 'var(--color-brand-orange)' : 'inherit' }}>
                      {index + 1}
                      {index === 0 && ' 🏆'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </td>
                    <td style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>{team.name}</td>
                    <td>{team.r2}</td>
                    <td>{team.r3}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--color-brand-orange)' }}>{team.total}</td>
                  </tr>
                ))}
                {leaderboard.length === 0 && (
                  <tr><td colSpan="5" className="text-center">No teams found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Voting Statistics</h3>
            <div className="admin-placeholder-grid">
              <div className="admin-placeholder-card">
                <h3>Round 2</h3>
                <p>Submissions: {submissions.filter(s => rounds.find(r => r.id === s.round_id)?.round_number === 2).length}</p>
                <p>Votes cast: {votes.filter(v => rounds.find(r => r.id === v.round_id)?.round_number === 2).length}</p>
              </div>
              <div className="admin-placeholder-card">
                <h3>Round 3</h3>
                <p>Submissions: {submissions.filter(s => rounds.find(r => r.id === s.round_id)?.round_number === 3).length}</p>
                <p>Votes cast: {votes.filter(v => rounds.find(r => r.id === v.round_id)?.round_number === 3).length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
