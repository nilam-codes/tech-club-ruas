import React from 'react';
import { ArrowRight } from 'lucide-react';
import { UPCOMING_FLAGSHIP_EVENT } from '../../../data/eventsData';
import Button from '../../common/Button/Button';
import Badge from '../../common/Badge/Badge';
import './UpcomingEvent.css';

export default function UpcomingEvent({ onNavigate }) {
  const handleEnterArena = () => {
    if (onNavigate) {
      onNavigate('ai-challenge');
    }
  };

  return (
    <section className="upcoming-event-section section" id="up-next">
      <div className="container">
        {/* Section Index */}
        <div className="section-index">
          <span className="section-index-num">02</span>
          <span className="section-index-slash">/</span>
          <span className="section-index-cat">UP NEXT</span>
        </div>

        {/* Featured Arena Box — Prominent Editorial Highlight */}
        <div className="arena-editorial-card">
          <div className="arena-editorial-grid">
            {/* Left Column: Big Typography & Action */}
            <div className="arena-primary-col">
              <div className="arena-top-meta">
                <span className="arena-date">{UPCOMING_FLAGSHIP_EVENT.displayDate}</span>
                <Badge variant="signal" size="sm">
                  FIRST LIVE INTERACTIVE EVENT
                </Badge>
              </div>

              <h2 className="arena-headline">{UPCOMING_FLAGSHIP_EVENT.title}</h2>

              <p className="arena-description">
                {UPCOMING_FLAGSHIP_EVENT.description}
              </p>

              <div className="arena-cta-row">
                <Button
                  variant="signal"
                  size="lg"
                  onClick={handleEnterArena}
                  icon={ArrowRight}
                  className="enter-arena-btn"
                >
                  ENTER THE ARENA
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate && onNavigate('events')}
                >
                  View All Events
                </Button>
              </div>

              <div className="arena-footnote">
                <span>Ramaiah University of Applied Sciences • Tech Club</span>
              </div>
            </div>

            {/* Right Column: Interactive Arena Spec Preview */}
            <div className="arena-preview-col">
              <div className="arena-spec-panel">
                <div className="spec-panel-header">
                  <span className="spec-panel-index">01 // LIVE EVENT BRIEF</span>
                  <span className="spec-status-pill">
                    <span className="spec-status-dot"></span>
                    INTERACTIVE FORMAT
                  </span>
                </div>

                <div className="spec-panel-body">
                  <div className="spec-arena-title">
                    <span>LIVE COMPETITION ARENA</span>
                  </div>

                  <ul className="spec-feature-list">
                    <li className="spec-feature-item">
                      <span className="spec-feature-num">01</span>
                      <div className="spec-feature-text">
                        <strong>Creative AI Problem Solving</strong>
                        <p>Apply AI tooling and creative reasoning to solve prompt & engineering challenges.</p>
                      </div>
                    </li>
                    <li className="spec-feature-item">
                      <span className="spec-feature-num">02</span>
                      <div className="spec-feature-text">
                        <strong>Unexpected Real-Time Challenges</strong>
                        <p>Dynamic rounds with evolving constraints tested live in front of the club.</p>
                      </div>
                    </li>
                    <li className="spec-feature-item">
                      <span className="spec-feature-num">03</span>
                      <div className="spec-feature-text">
                        <strong>Points & Live Leaderboard</strong>
                        <p>Compete individually or in squads for round-by-round point scoring.</p>
                      </div>
                    </li>
                  </ul>

                  <div className="spec-panel-footer">
                    <span className="spec-footer-label">SCHEDULED DATE:</span>
                    <span className="spec-footer-val">{UPCOMING_FLAGSHIP_EVENT.displayDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
