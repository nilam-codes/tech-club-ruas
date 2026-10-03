import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getArchiveByEventId, getArchiveMedia } from '../../services/archiveService';

export default function ArchiveDetailPage({ eventId, onNavigate }) {
  const [archive, setArchive] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await getArchiveByEventId(eventId);
      if (res.success && res.data) {
        setArchive(res.data);
        
        // Fetch media
        const mRes = await getArchiveMedia(res.data.id);
        if (mRes.success) setMedia(mRes.data);
        setLoading(false);
      } else {
        setError('Archive not found or not published.');
        setLoading(false);
      }
    };
    if (eventId) load();
  }, [eventId]);

  if (loading) return <div className="section container text-center pt-32"><p style={{ color: 'var(--color-brand-orange)' }}>Accessing historical records...</p></div>;
  if (error || !archive) return <div className="section container text-center pt-32"><p>{error}</p></div>;

  const getMedia = (type, round) => {
    return media.filter(m => m.media_type === type && (round ? m.round_number === round : true));
  };

  const winnerPhoto = getMedia('winner_photo')[0]?.image_url;
  const eventPoster = getMedia('event_poster')[0]?.image_url;
  const gallery = getMedia('event_photo');
  const round1Subs = getMedia('round_submission', 1);
  const round2Subs = getMedia('round_submission', 2);
  const round3Subs = getMedia('round_submission', 3);

  const winnerTeamData = archive.snapshot_teams.find(t => t.team_name === archive.winner_team_name);

  return (
    <div className="section bg-grid-texture" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <button 
            type="button" 
            onClick={() => onNavigate && onNavigate('past-events')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Archives</span>
          </button>
        </div>

        {/* 1. EVENT HEADER */}
        <div style={{ marginBottom: '64px' }}>
          <div className="meta-label" style={{ marginBottom: '16px' }}>
            [ARCHIVE] // TECH CLUB // {archive.event_date}
          </div>
          <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '24px' }}>
            {archive.title}
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '32px', maxWidth: '600px' }}>
            {archive.description}
          </p>
          
          {eventPoster && (
            <div style={{ maxWidth: '600px', marginBottom: '32px' }}>
              <img src={eventPoster} alt="Event Poster" style={{ width: '100%', height: 'auto', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          )}
        </div>

        {/* 2. WINNER */}
        {archive.winner_team_name && (
          <div style={{ marginBottom: '64px', border: '1px solid var(--color-brand-orange)', padding: '32px', background: 'rgba(255, 60, 0, 0.05)' }}>
            <div className="meta-label" style={{ color: 'var(--color-brand-orange)', marginBottom: '16px' }}>CHAMPIONS</div>
            <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '16px' }}>{archive.winner_team_name}</h2>
            
            {winnerTeamData && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>TEAM MEMBERS:</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {winnerTeamData.members.map((m, i) => (
                    <li key={i} style={{ opacity: 0.9 }}>- {m.full_name}</li>
                  ))}
                </ul>
              </div>
            )}

            {winnerPhoto ? (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <img src={winnerPhoto} alt="Winners" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', border: '1px solid var(--color-brand-orange)' }} />
              </div>
            ) : (
              <div style={{ padding: '40px', border: '1px dashed var(--color-brand-orange)', color: 'var(--color-brand-orange)', textAlign: 'center', opacity: 0.7 }}>
                Winner photo not uploaded yet.
              </div>
            )}
          </div>
        )}

        {/* 3. FINAL SCOREBOARD */}
        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>FINAL SCOREBOARD</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ padding: '12px 8px' }}>Rank</th>
                  <th style={{ padding: '12px 8px' }}>Team</th>
                  <th style={{ padding: '12px 8px' }}>Final Score</th>
                </tr>
              </thead>
              <tbody>
                {archive.snapshot_scoreboard.map((t, i) => (
                  <tr key={t.team_name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '12px 8px', color: i === 0 ? 'var(--color-brand-orange)' : 'inherit', fontWeight: i === 0 ? 'bold' : 'normal' }}>{t.rank}</td>
                    <td style={{ padding: '12px 8px', fontWeight: i === 0 ? 'bold' : 'normal' }}>{t.team_name}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--color-brand-orange)' }}>{t.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3b. PARTICIPATING TEAMS */}
        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>PARTICIPATING TEAMS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
            {archive.snapshot_teams.map((t, i) => (
              <div key={i} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ color: 'var(--color-brand-orange)', marginBottom: '8px', fontSize: '1.1rem' }}>{t.team_name}</h4>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                  {t.members.map((m, idx) => (
                    <li key={idx}>- {m.full_name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ROUND SUBMISSIONS */}
        {[
          { num: 1, title: 'ROUND 1 - THE WORST SUPERHERO', subs: round1Subs },
          { num: 2, title: 'ROUND 2 - GOVERNMENT ANNOUNCEMENT', subs: round2Subs },
          { num: 3, title: 'ROUND 3 - FINAL COOKING', subs: round3Subs }
        ].map(round => round.subs.length > 0 && (
          <div key={round.num} style={{ marginBottom: '64px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', textTransform: 'uppercase' }}>{round.title}</h3>
            <div style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', opacity: 0.8, fontSize: '0.9rem' }}>
              Challenge Submissions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
              {round.subs.map(sub => (
                <div key={sub.id} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <img src={sub.image_url} alt="Submission" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="meta-label">TEAM: {sub.team_name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 5. EVENT GALLERY */}
        {gallery.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>EVENT GALLERY</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {gallery.map(photo => (
                <img key={photo.id} src={photo.image_url} alt="Gallery" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

