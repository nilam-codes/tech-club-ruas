import React, { useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import { CLUB_INFO } from '../../data/clubInfo';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '[Computer Science / Engineering]',
    domainInterest: 'Software Engineering & Open Source',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-page section">
      <div className="container">
        <SectionHeader
          index="CONTACT"
          category="MEMBERSHIP & INQUIRIES"
          title={`Contact & Join ${CLUB_INFO.name}`}
          subtitle={`Reach out to the student coordinators or submit an application to join the collective at ${CLUB_INFO.college}.`}
        />

        <div className="contact-grid">
          {/* Left Info Column */}
          <div className="contact-info-col">
            <Card padding="lg" className="contact-info-card">
              <h3 className="contact-card-title">Club Logistics</h3>
              <p className="contact-card-desc">
                Students of all experience levels are welcome to attend open sessions and workshops.
              </p>

              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <div className="detail-icon-box">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="detail-label">Email Inquiries</span>
                    <span className="detail-value text-mono">
                      {CLUB_INFO.socials.email}
                    </span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-box">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="detail-label">Institution</span>
                    <span className="detail-value">
                      {CLUB_INFO.college}
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact-divider" />

              <h4 className="contact-channels-title">Official Communities (Placeholders)</h4>
              <div className="contact-social-grid">
                <div className="contact-social-tile">
                  <span className="text-mono">{CLUB_INFO.socials.discord}</span>
                </div>
                <div className="contact-social-tile">
                  <span className="text-mono">{CLUB_INFO.socials.github}</span>
                </div>
                <div className="contact-social-tile">
                  <span className="text-mono">{CLUB_INFO.socials.linkedin}</span>
                </div>
                <div className="contact-social-tile">
                  <span className="text-mono">{CLUB_INFO.socials.instagram}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Form Column */}
          <div className="contact-form-col">
            <Card padding="lg" className="contact-form-card">
              {submitted ? (
                <div className="form-success-box">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={40} className="text-signal" />
                  </div>
                  <h3 className="success-title">Application Logged</h3>
                  <p className="success-desc">
                    Thank you, <strong>{formData.name}</strong>. Your registration for <strong>{formData.domainInterest}</strong> has been logged. Details regarding upcoming sessions will be announced soon.
                  </p>
                  <button 
                    type="button" 
                    className="reset-form-btn" 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        studentId: '',
                        department: '[Computer Science / Engineering]',
                        domainInterest: 'Software Engineering & Open Source',
                        message: ''
                      });
                    }}
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-header">
                    <Badge variant="signal" size="sm">Intake Form</Badge>
                    <h3 className="form-title">Membership Application</h3>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="e.g. Alex Morgan"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Student Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="e.g. amorgan@college.edu"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="studentId">Student ID / Roll No</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        placeholder="[Student ID / Roll No Placeholder]"
                        className="form-input"
                        value={formData.studentId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="domainInterest">Primary Interest</label>
                      <select
                        id="domainInterest"
                        name="domainInterest"
                        className="form-input form-select"
                        value={formData.domainInterest}
                        onChange={handleChange}
                      >
                        <option value="Software Engineering & Open Source">Software Engineering & Open Source</option>
                        <option value="Machine Learning & Applied AI">Machine Learning & Applied AI</option>
                        <option value="Systems & Distributed Computing">Systems & Distributed Computing</option>
                        <option value="Cybersecurity & CTF">Cybersecurity & CTF</option>
                        <option value="Workshops & Event Organization">Workshops & Event Organization</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Brief Background & Interests</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Share your interests, programming languages or tools you've explored, or what you hope to learn..."
                      className="form-input form-textarea"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="signal"
                    size="lg"
                    className="w-full"
                    icon={Send}
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
