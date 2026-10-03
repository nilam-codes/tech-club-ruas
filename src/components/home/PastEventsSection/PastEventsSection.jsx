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

  return (
    <section className="section bg-grid-texture">
      <div className="container">
        <SectionHeader
          index="03"
          category="ARCHIVE"
          title="Past Events"
          subtitle="Explore the history of completed challenges and champions."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {archives.map(arch => (
            <div key={arch.id} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
              <div className="meta-label" style={{ marginBottom: '16px' }}>
                {arch.event_date}
              </div>
              
              {arch.event_poster_url && (
                <img src={arch.event_poster_url} alt={arch.title} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
              )}
              
              <h3 style={{ fontSize: '20px', textTransform: 'uppercase', marginBottom: '8px' }}>{arch.title}</h3>
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '24px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {arch.description}
              </p>
              
              <Button variant="outline" onClick={() => window.location.hash = `#/archive/${arch.event_id}`} icon={ArrowRight}>
                VIEW
              </Button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Button variant="outline" onClick={() => onNavigate && onNavigate('past-events')}>
            VIEW ALL PAST EVENTS
          </Button>
        </div>
      </div>
    </section>
  );
}

