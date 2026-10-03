import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPublishedArchives } from '../../services/archiveService';
import Button from '../../components/common/Button/Button';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';

export default function PastEventsPage({ onNavigate }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getPublishedArchives();
      if (res.success) setArchives(res.data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="section bg-grid-texture" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <button 
            type="button" 
            onClick={() => onNavigate && onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </div>

        <SectionHeader
          index="00"
          category="EVENT ARCHIVE"
          title="Past Events & Challenges"
          subtitle="A historical record of completed events, projects, and winners."
        />

        {loading ? (
          <p style={{ color: 'var(--color-brand-orange)' }}>Loading archives...</p>
        ) : archives.length === 0 ? (
          <div style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <p>No published archives available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {archives.map(arch => (
              <div key={arch.id} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
                <div className="meta-label" style={{ marginBottom: '16px' }}>
                  {arch.event_date} // {arch.venue}
                </div>
                
                {arch.event_poster_url && (
                  <img src={arch.event_poster_url} alt={arch.title} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
                )}
                
                <h3 style={{ fontSize: '24px', textTransform: 'uppercase', marginBottom: '8px' }}>{arch.title}</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '24px' }}>
                  {arch.description}
                </p>
                
                <Button variant="outline" onClick={() => window.location.hash = `#/archive/${arch.event_id}`} icon={ArrowRight}>
                  VIEW ARCHIVE
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

