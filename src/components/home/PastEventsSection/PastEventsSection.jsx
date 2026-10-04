import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getPublishedArchives } from '../../../services/archiveService';
import Button from '../../common/Button/Button';
import SectionHeader from '../../common/SectionHeader/SectionHeader';

export default function PastEventsSection({ onNavigate }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getPublishedArchives();
      if (res.success) {
        // Limit to latest 3 for home page
        setArchives(res.data.slice(0, 3));
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading || archives.length === 0) return null;

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

  return (
    <section id="past-events" className="section bg-grid-texture">
      <div className="container">
        <SectionHeader
          index="04"
          category="ARCHIVE"
          title="Past Events"
          subtitle="Explore the history of completed challenges and champions."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {archives.map(arch => (
            <div key={arch.id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
              
              {arch.event_poster_url ? (
                <img 
                  src={arch.event_poster_url} 
                  alt={arch.title} 
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }} 
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-orange)', fontSize: '14px', letterSpacing: '0.1em' }}>
                  EVENT RECORD
                </div>
              )}
              
              <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1.2 }}>{arch.title}</h3>
              <div className="meta-label" style={{ marginBottom: '16px', color: 'var(--color-brand-orange)' }}>
                {formatDate(arch.event_date)}
              </div>

              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '32px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', flexGrow: 1 }}>
                {arch.description}
              </p>
              
              <div style={{ marginTop: 'auto' }}>
                <Button variant="outline" onClick={() => window.location.hash = `#/archive/${arch.event_id}`} style={{ width: '100%' }}>
                  VIEW EVENT <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
