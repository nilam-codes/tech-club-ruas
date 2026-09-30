import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CLUB_INFO } from '../../../data/clubInfo';
import Button from '../../common/Button/Button';
import './SocialCTA.css';

export default function SocialCTA({ onNavigate }) {
  return (
    <section className="join-cta-section section" id="join">
      <div className="container">
        <div className="join-cta-box flat-panel">
          <div className="join-cta-inner">
            <div className="section-index">
              <span>06 / MEMBERSHIP & INTAKE</span>
            </div>

            <h2 className="join-cta-title">
              Interested in Building With Us?
            </h2>

            <p className="join-cta-lead">
              {CLUB_INFO.name} is open to all students at {CLUB_INFO.college}. Whether you write code, design interfaces, or are simply curious about technology, everyone is welcome to attend our open sessions.
            </p>



            <div className="join-cta-actions">
              <Button
                variant="signal"
                size="lg"
                onClick={() => onNavigate && onNavigate('contact')}
                icon={ArrowRight}
              >
                Apply for Membership
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate && onNavigate('events')}
              >
                Browse Upcoming Sessions
              </Button>
            </div>

            {/* Non-clickable social channel placeholders */}
            <div className="join-social-channels">
              <span className="channels-label">Community Links:</span>
              <div className="channels-list">
                <span className="channel-placeholder-badge">{CLUB_INFO.socials.discord}</span>
                <span className="channel-placeholder-badge">{CLUB_INFO.socials.github}</span>
                <span className="channel-placeholder-badge">{CLUB_INFO.socials.linkedin}</span>
                <span className="channel-placeholder-badge">{CLUB_INFO.socials.instagram}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
