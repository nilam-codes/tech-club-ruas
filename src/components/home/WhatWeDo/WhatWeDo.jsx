import React, { useRef, useState } from 'react';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import './WhatWeDo.css';

const ACTIVITIES = [
  { num: "01", title: "WORKSHOPS", description: "Hands-on technical sessions." },
  { num: "02", title: "EVENTS", description: "Tech meetups and showcases." },
  { num: "03", title: "PROJECTS", description: "Building real-world applications." },
  { num: "04", title: "HACKATHONS", description: "Rapid prototyping challenges." },
  { num: "05", title: "COMPETITIONS", description: "Test your skills against others." },
  { num: "06", title: "COMMUNITY", description: "A place for curious minds." }
];

function InteractiveCard({ activity }) {
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
      transform: `perspective(1000px) rotateX(deg) rotateY(deg) scale3d(1.02, 1.02, 1.02)`,
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
      className="what-we-do-card-wrapper" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="what-we-do-card" ref={cardRef} >
        <div className="what-we-do-card-content">
          <div className="activity-num">{activity.num}</div>
          <h3 className="activity-title">{activity.title}</h3>
          <p className="activity-desc">{activity.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function WhatWeDo() {
  return (
    <section className="what-we-do-section section" id="what-we-do">
      <div className="container">
        <SectionHeader
          index="01"
          category="WHAT WE DO"
          title="Technology is better when you build it together."
        />

        <div className="what-we-do-grid">
          {ACTIVITIES.map((act) => (
            <InteractiveCard key={act.num} activity={act} />
          ))}
        </div>
      </div>
    </section>
  );
}
