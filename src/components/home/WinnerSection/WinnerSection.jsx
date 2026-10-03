import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getPublishedArchives } from '../../../services/archiveService';
import Button from '../../common/Button/Button';
import './WinnerSection.css';

export default function WinnerSection() {
  const [winnerArchive, setWinnerArchive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getPublishedArchives();
      if (res.success && res.data && res.data.length > 0) {
        // Permanently represent the first event (Cooked Without Code)
        const FIRST_EVENT_ID = '6c6718bf-12b8-4b2a-a172-52d62fe4250f';
        const firstEventArchive = res.data.find(a => a.event_id === FIRST_EVENT_ID && a.winner_team_name && a.winner_photo_url);
        if (firstEventArchive) {
          setWinnerArchive(firstEventArchive);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !winnerArchive) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).toUpperCase();
    } catch (e) {
      return dateStr;
    }
  };

  const handleScrollToPastEvents = () => {
    const el = document.getElementById('past-events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="winner-section section" style={{ background: 'var(--color-bg-paper)' }}>
      <div className="container">
        
        <div className="winner-header">
          <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: 'var(--color-text-dark)', marginBottom: '32px', textAlign: 'center', letterSpacing: '-0.02em', fontWeight: 600 }}>
            WINNER OF OUR FIRST EVENT
          </h2>
        </div>

        <div className="winner-editorial-card">
          <img 
            src={winnerArchive.winner_photo_url} 
            alt={`Winners: ${winnerArchive.winner_team_name}`}
            className="winner-hero-image"
          />
          
          <div className="winner-content-box">
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {winnerArchive.title}
            </h3>
            <div style={{ color: 'var(--color-brand-orange)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '24px' }}>
              {formatDate(winnerArchive.event_date)}
            </div>
            
            <div className="meta-label" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              CHAMPIONS
            </div>
            <h4 style={{ fontSize: '2rem', textTransform: 'uppercase', color: 'var(--color-text-dark)', marginBottom: '16px' }}>
              {winnerArchive.winner_team_name}
            </h4>

            <p style={{ color: 'var(--color-text-dark)', opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              {winnerArchive.description}
            </p>
            
            <Button variant="outline" onClick={handleScrollToPastEvents} icon={ArrowRight} style={{ borderColor: 'var(--color-text-dark)', color: 'var(--color-text-dark)' }}>
              VIEW PAST EVENT
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
