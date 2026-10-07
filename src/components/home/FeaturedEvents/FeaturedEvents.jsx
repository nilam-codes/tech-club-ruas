import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getEvents } from '../../../services/eventsService';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import Badge from '../../common/Badge/Badge';
import './FeaturedEvents.css';

function EventCard({ event, onNavigate }) {
  const cardRef = useRef(null);
  const isUpcoming = event.lifecycle_status === 'REGISTRATION_OPEN' || event.lifecycle_status === 'REGISTRATION_CLOSED' || event.status === 'upcoming';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardRef.current.style.transition = 'none';
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

  const getDisplayDate = () => {
    if (event.displayDate) return event.displayDate;
    if (event.event_date) {
      return new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return '[TBA]';
  };

  const getCategory = () => {
    if (event.category) return event.category;
    if (event.club) return event.club;
    return 'EVENT';
  };

  const getLocation = () => {
    return event.location || event.venue || '[TBA]';
  };

  return (
    <div 
      className="event-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(`event/${event.id}`)}
    >
      <div className="event-card corner-brackets" ref={cardRef}>
        
        <div className="event-card-content">
          <div className="event-card-header">
            <span className="event-card-date">{getDisplayDate()}</span>
            <Badge variant={isUpcoming ? 'signal' : 'neutral'} size="sm">
              {isUpcoming ? '[UPCOMING]' : '[COMPLETED]'}
            </Badge>
          </div>
          
          <div className="meta-label event-card-meta">
            RUAS // {getCategory().toUpperCase()} // BCA
          </div>
          
          <h4 className="event-card-title">{event.title}</h4>
          <p className="event-card-desc">{event.description}</p>
          
          <div className="event-card-footer">
            <div className="event-card-location">{getLocation()}</div>
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const { data } = await getEvents({});
      if (data) {
        setEvents(data);
      }
      setLoading(false);
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const isUpcoming = event.lifecycle_status === 'REGISTRATION_OPEN' || event.lifecycle_status === 'REGISTRATION_CLOSED' || event.status === 'upcoming';
    const isPast = event.lifecycle_status === 'COMPLETED' || event.lifecycle_status === 'ARCHIVED' || event.status === 'past';
    
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'past') return isPast;
    return true;
  });

  const countUpcoming = events.filter(e => e.lifecycle_status === 'REGISTRATION_OPEN' || e.lifecycle_status === 'REGISTRATION_CLOSED' || e.status === 'upcoming').length;
  const countPast = events.filter(e => e.lifecycle_status === 'COMPLETED' || e.lifecycle_status === 'ARCHIVED' || e.status === 'past').length;

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
              All ({events.length})
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({countUpcoming})
            </button>
            <button
              type="button"
              className={`timeline-filter-btn ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past ({countPast})
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#00ffcc', padding: '2rem 0', fontFamily: 'JetBrains Mono', fontSize: '0.875rem' }}>
            [SYSTEM] Loading events data...
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
