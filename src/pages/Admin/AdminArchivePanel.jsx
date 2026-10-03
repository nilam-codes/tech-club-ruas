import React, { useState, useEffect } from 'react';
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

export default function AdminArchivePanel() {
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState(null);
  const [media, setMedia] = useState([]);
  
  // Form states for uploads
  const [winnerPhotoFile, setWinnerPhotoFile] = useState(null);
  const [eventPosterFile, setEventPosterFile] = useState(null);
  const [eventPhotosFiles, setEventPhotosFiles] = useState([]);

  const eventId = UPCOMING_FLAGSHIP_EVENT.id; // Currently hardcoded to flagship event as per requirements

  useEffect(() => {
    loadArchive();
  }, []);

  const loadArchive = async () => {
    setLoading(true);
    const res = await getArchiveByEventId(eventId);
    if (res.success && res.data) {
      setArchive(res.data);
      const mRes = await getArchiveMedia(res.data.id);
      if (mRes.success) setMedia(mRes.data);
    }
    setLoading(false);
  };

  const handleGenerateSnapshot = async () => {
    if (!window.confirm("This creates a historical snapshot of the event. Make sure all rounds, voting and results are final.")) return;
    
    setLoading(true);
    try {
      // 1. Fetch live game data
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

      // 2. Calculate Final Scoreboard
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
      
      // Calculate rank
      let currentRank = 1;
      leaderboard.forEach((t, i) => {
        t.rank = currentRank++;
      });

      const winnerTeamName = leaderboard.length > 0 ? leaderboard[0].team_name : null;

      // 3. Calculate Public Teams Data
      console.log('LIVE REGISTRATIONS:', liveRegistrations);
      console.log('LIVE TEAMS:', liveTeams);

      const publicTeams = liveTeams.map(t => {
        console.log('TEAM MEMBERS RAW for', t.team_name, ':', t.team_members);
        return {
          team_name: t.team_name,
          members: (t.team_members || []).map(tm => {
            const reg = liveRegistrations.find(r => r.id === tm.registration_id);
            console.log('LOOKUP:', tm.registration_id, reg);
            
            if (!reg) {
              console.error('FAILED TO RESOLVE PARTICIPANT:', tm.registration_id);
              throw new Error(`Could not resolve participant name for registration ID ${tm.registration_id}. Snapshot was not updated.`);
            }
            
            return { full_name: reg.full_name };
          })
        };
      });

      // 4. Upsert Archive Record
      const payload = {
        event_id: eventId,
        title: UPCOMING_FLAGSHIP_EVENT.title,
        description: UPCOMING_FLAGSHIP_EVENT.description,
        event_date: UPCOMING_FLAGSHIP_EVENT.date,
        venue: "Seminar Hall",
        winner_team_name: winnerTeamName,
        snapshot_scoreboard: leaderboard,
        snapshot_teams: publicTeams
      };

      const archiveRes = await upsertArchive(payload);
      if (archiveRes.success) {
        setArchive(archiveRes.data);
        
        // 5. Port Round Submissions to Media
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
        alert('Snapshot generated successfully!');
      } else {
        alert('Error saving archive: ' + archiveRes.error);
      }
    } catch (err) {
      alert('Generation error: ' + err.message);
    }
    setLoading(false);
  };

  const handleUploadPoster = async () => {
    if (!archive || !eventPosterFile) return;
    setLoading(true);
    const path = `poster/${archive.id}_${Date.now()}.${eventPosterFile.name.split('.').pop()}`;
    const uploadRes = await uploadArchiveImage(eventPosterFile, path);
    if (uploadRes.success) {
      await addArchiveMedia({
        archive_id: archive.id,
        media_type: 'event_poster',
        image_url: uploadRes.url
      });
      // Also update event_poster_url on the archive directly for easy top-level access
      await upsertArchive({ event_id: archive.event_id, event_poster_url: uploadRes.url });
      setEventPosterFile(null);
      await loadArchive();
    }
    setLoading(false);
  };

  const handleUploadWinner = async () => {
    if (!archive || !winnerPhotoFile) return;
    setLoading(true);
    const path = `winner/${archive.id}_${Date.now()}.${winnerPhotoFile.name.split('.').pop()}`;
    const uploadRes = await uploadArchiveImage(winnerPhotoFile, path);
    if (uploadRes.success) {
      await addArchiveMedia({
        archive_id: archive.id,
        media_type: 'winner_photo',
        image_url: uploadRes.url
      });
      await upsertArchive({ event_id: archive.event_id, winner_photo_url: uploadRes.url });
      setWinnerPhotoFile(null);
      await loadArchive();
    }
    setLoading(false);
  };

  const handleUploadEventPhotos = async () => {
    if (!archive || eventPhotosFiles.length === 0) return;
    setLoading(true);
    for (const file of eventPhotosFiles) {
      const path = `gallery/${archive.id}_${Date.now()}_${file.name}`;
      const uploadRes = await uploadArchiveImage(file, path);
      if (uploadRes.success) {
        await addArchiveMedia({
          archive_id: archive.id,
          media_type: 'event_photo',
          image_url: uploadRes.url
        });
      }
    }
    setEventPhotosFiles([]);
    await loadArchive();
    setLoading(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm("Delete this media item?")) return;
    setLoading(true);
    await deleteArchiveMedia(mediaId);
    await loadArchive();
    setLoading(false);
  };

  const handleTogglePublish = async () => {
    if (!archive) return;
    const confirmMsg = archive.published ? "Unpublish this archive?" : "Publish this archive publicly?";
    if (!window.confirm(confirmMsg)) return;
    setLoading(true);
    const res = await toggleArchivePublish(archive.id, !archive.published);
    if (res.success) {
      await loadArchive();
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  const handleSetWinnerTeam = async (e) => {
    const newWinner = e.target.value;
    if (!archive) return;
    setLoading(true);
    const res = await upsertArchive({ event_id: archive.event_id, winner_team_name: newWinner });
    if (res.success) {
      await loadArchive();
    }
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Event Archive Management</h2>
        <p className="admin-panel-text">Generate historical snapshots and publish past events.</p>
      </div>

      <div className="admin-card">
        <h3>1. Select Event</h3>
        <p>Currently managing: <strong>{UPCOMING_FLAGSHIP_EVENT.title} ({UPCOMING_FLAGSHIP_EVENT.displayDate})</strong></p>
      </div>

      <div className="admin-card">
        <h3>2. Snapshot Generation</h3>
        <p style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.7 }}>
          This reads current game data (Teams, Submissions, Votes) and calculates the final scoreboard exactly as the live game does. 
          The data is permanently frozen in a JSONB snapshot.
        </p>
        <Button variant="signal" onClick={handleGenerateSnapshot} disabled={loading}>
          {archive ? 'REGENERATE SNAPSHOT' : 'GENERATE SNAPSHOT'}
        </Button>
      </div>

      {archive && (
        <>
          <div className="admin-card">
            <h3>3. Review Snapshot Data</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Winning Team Override</h4>
              <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>Defaults to Rank 1. Change if needed.</p>
              <select className="admin-select" style={{ width: '100%' }} value={archive.winner_team_name || ''} onChange={handleSetWinnerTeam}>
                {archive.snapshot_scoreboard.map(t => (
                  <option key={t.team_name} value={t.team_name}>{t.rank}. {t.team_name} ({t.total} pts)</option>
                ))}
              </select>
            </div>

            <div className="admin-placeholder-grid" style={{ marginTop: '16px' }}>
              <div className="admin-placeholder-card">
                <h4>Scoreboard</h4>
                <p style={{ fontSize: '24px', marginTop: '8px' }}>{archive.snapshot_scoreboard.length} Teams</p>
              </div>
              <div className="admin-placeholder-card">
                <h4>Teams & Members</h4>
                <p style={{ fontSize: '24px', marginTop: '8px' }}>{archive.snapshot_teams.length} Teams</p>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3>4. Upload Official Media</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
              <div>
                <h4>Event Poster</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => setEventPosterFile(e.target.files[0])} />
                  <Button variant="outline" size="sm" onClick={handleUploadPoster} disabled={!eventPosterFile || loading}>Upload</Button>
                </div>
                {archive.event_poster_url && <p style={{ fontSize: '14px', color: '#00ff64', marginTop: '8px' }}>✓ Poster uploaded</p>}
              </div>

              <div>
                <h4>Winner Photo</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => setWinnerPhotoFile(e.target.files[0])} />
                  <Button variant="outline" size="sm" onClick={handleUploadWinner} disabled={!winnerPhotoFile || loading}>Upload</Button>
                </div>
                {archive.winner_photo_url && <p style={{ fontSize: '14px', color: '#00ff64', marginTop: '8px' }}>✓ Winner photo uploaded</p>}
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4>Event Gallery Photos</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => setEventPhotosFiles(Array.from(e.target.files))} />
                  <Button variant="outline" size="sm" onClick={handleUploadEventPhotos} disabled={eventPhotosFiles.length === 0 || loading}>Upload All</Button>
                </div>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>{media.filter(m => m.media_type === 'event_photo').length} gallery photos uploaded.</p>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3>5. Media Gallery Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {media.map(m => (
                <div key={m.id} style={{ position: 'relative', border: '1px solid rgba(255,255,255,0.1)', padding: '8px' }}>
                  <img src={m.image_url} alt={m.media_type} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <div style={{ fontSize: '12px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.media_type}</div>
                  <button 
                    onClick={() => handleDeleteMedia(m.id)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'red', color: 'white', padding: '2px 4px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                  >
                    Del
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>6. Publication Status</h3>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>
                {archive.published ? '🟢 This archive is LIVE to the public.' : '🔴 This archive is currently HIDDEN.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="outline" onClick={() => window.location.hash = `#/archive/${archive.event_id}`}>
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
