import React, { useState, useEffect } from 'react';
import { getRegistrationsForEvent, submitEventRegistration } from '../../services/registrationService';
import Button from '../../components/common/Button/Button';

const EVENT_UUID = "6c6718bf-12b8-4b2a-a172-52d62fe4250f";

export default function AdminRegistrationsPanel() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [formMessage, setFormMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    college: 'Ramaiah University of Applied Sciences',
    course: 'BCA',
    year: ''
  });

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    const result = await getRegistrationsForEvent(EVENT_UUID);
    if (result.success) {
      setRegistrations(result.data || []);
    } else {
      setError(result.error || 'Failed to load registrations.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormMessage('');

    const payload = {
      eventId: EVENT_UUID,
      ...formData
    };

    const result = await submitEventRegistration(payload);

    if (result.success) {
      setFormStatus('success');
      setFormMessage('Participant successfully registered.');
      fetchRegistrations();
      setTimeout(() => {
        setShowForm(false);
        setFormStatus('idle');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          studentId: '',
          college: 'Ramaiah University of Applied Sciences',
          course: 'BCA',
          year: ''
        });
      }, 2000);
    } else {
      setFormStatus('error');
      // Already returning human readable messages from service
      setFormMessage(result.error || 'Failed to add participant.');
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const query = searchQuery.toLowerCase();
    return (
      (r.full_name && r.full_name.toLowerCase().includes(query)) ||
      (r.email && r.email.toLowerCase().includes(query)) ||
      (r.student_id && r.student_id.toLowerCase().includes(query))
    );
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2>Registrations</h2>
          <p className="admin-panel-text">
            COOKED WITHOUT CODE • Total: {registrations.length}
          </p>
        </div>
        {!showForm && (
          <Button variant="signal" size="sm" onClick={() => setShowForm(true)}>
            + Add Participant
          </Button>
        )}
      </div>

      {showForm && (
        <div className="admin-add-form-container">
          <div className="admin-add-form-header">
            <h3>Register New Participant</h3>
            <button type="button" className="close-btn" onClick={() => setShowForm(false)}>✕</button>
          </div>

          {formStatus === 'success' && (
            <div className="admin-success-msg">{formMessage}</div>
          )}
          {formStatus === 'error' && (
            <div className="admin-error-msg">{formMessage}</div>
          )}

          <form className="admin-add-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
              </div>
              <div className="form-group">
                <label>College</label>
                <input type="text" name="college" value={formData.college} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Course</label>
                  <input type="text" name="course" value={formData.course} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="text" name="year" value={formData.year} onChange={handleInputChange} required disabled={formStatus === 'submitting'} />
                </div>
              </div>
            </div>
            <div className="form-actions mt-4">
              <Button type="submit" variant="signal" size="md" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Submitting...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="admin-registrations-content">
          <div className="admin-search-bar">
            <input 
              type="text" 
              placeholder="Search participants by name, email, or student ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="admin-state-message">Loading registrations...</div>
          ) : error ? (
            <div className="admin-error-msg">{error}</div>
          ) : registrations.length === 0 ? (
            <div className="admin-state-message">No participants registered yet.</div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College/Course</th>
                    <th>Registration Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map(r => (
                    <tr key={r.id}>
                      <td>{r.full_name}</td>
                      <td><span className="mono-badge">{r.student_id}</span></td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>{r.college} • {r.course} ({r.year})</td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">No participants match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
