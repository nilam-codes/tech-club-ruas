const fs = require('fs');

const content = \import React, { useState, useEffect } from 'react';
import { getRounds, getSubmissions, getVotes, getTeams } from '../../services/gameService';
import { getRegistrationsForEvent } from '../../services/registrationService';
import { 
  getArchiveByEventId, 
  upsertArchive, 
  toggleArchivePublish,
  uploadArchiveImage,
  addArchiveMedia,
  getArchiveMedia,
  deleteArchiveMedia
} from '../../services/archiveService';
import { UPCOMING_FLAGSHIP_EVENT } from '../../data/eventsData';
import Button from '../../components/common/Button/Button';
import { supabase } from '../../lib/supabaseClient';

export default function AdminArchivePanel() {
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState(null);
  const [media, setMedia] = useState([]);
  
  // Editor state
  const [editMode, setEditMode] = useState(false);
  
  // Form states for uploads
  const [winnerPhotoFile, setWinnerPhotoFile] = useState(null);
  const [eventPosterFile, setEventPosterFile] = useState(null);
  const [eventPhotosFiles, setEventPhotosFiles] = useState([]);
  
  // Editable fields
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editWinnerName, setEditWinnerName] = useState('');
  
  // Snapshot Teams editor
  const [teamsEditor, setTeamsEditor] = useState([]);
  const [scoreboardEditor, setScoreboardEditor] = useState([]);

  const eventId = UPCOMING_FLAGSHIP_EVENT.id;

  useEffect(() => {
    loadArchive();
  }, []);

  const loadArchive = async () => {
    setLoading(true);
    const res = await getArchiveByEventId(eventId);
    if (res.success && res.data) {
      setArchive(res.data);
      setEditTitle(res.data.title || '');
      setEditDesc(res.data.description || '');
      setEditDate(res.data.event_date || '');
      setEditVenue(res.data.venue || '');
      setEditWinnerName(res.data.winner_team_name || '');
      setTeamsEditor(res.data.snapshot_teams || []);
      setScoreboardEditor(res.data.snapshot_scoreboard || []);
      
      const mRes = await getArchiveMedia(res.data.id);
      if (mRes.success) setMedia(mRes.data);
    }
    setLoading(false);
  };

  const handleGenerateSnapshot = async () => {
    if (!window.confirm("This creates a historical snapshot of the event. Make sure all rounds, voting and results are final.")) return;
    
    setLoading(true);
    try {
      const [rRes, tRes, regRes] = await Promise.all([getRounds(), getTeams(), getRegistrationsForEvent(eventId)]);
      let allSubs = [];
      let allVotes = [];
      
      if (rRes.success) {
        for (const r of rRes.data) {
          const sRes = await getSubmissions(r.id);
          const vRes = await getVotes(r.id);
          if (sRes.success) allSubs = [...allSubs, ...sRes.data];
          if (vRes.success) allVotes = [...allVotes, ...vRes.data];
        }
      }
      const liveTeams = tRes.success ? tRes.data : [];
      const liveRegistrations = regRes.success ? regRes.data : [];

      const scores = {};
      liveTeams.forEach(t => {
        scores[t.id] = { team_name: t.team_name, r2: 0, r3: 0, total: 0 };
      });
      allVotes.forEach(v => {
        const sub = allSubs.find(s => s.id === v.submission_id);
        if (!sub) return;
        const round = rRes.data.find(r => r.id === sub.round_id);
        if (!round) return;

        if (scores[sub.team_id]) {
          if (round.round_number === 2) scores[sub.team_id].r2 += v.score;
          if (round.round_number === 3) scores[sub.team_id].r3 += v.score;
          scores[sub.team_id].total += v.score;
        }
      });
      const leaderboard = Object.values(scores).sort((a, b) => b.total - a.total);
      
      let currentRank = 1;
      leaderboard.forEach(t => t.rank = currentRank++);

      const winnerTeamName = leaderboard.length > 0 ? leaderboard[0].team_name : null;

      const publicTeams = liveTeams.map(t => {
        return {
          team_name: t.team_name,
          members: (t.team_members || []).map(tm => {
            const reg = liveRegistrations.find(r => r.id === tm.registration_id);
            if (!reg) {
              throw new Error(\Could not resolve participant name for registration ID \. Snapshot was not updated.\);
            }
            return { full_name: reg.full_name };
          })
        };
      });

      const payload = {
        event_id: eventId,
        title: UPCOMING_FLAGSHIP_EVENT.title,
        description: UPCOMING_FLAGSHIP_EVENT.description,
        event_date: UPCOMING_FLAGSHIP_EVENT.displayDate,
        venue: "Seminar Hall",
        winner_team_name: winnerTeamName,
        snapshot_scoreboard: leaderboard,
        snapshot_teams: publicTeams
      };

      const archiveRes = await upsertArchive(payload);
      if (archiveRes.success) {
        setArchive(archiveRes.data);
        
        const mRes = await getArchiveMedia(archiveRes.data.id);
        const existingMedia = mRes.success ? mRes.data : [];
        const hasRoundSubs = existingMedia.some(m => m.media_type === 'round_submission');
        
        if (!hasRoundSubs) {
          for (const sub of allSubs) {
            if (sub.image_path) {
              const r = rRes.data.find(round => round.id === sub.round_id);
              const t = liveTeams.find(team => team.id === sub.team_id);
              if (r && t) {
                await addArchiveMedia({
                  archive_id: archiveRes.data.id,
                  media_type: 'round_submission',
                  round_number: r.round_number,
                  team_name: t.team_name,
                  image_url: sub.image_path
                });
              }
            }
          }
        }
        await loadArchive();
      }
    } catch (err) {
      alert('Generation error: ' + err.message);
    }
    setLoading(false);
  };

  const handleUpdateArchiveDetails = async () => {
    if (!archive) return;
    setLoading(true);
    
    const payload = {
      event_id: archive.event_id,
      title: editTitle,
      description: editDesc,
      event_date: editDate,
      venue: editVenue,
      winner_team_name: editWinnerName,
      snapshot_teams: teamsEditor,
      snapshot_scoreboard: scoreboardEditor
    };
    
    // We update via supabase directly here to guarantee an update rather than upsert overwrite
    const { error } = await supabase.from('event_archives').update(payload).eq('id', archive.id);
    if (!error) {
      await loadArchive();
      alert("Archive details updated.");
    } else {
      alert("Failed to update: " + error.message);
    }
    setLoading(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm("Remove this media?")) return;
    setLoading(true);
    await deleteArchiveMedia(mediaId);
    await loadArchive();
    setLoading(false);
  };
  
  const handleUpdateMediaTeamName = async (mediaId, newTeamName) => {
    setLoading(true);
    await supabase.from('event_archive_media').update({ team_name: newTeamName }).eq('id', mediaId);
    await loadArchive();
    setLoading(false);
  };

  // Upload Handlers
  const handleUploadPoster = async () => {
    if (!archive || !eventPosterFile) return;
    setLoading(true);
    const path = \poster/\_\.\\;
    const uploadRes = await uploadArchiveImage(eventPosterFile, path);
    if (uploadRes.success) {
      await addArchiveMedia({ archive_id: archive.id, media_type: 'event_poster', image_url: uploadRes.url });
      setEventPosterFile(null);
      await loadArchive();
    } else {
      alert('Upload failed: ' + uploadRes.error);
    }
    setLoading(false);
  };

  const handleUploadWinner = async () => {
    if (!archive || !winnerPhotoFile) return;
    setLoading(true);
    const path = \winner/\_\.\\;
    const uploadRes = await uploadArchiveImage(winnerPhotoFile, path);
    if (uploadRes.success) {
      // Delete existing winner photo from media
      const existing = media.find(m => m.media_type === 'winner_photo');
      if (existing) await deleteArchiveMedia(existing.id);
      
      await addArchiveMedia({ archive_id: archive.id, media_type: 'winner_photo', image_url: uploadRes.url });
      setWinnerPhotoFile(null);
      await loadArchive();
    } else {
      alert('Upload failed: ' + uploadRes.error);
    }
    setLoading(false);
  };

  const handleUploadEventPhotos = async () => {
    if (!archive || eventPhotosFiles.length === 0) return;
    setLoading(true);
    for (const file of eventPhotosFiles) {
      const path = \gallery/\_\_\.\\;
      const uploadRes = await uploadArchiveImage(file, path);
      if (uploadRes.success) {
        await addArchiveMedia({ archive_id: archive.id, media_type: 'event_photo', image_url: uploadRes.url });
      }
    }
    setEventPhotosFiles([]);
    await loadArchive();
    setLoading(false);
  };

  const handleTogglePublish = async () => {
    if (!archive) return;
    const confirmMsg = archive.published ? "Unpublish this archive?" : "Publish this archive publicly?";
    if (!window.confirm(confirmMsg)) return;
    setLoading(true);
    await toggleArchivePublish(archive.id, !archive.published);
    await loadArchive();
    setLoading(false);
  };

  // Team Editor Functions
  const handleTeamNameChange = (index, newName) => {
    const newTeams = [...teamsEditor];
    const oldName = newTeams[index].team_name;
    newTeams[index].team_name = newName;
    setTeamsEditor(newTeams);
    
    // Also update scoreboard
    const newScoreboard = scoreboardEditor.map(sb => {
      if (sb.team_name === oldName) return { ...sb, team_name: newName };
      return sb;
    });
    setScoreboardEditor(newScoreboard);
  };

  const handleMemberNameChange = (teamIndex, memberIndex, newName) => {
    const newTeams = [...teamsEditor];
    newTeams[teamIndex].members[memberIndex].full_name = newName;
    setTeamsEditor(newTeams);
  };

  const handleAddMember = (teamIndex) => {
    const newTeams = [...teamsEditor];
    newTeams[teamIndex].members.push({ full_name: 'New Member' });
    setTeamsEditor(newTeams);
  };

  const handleRemoveMember = (teamIndex, memberIndex) => {
    const newTeams = [...teamsEditor];
    newTeams[teamIndex].members.splice(memberIndex, 1);
    setTeamsEditor(newTeams);
  };

  const handleRemoveTeam = (teamIndex) => {
    if (!window.confirm("Remove this team from the archive?")) return;
    const oldName = teamsEditor[teamIndex].team_name;
    const newTeams = [...teamsEditor];
    newTeams.splice(teamIndex, 1);
    setTeamsEditor(newTeams);
    
    // Also remove from scoreboard
    const newScoreboard = scoreboardEditor.filter(sb => sb.team_name !== oldName);
    setScoreboardEditor(newScoreboard);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Event Archive Management</h2>
        <p className="admin-panel-text">Generate historical snapshots, edit content, and publish past events.</p>
      </div>

      <div className="admin-card">
        <h3>1. Snapshot Generation</h3>
        <p style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.7 }}>
          Pulls fresh data from the live game and overwrites the snapshot. 
        </p>
        <Button variant="signal" onClick={handleGenerateSnapshot} disabled={loading}>
          {archive ? 'REGENERATE SNAPSHOT' : 'GENERATE SNAPSHOT'}
        </Button>
      </div>

      {archive && (
        <>
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>2. Edit Archive Content</h3>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Hide Editor' : 'Open Editor'}
              </Button>
            </div>
            
            {editMode && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                  <h4>Event Details</h4>
                  <input className="admin-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
                  <textarea className="admin-input" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" rows={3} />
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input className="admin-input" value={editDate} onChange={e => setEditDate(e.target.value)} placeholder="Date" style={{ flex: 1 }} />
                    <input className="admin-input" value={editVenue} onChange={e => setEditVenue(e.target.value)} placeholder="Venue" style={{ flex: 1 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h4>Winner Override</h4>
                  <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>Select the winner from the participating teams</p>
                  <select className="admin-select" style={{ width: '100%' }} value={editWinnerName} onChange={e => setEditWinnerName(e.target.value)}>
                    <option value="">- Select Winner -</option>
                    {teamsEditor.map(t => (
                      <option key={t.team_name} value={t.team_name}>{t.team_name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h4>Participating Teams</h4>
                  {teamsEditor.map((team, tIdx) => (
                    <div key={tIdx} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '16px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input className="admin-input" style={{ flex: 1 }} value={team.team_name} onChange={e => handleTeamNameChange(tIdx, e.target.value)} />
                        <Button variant="outline" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleRemoveTeam(tIdx)}>Remove Team</Button>
                      </div>
                      
                      {team.members.map((m, mIdx) => (
                        <div key={mIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingLeft: '16px' }}>
                          <input className="admin-input" style={{ flex: 1, padding: '4px 8px' }} value={m.full_name} onChange={e => handleMemberNameChange(tIdx, mIdx, e.target.value)} />
                          <button onClick={() => handleRemoveMember(tIdx, mIdx)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>Remove</button>
                        </div>
                      ))}
                      <button onClick={() => handleAddMember(tIdx)} style={{ background: 'none', border: 'none', color: 'var(--color-brand-orange)', cursor: 'pointer', paddingLeft: '16px', fontSize: '12px', marginTop: '8px' }}>+ Add Member</button>
                    </div>
                  ))}
                </div>
                
                <Button variant="signal" onClick={handleUpdateArchiveDetails} disabled={loading} style={{ width: '100%' }}>
                  SAVE ARCHIVE DETAILS
                </Button>
              </div>
            )}
          </div>

          <div className="admin-card">
            <h3>3. Upload Official Media</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
              <div>
                <h4>Event Poster</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => setEventPosterFile(e.target.files[0])} />
                  <Button variant="outline" size="sm" onClick={handleUploadPoster} disabled={!eventPosterFile || loading}>Upload</Button>
                </div>
              </div>

              <div>
                <h4>Winner Photo</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => setWinnerPhotoFile(e.target.files[0])} />
                  <Button variant="outline" size="sm" onClick={handleUploadWinner} disabled={!winnerPhotoFile || loading}>Replace</Button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4>Event Gallery Photos</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => setEventPhotosFiles(Array.from(e.target.files))} />
                  <Button variant="outline" size="sm" onClick={handleUploadEventPhotos} disabled={eventPhotosFiles.length === 0 || loading}>Upload All</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3>4. Media Gallery</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {media.map(m => (
                <div key={m.id} style={{ position: 'relative', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <img src={m.image_url} alt={m.media_type} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--color-brand-orange)' }}>{m.media_type.toUpperCase()}</div>
                  
                  {m.media_type === 'round_submission' && (
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        className="admin-input" 
                        style={{ padding: '4px', fontSize: '12px', width: '100%' }} 
                        value={m.team_name} 
                        onChange={(e) => {
                          const newMedia = [...media];
                          const mIdx = newMedia.findIndex(x => x.id === m.id);
                          newMedia[mIdx].team_name = e.target.value;
                          setMedia(newMedia);
                        }}
                        onBlur={(e) => handleUpdateMediaTeamName(m.id, e.target.value)}
                      />
                    </div>
                  )}

                  <button 
                    onClick={() => handleDeleteMedia(m.id)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'red', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {media.length === 0 && <p style={{ opacity: 0.5, marginTop: '16px' }}>No media uploaded.</p>}
          </div>

          <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>5. Publication Status</h3>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>
                {archive.published ? 'dYY This archive is LIVE to the public.' : 'dY"' This archive is currently HIDDEN.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="outline" onClick={() => window.location.hash = \#/archive/\\}>
                Preview
              </Button>
              <Button variant={archive.published ? "outline" : "signal"} onClick={handleTogglePublish} disabled={loading}>
                {archive.published ? "UNPUBLISH" : "PUBLISH PUBLICLY"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
\
fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
