import React, { useState, useEffect } from 'react';
import UpcomingEvent from '../../components/home/UpcomingEvent/UpcomingEvent';
import { getEvents } from '../../services/eventsService';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Badge from '../../components/common/Badge/Badge';
import { ArrowUpRight } from 'lucide-react';
import '../../components/home/FeaturedEvents/FeaturedEvents.css'; // Reuse CSS

function EventCard({ event, onNavigate }) {
  const isUpcoming = event.lifecycle_status === 'REGISTRATION_OPEN' || event.lifecycle_status === 'REGISTRATION_CLOSED' || event.status === 'upcoming';

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
      onClick={() => onNavigate(`event/${event.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="event-card corner-brackets">
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

export default function EventsPage({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubFilter, setClubFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
    
    let statusMatch = true;
    if (statusFilter === 'upcoming') statusMatch = isUpcoming;
    if (statusFilter === 'past') statusMatch = isPast;

    let clubMatch = true;
    if (clubFilter !== 'all') {
      const eClub = (event.club || event.category || '').toLowerCase();
      clubMatch = eClub.includes(clubFilter);
    }

    return statusMatch && clubMatch;
  });

  return (
    <div className="events-page" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#050807' }}>
      <UpcomingEvent onNavigate={onNavigate} />

      <section className="events-timeline-section section" id="events-hub">
        <div className="container">
          <div className="events-timeline-header-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2rem' }}>
            <SectionHeader
              index="EVENTS"
              category="CENTRAL HUB"
              title="All Events"
              subtitle="Explore technical workshops, cultural fests, and sports events across the university."
            />

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%' }}>
              <div className="timeline-filter-bar" style={{ margin: 0 }}>
                <span style={{ color: '#8892b0', fontSize: '0.875rem', fontFamily: 'JetBrains Mono', marginRight: '1rem' }}>CLUB:</span>
                {['all', 'tech', 'cultural', 'sports'].map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`timeline-filter-btn ${clubFilter === c ? 'active' : ''}`}
                    onClick={() => setClubFilter(c)}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="timeline-filter-bar" style={{ margin: 0 }}>
                <span style={{ color: '#8892b0', fontSize: '0.875rem', fontFamily: 'JetBrains Mono', marginRight: '1rem' }}>STATUS:</span>
                {['all', 'upcoming', 'past'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`timeline-filter-btn ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ color: '#00ffcc', padding: '4rem 0', fontFamily: 'JetBrains Mono', fontSize: '0.875rem' }}>
              [SYSTEM] Loading events catalog...
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onNavigate={onNavigate} />
              ))}
              {filteredEvents.length === 0 && (
                <div style={{ color: '#8892b0', padding: '2rem 0', fontFamily: 'JetBrains Mono', gridColumn: '1 / -1' }}>
                  No events found matching the selected filters.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
