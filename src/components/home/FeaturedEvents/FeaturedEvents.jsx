import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EVENTS_LIST } from '../../../data/eventsData';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import Badge from '../../common/Badge/Badge';
import './FeaturedEvents.css';

export default function FeaturedEvents({ onNavigate }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'

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

          {/* Filter Bar */}
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

        {/* Chronological Table/List */}
        <div className="events-timeline-table">
          <div className="timeline-table-head">
            <span className="col-date">Date</span>
            <span className="col-title">Event Title & Overview</span>
            <span className="col-category">Category</span>
            <span className="col-location">Location</span>
            <span className="col-action">Action</span>
          </div>

          <div className="timeline-table-body">
            {filteredEvents.map((event) => {
              const isUpcoming = event.status === 'upcoming';
              return (
                <div key={event.id} className="timeline-row">
                  <div className="col-date">
                    <span className="row-date-text">{event.displayDate}</span>
                    <Badge variant={isUpcoming ? 'signal' : 'neutral'} size="sm">
                      {isUpcoming ? '[UPCOMING]' : '[COMPLETED]'}
                    </Badge>
                  </div>

                  <div className="col-title">
                    <h4 className="row-event-title">{event.title}</h4>
                    <p className="row-event-desc">{event.description}</p>
                  </div>

                  <div className="col-category">
                    <span className="row-category-pill">{event.category}</span>
                  </div>

                  <div className="col-location">
                    <span className="row-location-text">{event.location}</span>
                  </div>

                  <div className="col-action">
                    {isUpcoming ? (
                      <button
                        type="button"
                        className="row-action-link row-action-register"
                        onClick={() => onNavigate && onNavigate('contact')}
                      >
                        <span>[Registration Link]</span>
                        <ArrowUpRight size={14} />
                      </button>
                    ) : (
                      <span className="row-action-past">
                        [Archive Link]
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
