import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import CuriousGeometry from './CuriousGeometry';
import './Hero.css';

export default function Hero({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        <div className="hero-content">
          <div className="hero-metadata">
            [RUAS] / DEPARTMENT OF COMPUTER APPLICATIONS / 2026
          </div>
          
          <h1 className="hero-tagline">
            <span className="tagline-word">A PLACE FOR</span>
            <span className="tagline-word tagline-accent">CURIOUS MINDS.</span>
          </h1>

          <p className="hero-lead">
            TECH CLUB<br/>
            RAMAIAH UNIVERSITY OF APPLIED SCIENCES
          </p>

          <div className="hero-actions">
            <Button
              variant="signal"
              size="lg"
              onClick={() => onNavigate && onNavigate('events')}
              icon={ArrowRight}
            >
              EXPLORE THE CLUB
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-frame">
            <CuriousGeometry />
          </div>
        </div>
      </div>
    </section>
  );
}
