import React, { useState, useRef } from 'react';
import { TEAM_MEMBERS } from '../../../data/teamData';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import ImagePlaceholder from '../../common/ImagePlaceholder/ImagePlaceholder';
import './TeamSpotlight.css';

function TeamCard({ member }) {
  const cardRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none'
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
      <div className="team-member-card" ref={cardRef} >
        <div className="member-photo-wrap">
          <ImagePlaceholder
            aspectRatio="1/1"
            label="Member Portrait"
            sublabel="Reserved for actual student photograph"
            className="member-portrait-frame"
          />
          <div className="member-role-reveal">
            <span>{member.role}</span>
          </div>
        </div>

        <div className="member-info">
          <h3 className="member-name">{member.name}</h3>
          <span className="member-year">{member.year}</span>
          <p className="member-bio">{member.bio}</p>

          <div className="member-links-row">
            <span className="member-placeholder-link">
              {member.github}
            </span>
            <span className="member-placeholder-divider">|</span>
            <span className="member-placeholder-link">
              {member.linkedin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamSpotlight() {
  return (
    <section className="team-spotlight-section section" id="team">
      <div className="container">
        <div className="team-spotlight-header-row">
          <SectionHeader
            index="06"
            category="LEADERSHIP & CORE TEAM"
            title="Student Organizers & Leads"
            subtitle="The student coordinators responsible for planning workshops, organizing hackathons, and maintaining club infrastructure."
          />
        </div>

        <div className="team-spotlight-grid">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
