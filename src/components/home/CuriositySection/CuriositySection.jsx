import React, { useEffect, useRef } from 'react';
import './CuriositySection.css';

const TOPICS = [
  { id: '01', title: 'CODE' },
  { id: '02', title: 'DESIGN' },
  { id: '03', title: 'AI' },
  { id: '04', title: 'BUILDING' },
  { id: '05', title: 'EXPERIMENTING' },
  { id: '06', title: 'EVERYTHING ELSE' }
];

export default function CuriositySection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    const items = containerRef.current.querySelectorAll('.curiosity-item');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="curiosity-section" ref={containerRef}>
      <div className="container">
        <h2 className="curiosity-heading">WHAT ARE WE CURIOUS ABOUT?</h2>
        
        <div className="curiosity-list">
          {TOPICS.map((topic, index) => (
            <div key={topic.id} className="curiosity-item" style={{ transitionDelay: `${index * 0.1}s` }}>
              <span className="curiosity-id">{topic.id} &mdash;</span>
              <span className="curiosity-title">{topic.title}</span>
              <div className="curiosity-hover-line"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
