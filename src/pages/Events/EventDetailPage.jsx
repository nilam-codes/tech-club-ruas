import React, { useState, useEffect } from 'react';
import { getEventById } from '../../services/eventsService';
import { registerForEvent } from '../../services/genericEventsService';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import Badge from '../../components/common/Badge/Badge';
import { ArrowLeft, MapPin, Calendar, Info, CheckCircle } from 'lucide-react';

export default function EventDetailPage({ eventId, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration Form State
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      const { data, error } = await getEventById(eventId);
      if (error) {
        setError(error);
      } else {
        setEvent(data);
        // Initialize form data
        if (data?.registration_fields) {
          const initialData = {};
          data.registration_fields.forEach(field => {
            initialData[field.key] = '';
          });
          setFormData(initialData);
        }
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  const handleInputChange = (e, key) => {
    setFormData(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    // Validate required fields
    if (event.registration_fields) {
      for (const field of event.registration_fields) {
        if (field.required && !formData[field.key]) {
          setSubmitError(`Field "${field.label}" is required.`);
          setSubmitting(false);
          return;
        }
      }
    }

    const studentId = "dummy_student_123"; // Dummy student ID as requested
    const { error } = await registerForEvent(eventId, studentId, formData, 'pending');

    if (error) {
      setSubmitError(error.message || 'Registration failed.');
    } else {
      setSubmitSuccess(true);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050807', color: '#00ffcc', fontFamily: 'JetBrains Mono' }}>
        [SYSTEM] Retrieving Event Data...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050807', color: '#ff3366', fontFamily: 'JetBrains Mono', padding: '2rem' }}>
        <p>[ERROR] Event not found or failed to load.</p>
        <button onClick={() => onNavigate('events')} style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', cursor: 'pointer' }}>
          RETURN TO EVENTS
        </button>
      </div>
    );
  }

  const isRegistrationOpen = event.registration_manual_status === 'OPEN' || event.lifecycle_status === 'REGISTRATION_OPEN';
  const displayDate = event.event_date ? new Date(event.event_date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) : '[TBA]';

  return (
    <div style={{ backgroundColor: '#050807', color: '#e2e8f0', minHeight: '100vh', paddingTop: '100px', paddingBottom: '4rem', fontFamily: '"Space Grotesk", sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        
        <button 
          onClick={() => onNavigate('events')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '2rem' }}
        >
          <ArrowLeft size={16} /> [BACK TO CATALOG]
        </button>

        <div style={{ marginBottom: '3rem', border: '1px solid rgba(0, 255, 204, 0.2)', padding: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: -1, width: 8, height: 8, borderTop: '2px solid #00ffcc', borderLeft: '2px solid #00ffcc' }}></div>
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderBottom: '2px solid #00ffcc', borderRight: '2px solid #00ffcc' }}></div>
          
          <Badge variant={isRegistrationOpen ? 'signal' : 'neutral'} style={{ marginBottom: '1rem' }}>
            {event.club || 'EVENT'} // {isRegistrationOpen ? 'REGISTRATION OPEN' : event.lifecycle_status || 'INFO'}
          </Badge>
          
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {event.title}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#00ffcc" /> {displayDate}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#00ffcc" /> {event.venue || 'Venue TBA'}
            </div>
          </div>

          <div style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '2rem' }}>
            {event.description}
          </div>

          {event.rules && (
            <div style={{ background: 'rgba(0, 255, 204, 0.05)', padding: '1.5rem', borderLeft: '2px solid #00ffcc', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '1rem', color: '#00ffcc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={16} /> [RULES & GUIDELINES]
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                {event.rules}
              </div>
            </div>
          )}

          {event.eligibility_rules && Object.keys(event.eligibility_rules).length > 0 && (
            <div style={{ background: 'rgba(57, 255, 20, 0.05)', padding: '1.5rem', borderLeft: '2px solid #39ff14', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '1rem', color: '#39ff14', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={16} /> [ELIGIBILITY REQUIREMENTS]
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                {Object.entries(event.eligibility_rules).map(([key, val]) => (
                  <div key={key}><strong>{key.toUpperCase()}</strong>: {Array.isArray(val) ? val.join(', ') : String(val)}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isRegistrationOpen && event.registration_fields && event.registration_fields.length > 0 && (
          <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <SectionHeader
              index="REG"
              category="REGISTRATION"
              title="Secure Your Spot"
              subtitle="Fill out the required information below."
            />

            {submitSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', textAlign: 'center', background: 'rgba(0, 255, 204, 0.1)', border: '1px solid #00ffcc' }}>
                <CheckCircle size={48} color="#00ffcc" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Registration Successful</h3>
                <p style={{ color: '#8892b0' }}>Your registration has been recorded successfully. Check your email for further instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                {submitError && (
                  <div style={{ padding: '1rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid #ff3366', color: '#ff3366', fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                    [ERROR]: {submitError}
                  </div>
                )}
                
                {event.registration_fields.map((field) => (
                  <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor={field.key} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.875rem', color: '#e2e8f0' }}>
                      {field.label} {field.required && <span style={{ color: '#00ffcc' }}>*</span>}
                    </label>
                    <input
                      id={field.key}
                      type={field.type || 'text'}
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(e, field.key)}
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        padding: '0.75rem 1rem', 
                        color: '#ffffff',
                        fontFamily: 'JetBrains Mono',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00ffcc'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>
                ))}
                
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    marginTop: '1rem',
                    background: '#00ffcc',
                    color: '#050807',
                    border: 'none',
                    padding: '1rem',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {submitting ? '[PROCESSING...]' : '[SUBMIT REGISTRATION]'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
