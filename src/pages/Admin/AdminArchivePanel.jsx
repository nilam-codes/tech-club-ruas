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
  deleteArchiveMedia,
  deleteArchiveImage
} from '../../services/archiveService';
import { UPCOMING_FLAGSHIP_EVENT } from '../../data/eventsData';
import Button from '../../components/common/Button/Button';
import ImageCropper from '../../components/common/ImageCropper';
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
  
  // Cropper State
  const [cropTarget, setCropTarget] = useState(null);
  const [galleryQueue, setGalleryQueue] = useState([]);
  const [croppedGalleryPhotos, setCroppedGalleryPhotos] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [winnerPreview, setWinnerPreview] = useState(null);
  const [editMediaTarget, setEditMediaTarget] = useState(null);
  
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
              throw new Error(`Could not resolve participant name for registration ID ${tm.registration_id}. Snapshot was not updated.`);
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
      title: editTitle,
      description: editDesc,
      event_date: editDate,
      venue: editVenue,
      winner_team_name: editWinnerName,
      snapshot_teams: teamsEditor,
      snapshot_scoreboard: scoreboardEditor
    };
    
    const { error } = await supabase.from('event_archives').update(payload).eq('id', archive.id);
    if (!error) {
      await loadArchive();
      alert("Archive details updated successfully.");
    } else {
      alert("Failed to update: " + error.message);
    }
    setLoading(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm("Remove this media?")) return;
    setLoading(true);
    const mediaItem = media.find(m => m.id === mediaId);
    
    // Delete from storage
    if (mediaItem && mediaItem.image_url) {
      await deleteArchiveImage(mediaItem.image_url);
    }
    
    // Delete from DB
    await deleteArchiveMedia(mediaId);
    
    // Keep event_archives consistent if it was a winner photo or poster
    if (mediaItem) {
      if (mediaItem.media_type === 'winner_photo') await supabase.from('event_archives').update({ winner_photo_url: null }).eq('id', archive.id);
      if (mediaItem.media_type === 'event_poster') await supabase.from('event_archives').update({ event_poster_url: null }).eq('id', archive.id);
    }
    
    await loadArchive();
    setLoading(false);
  };
  
  const handleUpdateMediaTeamName = async (mediaId, newTeamName) => {
    setLoading(true);
    await supabase.from('event_archive_media').update({ team_name: newTeamName }).eq('id', mediaId);
    await loadArchive();
    setLoading(false);
  };

  // Crop Handlers
  const handleEditCropSave = async (croppedBlob) => {
    if (!editMediaTarget || !archive) return;
    
    const ext = editMediaTarget.image_url.split('.').pop() || 'jpg';
    const croppedFile = new File([croppedBlob], `edited_${Date.now()}.${ext}`, { type: 'image/jpeg' });
    
    setLoading(true);
    setEditMediaTarget(null);
    
    let folder = 'gallery';
    if (editMediaTarget.media_type === 'event_poster') folder = 'poster';
    if (editMediaTarget.media_type === 'winner_photo') folder = 'winner';
    const path = `${folder}/${archive.id}_${Date.now()}_edited.${ext}`;
    
    const uploadRes = await uploadArchiveImage(croppedFile, path);
    if (!uploadRes.success) {
      alert('Image update failed. The existing image was kept.');
      setLoading(false);
      return;
    }
    
    const { error: updateError } = await supabase
      .from('event_archive_media')
      .update({ image_url: uploadRes.url })
      .eq('id', editMediaTarget.id);
      
    if (updateError) {
      alert('Image update failed at database level. The existing image was kept.');
      setLoading(false);
      return;
    }

    if (editMediaTarget.media_type === 'event_poster') {
      await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
    } else if (editMediaTarget.media_type === 'winner_photo') {
      await supabase.from('event_archives').update({ winner_photo_url: uploadRes.url }).eq('id', archive.id);
    }

    if (editMediaTarget.image_url) {
      await deleteArchiveImage(editMediaTarget.image_url);
    }

    alert('Image updated successfully.');
    await loadArchive();
    setLoading(false);
  };

  const handleCropSave = (croppedBlob) => {
    const originalFile = cropTarget.file;
    const croppedFile = new File([croppedBlob], originalFile.name, { type: 'image/jpeg' });
    const previewUrl = URL.createObjectURL(croppedBlob);

    if (cropTarget.type === 'poster') {
      setEventPosterFile(croppedFile);
      setPosterPreview(previewUrl);
      setCropTarget(null);
    } else if (cropTarget.type === 'winner') {
      setWinnerPhotoFile(croppedFile);
      setWinnerPreview(previewUrl);
      setCropTarget(null);
    } else if (cropTarget.type === 'gallery') {
      setCroppedGalleryPhotos(prev => [...prev, { file: croppedFile, preview: previewUrl }]);
      if (galleryQueue.length > 0) {
        const next = galleryQueue[0];
        setCropTarget({ type: 'gallery', file: next, url: URL.createObjectURL(next) });
        setGalleryQueue(prev => prev.slice(1));
      } else {
        setCropTarget(null);
      }
    }
  };

  const handleCropCancel = () => {
    setCropTarget(null);
    if (cropTarget?.type === 'gallery') {
      setGalleryQueue([]);
    }
  };

  // Upload Handlers
  const handleUploadPoster = async () => {
    if (!archive || !eventPosterFile) return;
    setLoading(true);
    const path = `poster/${archive.id}_${Date.now()}.${eventPosterFile.name.split('.').pop()}`;
    const uploadRes = await uploadArchiveImage(eventPosterFile, path);
    if (uploadRes.success) {
      const existing = media.find(m => m.media_type === 'event_poster');
      if (existing) {
        if (existing.image_url) await deleteArchiveImage(existing.image_url);
        await deleteArchiveMedia(existing.id);
      }
      await addArchiveMedia({ archive_id: archive.id, media_type: 'event_poster', image_url: uploadRes.url });
      await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
      setEventPosterFile(null);
      setPosterPreview(null);
      await loadArchive();
    } else {
      alert('Upload failed: ' + uploadRes.error);
    }
    setLoading(false);
  };

  const handleUploadWinner = async () => {
    if (!archive || !winnerPhotoFile) return;
    setLoading(true);
    const path = `winner/${archive.id}_${Date.now()}.${winnerPhotoFile.name.split('.').pop()}`;
    console.log('--- WINNER PHOTO UPLOAD DIAGNOSTIC ---');
    console.log('1. Storage Path generated:', path);
    
    const uploadRes = await uploadArchiveImage(winnerPhotoFile, path);
    console.log('2. Upload Result:', uploadRes);
    
    if (uploadRes.success) {
      const existing = media.find(m => m.media_type === 'winner_photo');
      if (existing) {
        if (existing.image_url) await deleteArchiveImage(existing.image_url);
        await deleteArchiveMedia(existing.id);
      }
      
      const mediaRes = await addArchiveMedia({ archive_id: archive.id, media_type: 'winner_photo', image_url: uploadRes.url });
      console.log('3. Media Row Result:', mediaRes);
      
      const archiveUpdateRes = await supabase.from('event_archives').update({ winner_photo_url: uploadRes.url }).eq('id', archive.id);
      console.log('4. Archive Update Result:', archiveUpdateRes);
      
      setWinnerPhotoFile(null);
      setWinnerPreview(null);
      await loadArchive();
    } else {
      alert('Upload failed: ' + uploadRes.error);
    }
    setLoading(false);
  };

  const handleUploadEventPhotos = async () => {
    if (!archive || croppedGalleryPhotos.length === 0) return;
    setLoading(true);
    for (const item of croppedGalleryPhotos) {
      const path = `gallery/${archive.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.${item.file.name.split('.').pop()}`;
      const uploadRes = await uploadArchiveImage(item.file, path);
      if (uploadRes.success) {
        await addArchiveMedia({ archive_id: archive.id, media_type: 'event_photo', image_url: uploadRes.url });
      }
    }
    setCroppedGalleryPhotos([]);
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
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  {posterPreview ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={posterPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button onClick={() => { setPosterPreview(null); setEventPosterFile(null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => {
                      const file = e.target.files[0];
                      if (file) setCropTarget({ type: 'poster', file, url: URL.createObjectURL(file) });
                      e.target.value = null;
                    }} />
                  )}
                  <Button variant="signal" size="sm" onClick={handleUploadPoster} disabled={!eventPosterFile || loading}>SAVE / UPLOAD POSTER</Button>
                </div>
              </div>

              <div>
                <h4>Winner Photo</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  {winnerPreview ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={winnerPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button onClick={() => { setWinnerPreview(null); setWinnerPhotoFile(null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Select an image to crop</p>
                      <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => {
                        const file = e.target.files[0];
                        if (file) setCropTarget({ type: 'winner', file, url: URL.createObjectURL(file) });
                        e.target.value = null;
                      }} />
                    </>
                  )}
                  <Button variant="signal" size="sm" onClick={handleUploadWinner} disabled={!winnerPhotoFile || loading}>SAVE / UPLOAD WINNER</Button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4>Event Gallery Photos</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  {croppedGalleryPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                      {croppedGalleryPhotos.map((p, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => setCroppedGalleryPhotos(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '2px 4px', fontSize: '10px', cursor: 'pointer' }}>X</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        const first = files[0];
                        setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                        setGalleryQueue(files.slice(1));
                      }
                      e.target.value = null;
                    }} />
                    <Button variant="signal" size="sm" onClick={handleUploadEventPhotos} disabled={croppedGalleryPhotos.length === 0 || loading}>SAVE / UPLOAD GALLERY ({croppedGalleryPhotos.length})</Button>
                  </div>
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

                  {!m.media_type.startsWith('round') && (
                    <button 
                      onClick={() => setEditMediaTarget(m)} 
                      style={{ position: 'absolute', top: '4px', right: '54px', background: 'var(--color-brand-orange)', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                    >
                      Edit
                    </button>
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
      
      {cropTarget && (
        <ImageCropper
          imageSrc={cropTarget.url}
          onCrop={handleCropSave}
          onCancel={handleCropCancel}
          aspectRatio={cropTarget.type === 'winner' ? '16/9' : cropTarget.type === 'gallery' ? '1/1' : null}
        />
      )}
      
      {editMediaTarget && (
        <ImageCropper
          imageSrc={editMediaTarget.image_url}
          onCrop={handleEditCropSave}
          onCancel={() => setEditMediaTarget(null)}
          aspectRatio={editMediaTarget.media_type === 'winner_photo' ? '16/9' : editMediaTarget.media_type === 'event_photo' ? '1/1' : null}
        />
      )}
    </div>
  );
}
