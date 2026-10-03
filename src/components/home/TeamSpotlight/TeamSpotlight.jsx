import React from 'react';
import { TEAM_MEMBERS } from '../../../data/teamData';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import ImagePlaceholder from '../../common/ImagePlaceholder/ImagePlaceholder';
import './TeamSpotlight.css';

export default function TeamSpotlight() {
  return (
    <section className="team-spotlight-section section" id="team">
      <div className="container">
        <div className="team-spotlight-header-row">
          <SectionHeader
            index="06"
            category="LEADERSHIP & CORE TEAM"
            title="Student Organizers & Leads"
            subtitle="The student coordinators responsible for planning workshops, organizing hackathons, and maintaining club infrastructure."
          />
        </div>

        <div className="team-spotlight-grid">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="team-member-card flat-panel">
              {/* Photo Frame Placeholder */}
              <div className="member-photo-wrap">
                <ImagePlaceholder
                  aspectRatio="1/1"
                  label="Member Portrait"
                  sublabel="Reserved for actual student photograph"
                  className="member-portrait-frame"
                />
              </div>

              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <span className="member-year">{member.year}</span>
                <p className="member-bio">{member.bio}</p>

                <div className="member-links-row">
                  <span className="member-placeholder-link">
                    {member.github}
                  </span>
                  <span className="member-placeholder-divider">•</span>
                  <span className="member-placeholder-link">
                    {member.linkedin}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
