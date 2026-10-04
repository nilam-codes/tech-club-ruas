content = '''import React from 'react';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { CLUB_INFO } from '../../data/clubInfo';
import { ArrowRight, Terminal, Code, Trophy, Users, Zap, Calendar, Wrench, Share2 } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page section">
      <div className="container">
        
        {/* 01 — WHO WE ARE */}
        <div className="about-section" style={{ marginBottom: '6rem' }}>
          <SectionHeader
            category="about"
            title="Who We Are"
          />
          <div className="about-text-content">
            <p className="editorial-lead">
              TECH CLUB is a student-driven technology community under the Department of Computer Applications at Ramaiah University of Applied Sciences.
            </p>
            <p className="editorial-lead" style={{ marginTop: '1rem' }}>
              We bring students together to explore technology beyond the classroom through workshops, technical events, projects, competitions, hackathons and collaborative learning.
            </p>
          </div>
        </div>

        {/* 02 — WHAT WE'RE ABOUT */}
        <div className="about-section" style={{ marginBottom: '6rem' }}>
          <div className="section-index">
            <span className="section-index-cat">$ ./what-were-about</span>
          </div>
          <h3 className="about-heading">WHAT WE'RE ABOUT</h3>
          
          <div className="about-pillars-grid">
            <Card padding="lg" className="corner-brackets flat-panel-interactive">
              <div className="pillar-header">
                <Terminal className="pillar-icon" />
                <h4>EXPLORE</h4>
              </div>
              <p className="text-secondary">Discover technologies, tools and ideas beyond the regular curriculum.</p>
            </Card>

            <Card padding="lg" className="corner-brackets flat-panel-interactive">
              <div className="pillar-header">
                <Wrench className="pillar-icon" />
                <h4>BUILD</h4>
              </div>
              <p className="text-secondary">Turn ideas into projects, experiments and practical solutions.</p>
            </Card>

            <Card padding="lg" className="corner-brackets flat-panel-interactive">
              <div className="pillar-header">
                <Trophy className="pillar-icon" />
                <h4>COMPETE</h4>
              </div>
              <p className="text-secondary">Take part in hackathons, competitions and technical challenges.</p>
            </Card>

            <Card padding="lg" className="corner-brackets flat-panel-interactive">
              <div className="pillar-header">
                <Share2 className="pillar-icon" />
                <h4>SHARE</h4>
              </div>
              <p className="text-secondary">Learn from peers, conduct sessions and grow together as a technical community.</p>
            </Card>
          </div>
        </div>

        {/* 03 — WHAT WE DO */}
        <div className="about-section" style={{ marginBottom: '6rem' }}>
          <div className="section-index">
            <span className="section-index-cat">$ ./what-we-do</span>
          </div>
          <h3 className="about-heading">WHAT WE DO</h3>
          
          <div className="about-activities-grid">
            {[
              { num: '01', title: 'WORKSHOPS', desc: 'Hands-on technical learning.' },
              { num: '02', title: 'TECHNICAL EVENTS', desc: 'Interactive events and challenges.' },
              { num: '03', title: 'PROJECTS', desc: 'Build and experiment with ideas.' },
              { num: '04', title: 'HACKATHONS', desc: 'Collaborate and solve problems under pressure.' },
              { num: '05', title: 'COMPETITIONS', desc: 'Test skills and compete with others.' },
              { num: '06', title: 'PEER LEARNING', desc: 'Share knowledge and learn from fellow students.' }
            ].map(act => (
              <div key={act.num} className="activity-row">
                <div className="activity-num text-mono">// {act.num}</div>
                <div className="activity-details">
                  <h4 className="activity-title">{act.title}</h4>
                  <p className="activity-desc text-secondary">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04 — OUR APPROACH */}
        <div className="about-section" style={{ marginBottom: '6rem' }}>
          <div className="section-index">
            <span className="section-index-cat">$ ./our-approach</span>
          </div>
          <h3 className="about-heading">OUR APPROACH</h3>
          
          <div className="approach-flow">
            <div className="approach-step">
              <div className="step-label text-mono">[01]</div>
              <div className="step-content">
                <h4>LEARN</h4>
                <p>Explore concepts, technologies and tools.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="approach-step">
              <div className="step-label text-mono">[02]</div>
              <div className="step-content">
                <h4>BUILD</h4>
                <p>Apply what you learn through projects and experiments.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="approach-step">
              <div className="step-label text-mono">[03]</div>
              <div className="step-content">
                <h4>SHARE</h4>
                <p>Exchange ideas and knowledge with other students.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="approach-step">
              <div className="step-label text-mono">[04]</div>
              <div className="step-content">
                <h4>COMPETE</h4>
                <p>Put your skills to the test through challenges, competitions and hackathons.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 05 — OUR COMMUNITY */}
        <div className="about-section" style={{ marginBottom: '6rem' }}>
          <h3 className="about-heading">OUR COMMUNITY</h3>
          <div className="about-text-content">
            <p className="editorial-lead">
              The Tech Club is a space for students who are curious about technology and want to learn by doing.
            </p>
            <p className="editorial-lead" style={{ marginTop: '1rem' }}>
              You don't need to know everything before getting involved. The idea is to explore, experiment, collaborate and improve together.
            </p>
          </div>
        </div>

        {/* 06 — EVENTS & EXPERIENCES */}
        <div className="about-section flat-panel corner-brackets" style={{ padding: '3rem', marginBottom: '6rem' }}>
          <h3 className="about-heading">EVENTS & EXPERIENCES</h3>
          <h4 style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
            FROM WORKSHOPS TO COMPETITIONS
          </h4>
          <p className="editorial-lead" style={{ marginBottom: '2rem', maxWidth: '800px' }}>
            The Tech Club brings students together through workshops, competitions, hackathons, creative technology events and collaborative activities.
          </p>
          <Button variant="signal" size="lg" onClick={() => onNavigate && onNavigate('events')} icon={ArrowRight}>
            View Events
          </Button>
        </div>

        {/* 07 — THE PEOPLE BEHIND THE CLUB */}
        <div className="about-section" style={{ textAlign: 'center' }}>
          <div className="section-index" style={{ justifyContent: 'center' }}>
            <span className="section-index-cat">$ ./leadership</span>
          </div>
          <h3 className="about-heading" style={{ margin: '1rem 0 2rem 0' }}>THE PEOPLE BEHIND THE CLUB</h3>
          <p className="editorial-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--accent-green)', marginBottom: '2rem' }}>
            BUILT BY STUDENTS, FOR STUDENTS.
          </p>
          <Button variant="outline" size="md" onClick={() => onNavigate && onNavigate('team')}>
            Meet the Team
          </Button>
        </div>

      </div>
    </div>
  );
}
'''

with open('src/pages/About/AboutPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
