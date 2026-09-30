import React from 'react';
import { CLUB_INFO } from '../../../data/clubInfo';
import { NAV_LINKS } from '../../../data/navigation';
import './Footer.css';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              <span className="footer-club-name">{CLUB_INFO.name}</span>
              <span className="footer-college-name">{CLUB_INFO.college}</span>
            </div>
            
            <p className="footer-description">
              {CLUB_INFO.description}
            </p>

            <div className="footer-tagline-block">
              <span className="footer-tagline-text">{CLUB_INFO.tagline}</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Directory</h4>
            <ul className="footer-links-list">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    className="footer-link"
                    onClick={() => {
                      if (onNavigate) onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Link Placeholders (Non-clickable per specification) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Social Channels</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-placeholder-link">
                  {CLUB_INFO.socials.github}
                </span>
              </li>
              <li>
                <span className="footer-placeholder-link">
                  {CLUB_INFO.socials.discord}
                </span>
              </li>
              <li>
                <span className="footer-placeholder-link">
                  {CLUB_INFO.socials.linkedin}
                </span>
              </li>
              <li>
                <span className="footer-placeholder-link">
                  {CLUB_INFO.socials.instagram}
                </span>
              </li>
            </ul>
          </div>

          {/* Membership Note */}
          <div className="footer-col">
            <h4 className="footer-col-title">Membership</h4>
            <p className="footer-membership-note">
              Open to all students interested in software engineering, technical projects, and peer collaboration.
            </p>
            <div className="footer-intake-badge">
              <span className="intake-dot" />
              <span>General Intake: [Open Each Semester]</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {CLUB_INFO.name}. Student-run organization at {CLUB_INFO.college}.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-mono-tag">[STUDENT TECHNICAL COLLECTIVE]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
