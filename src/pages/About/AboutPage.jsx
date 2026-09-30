import React from 'react';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { CLUB_INFO } from '../../data/clubInfo';
import { Target, Compass, ArrowRight } from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page section">
      <div className="container">
        <SectionHeader
          index="ABOUT"
          category="ORGANIZATION"
          title={`About ${CLUB_INFO.name}`}
          subtitle={`The student-run engineering and technology organization at ${CLUB_INFO.college}.`}
        />

        {/* Mission & Vision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-signal)' }}>
                <Target size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Our Purpose</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem' }}>
              To provide a collaborative, peer-supported space where students can explore software engineering, work on open-source tools, attend technical workshops, and prepare for competitions together.
            </p>
          </Card>

          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-signal)' }}>
                <Compass size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Community Values</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem' }}>
              We believe in open collaboration, active peer mentorship, and building software that addresses practical campus and community needs without gatekeeping.
            </p>
          </Card>
        </div>

        {/* What Students Gain */}
        <div className="flat-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div className="section-index">
              <span>MEMBER EXPERIENCE</span>
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>What Students Gain by Participating</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>1. Practical Collaboration</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Experience working on shared codebases, pull requests, and multi-contributor repositories.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>2. Workshop Series</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Hands-on sessions covering foundational technologies, frameworks, and engineering tooling.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>3. Hackathon Squads</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Form teams with fellow students to build prototypes and compete in hackathons and contests.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>4. Peer Mentorship</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Learn directly from senior students who have completed internships, research, and independent projects.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2.5rem' }}>
            <Button variant="signal" size="md" onClick={() => onNavigate && onNavigate('contact')} icon={ArrowRight}>
              Apply to Join Club
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
