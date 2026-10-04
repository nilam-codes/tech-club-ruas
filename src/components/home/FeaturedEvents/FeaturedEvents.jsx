import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EVENTS_LIST } from '../../../data/eventsData';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import Badge from '../../common/Badge/Badge';
import './FeaturedEvents.css';

function EventCard({ event, onNavigate }) {
  const cardRef = useRef(null);
    const isUpcoming = event.status === 'upcoming';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

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
      className="event-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => isUpcoming && onNavigate && onNavigate(event.route ? event.route.replace('/events/', '') : 'contact')}
    >
      <div className="event-card" ref={cardRef} >
        
        <div className="event-card-content">
          <div className="event-card-header">
            <span className="event-card-date">{event.displayDate}</span>
            <Badge variant={isUpcoming ? 'signal' : 'neutral'} size="sm">
              {isUpcoming ? '[UPCOMING]' : '[COMPLETED]'}
            </Badge>
          </div>
          
          <div className="meta-label event-card-meta">
            RUAS // {event.category.toUpperCase()} // BCA
          </div>
          
          <h4 className="event-card-title">{event.title}</h4>
          <p className="event-card-desc">{event.description}</p>
          
          <div className="event-card-footer">
            <div className="event-card-location">{event.location || '[TBA]'}</div>
            <div className="event-card-action">
              {isUpcoming ? (
                <span className="action-link">
                  {event.ctaText ? `[${event.ctaText}]` : '[REGISTER]'} <ArrowUpRight size={14} />
                </span>
              ) : (
                <span className="action-past">[VIEW ARCHIVE]</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedEvents({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  const filteredEvents = EVENTS_LIST.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  return (
    <section className="events-timeline-section section" id="events">
      <div className="container">
        <div className="events-timeline-header-row">
          <SectionHeader
            index="03"
            category="EVENTS SCHEDULE"
            title="Upcoming & Concluded Events"
            subtitle="Chronological record of our technical workshops, competitions, and collaborative community sessions."
          />

          <div className="timeline-filter-bar">
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({EVENTS_LIST.length})
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({EVENTS_LIST.filter(e => e.status === 'upcoming').length})
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past ({EVENTS_LIST.filter(e => e.status === 'past').length})
            </button>
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
