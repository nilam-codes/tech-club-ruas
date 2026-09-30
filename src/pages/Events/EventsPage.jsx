import React from 'react';
import UpcomingEvent from '../../components/home/UpcomingEvent/UpcomingEvent';
import FeaturedEvents from '../../components/home/FeaturedEvents/FeaturedEvents';

export default function EventsPage({ onNavigate }) {
  return (
    <div className="events-page">
      {/* Spotlight Flagship AI Event */}
      <UpcomingEvent onNavigate={onNavigate} />

      {/* Complete Events Catalog with Upcoming & Past filters */}
      <FeaturedEvents onNavigate={onNavigate} />
    </div>
  );
}

