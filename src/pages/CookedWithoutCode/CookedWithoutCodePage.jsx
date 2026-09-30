import React from 'react';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { UPCOMING_FLAGSHIP_EVENT } from '../../data/eventsData';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import './CookedWithoutCodePage.css';

export default function CookedWithoutCodePage({ onNavigate }) {
  return (
    <div className="ai-challenge-page section">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="challenge-breadcrumb-row">
          <button 
            type="button" 
            className="challenge-back-btn"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          <span className="challenge-breadcrumb-sep">/</span>
          <span className="challenge-breadcrumb-current">events / cooked-without-code</span>
        </div>

        {/* Main Editorial Presentation */}
        <div className="challenge-header-block">
          <div className="challenge-meta-row">
            <span className="challenge-date">{UPCOMING_FLAGSHIP_EVENT.displayDate}</span>
            <Badge variant="signal" size="sm">
              ON-SPOT REGISTRATION ONLY
            </Badge>
          </div>

          <h1 className="challenge-title">{UPCOMING_FLAGSHIP_EVENT.title}</h1>
          <p className="challenge-institution">
            TECH CLUB • RAMAIAH UNIVERSITY OF APPLIED SCIENCES
          </p>

          <p className="challenge-lead">
            {UPCOMING_FLAGSHIP_EVENT.description}
          </p>
          
          <div style={{ marginTop: '32px' }}>
            <Button
              variant="signal"
              size="lg"
              onClick={() => onNavigate && onNavigate('cooked-without-code-game')}
              icon={ArrowRight}
            >
              ENTER GAME
            </Button>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="challenge-details-grid">
          <div className="detail-card">
            <Calendar className="detail-icon" size={24} />
            <h3>Date & Time</h3>
            <p><strong>Date:</strong> 30 September 2026, Wednesday</p>
            <p><strong>Time:</strong> 2:30 PM onwards</p>
          </div>
          
          <div className="detail-card">
            <MapPin className="detail-icon" size={24} />
            <h3>Venue</h3>
            <p><strong>Location:</strong> Seminar Hall</p>
            <p>Registration happens AT THE VENUE. There is NO online public registration.</p>
          </div>
          
          <div className="detail-card">
            <Users className="detail-icon" size={24} />
            <h3>Eligibility & Teams</h3>
            <p><strong>Who:</strong> RUAS BCA students only. All BCA years.</p>
            <p><strong>Teams:</strong> Formed dynamically at the event after registration.</p>
          </div>
          
          <div className="detail-card">
            <AlertCircle className="detail-icon" size={24} />
            <h3>Rules & Tools</h3>
            <p>No coding is required. AI tools such as ChatGPT, Gemini, Claude, etc. are allowed.</p>
          </div>
        </div>

        {/* Game Flow Section */}
        <div className="game-flow-section">
          <h2 className="game-flow-title">GAME FLOW</h2>
          <div className="game-flow-steps">
            <div className="flow-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4>Round 1 — COOK</h4>
                <p>The initial challenge. Use your AI tools to cook up creative solutions.</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4>Round 2 — GET COOKED</h4>
                <p>The twist. Defend your work and adapt to unexpected restrictions.</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4>Round 3 — SURVIVE</h4>
                <p>The final impossible challenge to determine the ultimate winners.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
