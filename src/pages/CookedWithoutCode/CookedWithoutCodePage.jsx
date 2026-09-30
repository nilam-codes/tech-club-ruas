import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { UPCOMING_FLAGSHIP_EVENT } from '../../data/eventsData';
import { submitEventRegistration } from '../../services/registrationService';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import './CookedWithoutCodePage.css';

export default function CookedWithoutCodePage({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'Ramaiah University of Applied Sciences',
    course: 'BCA',
    year: '',
    studentId: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (formData.course !== 'BCA') {
      setStatus('error');
      setErrorMessage('This event is strictly for BCA students.');
      return;
    }

    const payload = {
      eventId: UPCOMING_FLAGSHIP_EVENT.id,
      ...formData
    };

    const result = await submitEventRegistration(payload);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to submit registration. Please try again.');
    }
  };

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
              REGISTRATION OPEN
            </Badge>
          </div>

          <h1 className="challenge-title">{UPCOMING_FLAGSHIP_EVENT.title}</h1>
          <p className="challenge-institution">
            TECH CLUB • RAMAIAH UNIVERSITY OF APPLIED SCIENCES
          </p>

          <p className="challenge-lead">
            {UPCOMING_FLAGSHIP_EVENT.description}
          </p>
        </div>

        {/* Registration Section */}
        <div className="registration-container">
          {status === 'success' ? (
            <div className="registration-success">
              <CheckCircle size={48} className="success-icon" />
              <h2>Registration Confirmed</h2>
              <p>You have successfully registered for COOKED WITHOUT CODE.</p>
              <p className="success-note">Teams will be formed dynamically at the event. Be there on time!</p>
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate && onNavigate('events')}
                icon={ArrowRight}
                className="mt-6"
              >
                Explore All Club Events
              </Button>
            </div>
          ) : (
            <div className="registration-form-wrapper">
              <div className="registration-header">
                <h2>Secure Your Spot</h2>
                <p>Limited seats available. Registration is mandatory for participation.</p>
                <div className="eligibility-notice">
                  <strong>Eligibility:</strong> RUAS BCA Students Only. Teams formed at event.
                </div>
              </div>

              {status === 'error' && (
                <div className="form-error-alert">
                  {errorMessage}
                </div>
              )}

              <form className="registration-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Alex Turing"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">College Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="alex@example.com"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 9876543210"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 21BCA001"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="college">College</label>
                    <input
                      type="text"
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      required
                      readOnly
                      className="readonly-input"
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="course">Course</label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        disabled={status === 'submitting'}
                      >
                        <option value="BCA">BCA</option>
                        <option value="Other">Other (Not Eligible)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="year">Year</label>
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        disabled={status === 'submitting'}
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="signal"
                    size="lg"
                    className="w-full"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Processing Registration...' : 'Register for Event'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
