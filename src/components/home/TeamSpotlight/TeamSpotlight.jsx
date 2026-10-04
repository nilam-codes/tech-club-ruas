import React, { useState, useEffect, useRef } from 'react';
import { getPublicTeamMembers } from '../../../services/teamService';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import { User } from 'lucide-react';
import './TeamSpotlight.css';

function TeamCard({ member }) {
  const cardRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current || !window.matchMedia('(hover: hover)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        cardRef.current.style.transition = 'none';
      }
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !window.matchMedia('(hover: hover)').matches) return;
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      }
    });
  };

  return (
    <div 
      className="team-member-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="team-member-card corner-brackets" ref={cardRef}>
        <div className="member-photo-wrap">
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.name} className="member-portrait-frame" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
          ) : (
            <div className="member-portrait-frame" style={{ width: '100%', aspectRatio: '1/1', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <User size={48} />
            </div>
          )}
          <div className="member-role-reveal">
            <span>{member.role}</span>
          </div>
        </div>

        <div className="member-info">
          <h3 className="member-name">{member.name}</h3>
          <p className="member-role text-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{member.role}</p>
          <span className="member-year text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{member.year}</span>
        </div>
      </div>
    </div>
  );
}

export default function TeamSpotlight() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      const data = await getPublicTeamMembers();
      setMembers(data);
      setLoading(false);
    }
    loadMembers();
  }, []);

  return (
    <section className="team-spotlight-section section" id="team">
      <div className="container">
        <div className="team-spotlight-header-row">
          <SectionHeader
            category="team"
            title="THE PEOPLE BEHIND THE CLUB."
            subtitle="The student coordinators responsible for planning workshops, organizing hackathons, and maintaining club infrastructure."
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            $ Loading team registry...
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [ No active team members found in the database. ]
          </div>
        ) : (
          <div className="team-spotlight-grid">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
