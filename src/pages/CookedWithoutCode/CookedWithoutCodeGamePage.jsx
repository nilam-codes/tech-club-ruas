import React, { useState, useEffect } from 'react';
import { authenticateTeam, getRounds, getSubmissions, submitEntry, submitVote, uploadImage, deleteImage, getVotes, getMyVotes } from '../../services/gameService';
import Button from '../../components/common/Button/Button';
import './CookedWithoutCodeGamePage.css';

export default function CookedWithoutCodeGamePage({ onNavigate }) {
  const [team, setTeam] = useState(null);
  const [activeParticipant, setActiveParticipant] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [rounds, setRounds] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myVotes, setMyVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for submissions
  const [imageFile, setImageFile] = useState(null);
  const [heroName, setHeroName] = useState('');
  const [superpower, setSuperpower] = useState('');
  const [description, setDescription] = useState('');
  const [challengeOption, setChallengeOption] = useState('');
  const [interp1, setInterp1] = useState('');
  const [interp2, setInterp2] = useState('');
  const [interp3, setInterp3] = useState('');
  const [opposing1, setOpposing1] = useState('');
  const [opposing2, setOpposing2] = useState('');
  
  const [submitStatus, setSubmitStatus] = useState('idle');

  const [votingSubmissionId, setVotingSubmissionId] = useState(null);
  const [votingScore, setVotingScore] = useState(5);

  const fetchGameState = async () => {
    const rRes = await getRounds();
    if (rRes.success) setRounds(rRes.data);
    
    if (team) {
      let allSubs = [];
      for (const r of (rRes.data || [])) {
        const sRes = await getSubmissions(r.id);
        if (sRes.success) allSubs = [...allSubs, ...sRes.data];
      }
      setSubmissions(allSubs);
      setMySubmissions(allSubs.filter(s => s.team_id === team.id));
      
      if (activeParticipant) {
        const activeR = (rRes.data || []).find(r => r.status === 'voting');
        if (activeR) {
          const mRes = await getMyVotes(team.id, team.team_code, activeParticipant, activeR.id);
          if (mRes.success) {
            setMyVotes(mRes.data);
          }
        }
      } else {
        setMyVotes([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 10000); // 10s polling fallback
    return () => clearInterval(interval);
  }, [team, activeParticipant]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const res = await authenticateTeam(teamNameInput.trim(), teamCodeInput.trim());
    if (res.success) {
      setTeam(res.data);
    } else {
      setAuthError(res.error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmission = async (e, round) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    let imageUrl = '';
    let imageStoragePath = '';
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${team.id}/${round.id}_${Date.now()}.${ext}`;
      const uploadRes = await uploadImage(imageFile, path);
      if (uploadRes.success) {
        imageUrl = uploadRes.url;
        imageStoragePath = uploadRes.path;
      } else {
        alert('Image upload failed: ' + uploadRes.error);
        setSubmitStatus('error');
        return;
      }
    }

    const payload = {
      round_id: round.id,
      team_id: team.id,
      image_path: imageUrl,
      hero_name: heroName || null,
      superpower: superpower || null,
      description: description || null,
      chosen_option: challengeOption || null,
      interpretation_1: interp1 || null,
      interpretation_2: interp2 || null,
      interpretation_3: interp3 || null,
      opposing_instruction_1: opposing1 || null,
      opposing_instruction_2: opposing2 || null
    };

    const submitRes = await submitEntry(payload);
    if (submitRes.success) {
      setSubmitStatus('idle');
      setImageFile(null);
      setHeroName(''); setSuperpower(''); setDescription(''); setChallengeOption('');
      setInterp1(''); setInterp2(''); setInterp3('');
      setOpposing1(''); setOpposing2('');
      fetchGameState();
    } else {
      if (imageStoragePath) {
        await deleteImage(imageStoragePath);
      }
      alert(submitRes.error);
      setSubmitStatus('error');
    }
  };

  const handleVote = async (roundId, submissionId) => {
    if (!activeParticipant) {
      alert("Please select who you are first.");
      return;
    }
    const res = await submitVote(roundId, activeParticipant, submissionId, votingScore);
    if (res.success) {
      setVotingSubmissionId(null);
      setVotingScore(5);
      setMyVotes(prev => [...prev, submissionId]);
    } else {
      alert(res.error);
    }
  };

  if (!team) {
    return (
      <div className="game-page section">
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="game-title">COOKED WITHOUT CODE</h1>
          <p className="game-subtitle" style={{ marginBottom: '32px' }}>Enter your team credentials to access the game.</p>
          
          {authError && <div className="game-error">{authError}</div>}
          
          <form onSubmit={handleLogin} className="game-login-form">
            <input type="text" placeholder="Team Name" value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)} required />
            <input type="text" placeholder="Team Code (Password)" value={teamCodeInput} onChange={e => setTeamCodeInput(e.target.value)} required />
            <Button type="submit" variant="signal" className="w-full">JOIN GAME</Button>
          </form>
        </div>
      </div>
    );
  }

  // Determine current active/voting round
  let activeRound = rounds.find(r => r.status === 'active' || r.status === 'voting');
  let isResults = rounds.length > 0 && rounds.every(r => r.status === 'completed');

  return (
    <div className="game-page section">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="game-title">COOKED WITHOUT CODE</h1>
            <p className="game-subtitle">TEAM: {team.team_name}</p>
          </div>
        </div>

        {loading ? (
          <div className="game-loading">Syncing game state...</div>
        ) : isResults ? (
          <div className="game-card text-center">
            <h2>THE EVENT HAS CONCLUDED</h2>
            <p>Look at the main screen for the final results.</p>
          </div>
        ) : activeRound ? (
          <div className="game-card">
            <h2>{activeRound.title}</h2>
            
            {activeRound.status === 'active' && (
              <div className="game-active-phase">
                <span className="mono-badge mb-4 inline-block">SUBMISSIONS OPEN</span>
                
                {mySubmissions.find(s => s.round_id === activeRound.id) ? (
                  <div className="game-locked text-center mt-6 p-8 border border-white/10">
                    <h3 className="text-orange mb-2">SUBMISSION LOCKED</h3>
                    <p>Your team's submission has been recorded. Wait for the round to end.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmission(e, activeRound)} className="game-submission-form mt-6">
                    {activeRound.round_number === 1 && (
                      <>
                        <p className="mb-4">Create a brand-new superhero whose superpower is completely useless.</p>
                        <div className="form-group mb-4">
                          <label>Hero Name</label>
                          <input type="text" value={heroName} onChange={e => setHeroName(e.target.value)} required />
                        </div>
                        <div className="form-group mb-4">
                          <label>Superpower (The Useless One)</label>
                          <textarea value={superpower} onChange={e => setSuperpower(e.target.value)} required rows="3"></textarea>
                        </div>
                      </>
                    )}
                    
                    {activeRound.round_number === 2 && (
                      <>
                        <p className="mb-4">Transform your original concept into an official government campaign.</p>
                        <div className="form-group mb-4">
                          <label>Campaign Title / Short Description</label>
                          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="3"></textarea>
                        </div>
                      </>
                    )}

                    {activeRound.round_number === 3 && (
                      <>
                        <p className="mb-4">Choose ONE of three challenges.</p>
                        <div className="form-group mb-4">
                          <label>Select Challenge Option</label>
                          <select className="game-select" value={challengeOption} onChange={e => setChallengeOption(e.target.value)} required>
                            <option value="">Select an option...</option>
                            <option value="A">A: COLLEGE EDITION</option>
                            <option value="B">B: ONE IMAGE. THREE STORIES.</option>
                            <option value="C">C: MAKE AI ARGUE WITH ITSELF</option>
                          </select>
                        </div>

                        {challengeOption === 'A' && (
                          <div className="form-group mb-4">
                            <label>Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="2" placeholder="Explain the college campaign"></textarea>
                          </div>
                        )}
                        {challengeOption === 'B' && (
                          <>
                            <div className="form-group mb-4">
                              <label>Interpretation 1</label>
                              <input type="text" value={interp1} onChange={e => setInterp1(e.target.value)} required />
                            </div>
                            <div className="form-group mb-4">
                              <label>Interpretation 2</label>
                              <input type="text" value={interp2} onChange={e => setInterp2(e.target.value)} required />
                            </div>
                            <div className="form-group mb-4">
                              <label>Interpretation 3</label>
                              <input type="text" value={interp3} onChange={e => setInterp3(e.target.value)} required />
                            </div>
                          </>
                        )}
                        {challengeOption === 'C' && (
                          <>
                            <div className="form-group mb-4">
                              <label>Opposing Instruction 1</label>
                              <input type="text" value={opposing1} onChange={e => setOpposing1(e.target.value)} required />
                            </div>
                            <div className="form-group mb-4">
                              <label>Opposing Instruction 2</label>
                              <input type="text" value={opposing2} onChange={e => setOpposing2(e.target.value)} required />
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <div className="form-group mb-6">
                      <label>Final Visual (Upload Image)</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} required />
                    </div>

                    <Button type="submit" variant="signal" className="w-full" disabled={submitStatus === 'submitting'}>
                      {submitStatus === 'submitting' ? 'Uploading...' : 'LOCK SUBMISSION'}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {activeRound.status === 'voting' && (
              <div className="game-voting-phase">
                <span className="mono-badge mb-4 inline-block" style={{ background: 'rgba(0,255,100,0.1)', color: '#00ff64' }}>VOTING OPEN</span>
                
                <div style={{ marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>WHO ARE YOU?</label>
                  <select 
                    className="participant-select"
                    style={{ width: '100%', maxWidth: '300px' }}
                    value={activeParticipant} 
                    onChange={e => setActiveParticipant(e.target.value)}
                  >
                    <option value="">-- Select Your Name --</option>
                    {team.team_members?.map(tm => (
                      <option key={tm.registration_id} value={tm.registration_id}>{tm.registrations?.full_name || tm.registration_id}</option>
                    ))}
                  </select>
                </div>

                {!activeParticipant ? (
                  <div className="game-card text-center" style={{ marginTop: '24px' }}>
                    <h2 style={{ color: 'var(--accent-signal)' }}>SELECT YOUR NAME</h2>
                    <p>Please select your name from the dropdown above to view submissions and cast your votes.</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-6">Review the submissions and cast your vote (1-10).</p>
                    
                    <div className="game-submissions-grid">
                  {submissions.filter(s => s.round_id === activeRound.id).map(sub => {
                    const hasVoted = myVotes.includes(sub.id);
                    const isOwn = sub.team_id === team.id;
                    
                    return (
                      <div key={sub.id} className="game-vote-card">
                        {sub.image_path && <img src={sub.image_path} alt="Submission" className="vote-img" />}
                        <div className="vote-content p-4">
                          {sub.chosen_option && <div className="mono-badge mb-2 inline-block">OPTION {sub.chosen_option}</div>}
                          {sub.hero_name && <p className="mb-1 text-sm font-bold">{sub.hero_name}</p>}
                          {sub.superpower && <p className="mb-2 text-sm italic">{sub.superpower}</p>}
                          {sub.description && <p className="mb-2 text-sm">{sub.description}</p>}
                          
                          {sub.interpretation_1 && <p className="mb-1 text-sm text-white/80">1. {sub.interpretation_1}</p>}
                          {sub.interpretation_2 && <p className="mb-1 text-sm text-white/80">2. {sub.interpretation_2}</p>}
                          {sub.interpretation_3 && <p className="mb-2 text-sm text-white/80">3. {sub.interpretation_3}</p>}

                          {sub.opposing_instruction_1 && <p className="mb-1 text-sm text-white/80">V1: {sub.opposing_instruction_1}</p>}
                          {sub.opposing_instruction_2 && <p className="mb-2 text-sm text-white/80">V2: {sub.opposing_instruction_2}</p>}
                          
                          <div className="mt-4 pt-4 border-t border-white/10">
                            {isOwn ? (
                              <p className="text-sm text-orange text-center">Your Team's Submission</p>
                            ) : hasVoted ? (
                              <p className="text-sm text-[#00ff64] text-center">✓ Vote Cast</p>
                            ) : (
                              <div className="flex gap-2">
                                <input type="number" min="1" max="10" value={votingSubmissionId === sub.id ? votingScore : ''} onChange={e => {
                                  setVotingSubmissionId(sub.id);
                                  setVotingScore(parseInt(e.target.value));
                                }} placeholder="1-10" className="flex-1 bg-white/5 border border-white/20 p-2 text-center" />
                                <Button variant="outline" size="sm" onClick={() => handleVote(activeRound.id, sub.id)} disabled={votingSubmissionId !== sub.id || !votingScore || votingScore < 1 || votingScore > 10}>
                                  Vote
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="game-card text-center">
        <h2>STAND BY</h2>
        <p>Waiting for the organizers to start the round.</p>
      </div>
    )}
      </div>
    </div>
  );
}
