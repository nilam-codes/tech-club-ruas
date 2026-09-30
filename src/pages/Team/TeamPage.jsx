import React from 'react';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import ImagePlaceholder from '../../components/common/ImagePlaceholder/ImagePlaceholder';
import { TEAM_MEMBERS } from '../../data/teamData';
import { CLUB_INFO } from '../../data/clubInfo';
import { ArrowRight } from 'lucide-react';

export default function TeamPage({ onNavigate }) {
  return (
    <div className="team-page section">
      <div className="container">
        <SectionHeader
          index="TEAM"
          category="LEADERSHIP"
          title={`Student Leadership at ${CLUB_INFO.name}`}
          subtitle="The student coordinators and technical leads managing workshops, projects, and club operations."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.id} padding="none" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Member Portrait Frame Placeholder */}
              <div style={{ width: '100%' }}>
                <ImagePlaceholder
                  aspectRatio="1/1"
                  label="Student Portrait"
                  sublabel="Reserved for actual student photograph"
                />
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {member.name}
                </h3>

                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-signal)', marginBottom: '0.25rem' }}>
                  {member.role}
                </span>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  {member.year}
                </span>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem', flexGrow: 1 }}>
                  {member.bio}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{member.github}</span>
                  <span style={{ color: 'var(--border-strong)' }}>•</span>
                  <span style={{ color: 'var(--text-muted)' }}>{member.linkedin}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Join Leadership Teaser */}
        <div className="flat-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="section-index">
            <span>STUDENT INVOLVEMENT</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.75rem 0' }}>Interested in Helping Organize?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            We invite interested students to shadow existing leads, propose workshops, and assist with event organization each semester.
          </p>
          <Button variant="signal" size="md" onClick={() => onNavigate && onNavigate('contact')} icon={ArrowRight}>
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
}
