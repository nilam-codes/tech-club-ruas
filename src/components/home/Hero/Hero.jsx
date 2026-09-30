import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CLUB_INFO } from '../../../data/clubInfo';
import Button from '../../common/Button/Button';
import ImagePlaceholder from '../../common/ImagePlaceholder/ImagePlaceholder';
import './Hero.css';

export default function Hero({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Club Identity, Tagline & Description */}
        <div className="hero-content">
          {/* Club Name & University Label */}
          <div className="hero-identity">
            <span className="hero-club-badge">{CLUB_INFO.name}</span>
            <span className="hero-divider" aria-hidden="true">•</span>
            <span className="hero-college-name">{CLUB_INFO.college}</span>
          </div>

          {/* Prominent Official Tagline */}
          <h1 className="hero-tagline">
            <span className="tagline-word">THINK.</span>
            <span className="tagline-word">BUILD.</span>
            <span className="tagline-word tagline-accent">BELONG.</span>
          </h1>

          {/* Club Description */}
          <p className="hero-lead">
            {CLUB_INFO.description}
          </p>

          {/* Clear CTAs */}
          <div className="hero-actions">
            <Button
              variant="signal"
              size="lg"
              onClick={() => onNavigate && onNavigate('events')}
              icon={ArrowRight}
            >
              Explore Events
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate && onNavigate('contact')}
            >
              Join the Club
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Area Reserved for Real Club Photo */}
        <div className="hero-visual">
          <ImagePlaceholder
            aspectRatio="4/3"
            label="Club Activity / Workshop Photo"
            sublabel="Visual area reserved for an actual club photograph or event image"
            className="hero-image-frame"
          />
        </div>
      </div>
    </section>
  );
}
