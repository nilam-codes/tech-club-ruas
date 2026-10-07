import React, { useState, useEffect } from 'react';
import { getEvents, createEvent } from '../../services/eventsService';
import Button from '../../components/common/Button/Button';
import AdminGenericEventDashboard from './AdminGenericEventDashboard';

export default function AdminEventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    rules: '',
    registration_start_date: '',
    registration_end_date: '',
    approval_mode: 'AUTO',
    eligibility_rules: '{}',
    registration_type: 'INDIVIDUAL',
    team_formation: 'MANUAL',
    min_team_size: 1,
    max_team_size: 1,
    features_config: '{}'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await getEvents({ isAdmin: true });
    setEvents(data || []);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newEventData,
        eligibility_rules: JSON.parse(newEventData.eligibility_rules || '{}'),
        features_config: JSON.parse(newEventData.features_config || '{}'),
        lifecycle_status: 'DRAFT',
      };
      await createEvent(payload);
      setIsCreating(false);
      setCreateStep(1);
      fetchEvents();
    } catch (error) {
      alert("Error creating event. Check JSON format.");
    }
  };

  if (selectedEvent) {
    return (
      <div className="admin-panel">
        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
          &larr; Back to Events List
        </Button>
        <AdminGenericEventDashboard event={selectedEvent} />
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="admin-panel">
        <h2>Create New Event</h2>
        <div style={{ marginBottom: '1rem' }}>
          Step {createStep} of 6
        </div>

        {createStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 1: Basic Event Details</h3>
            <input name="title" placeholder="Title" value={newEventData.title} onChange={handleChange} className="form-input" />
            <textarea name="description" placeholder="Description" value={newEventData.description} onChange={handleChange} className="form-input" />
            <input type="date" name="event_date" value={newEventData.event_date} onChange={handleChange} className="form-input" />
            <input type="time" name="event_time" value={newEventData.event_time} onChange={handleChange} className="form-input" />
            <input name="venue" placeholder="Venue" value={newEventData.venue} onChange={handleChange} className="form-input" />
            <textarea name="rules" placeholder="Rules" value={newEventData.rules} onChange={handleChange} className="form-input" />
          </div>
        )}

        {createStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 2: Registration Config</h3>
            <label>Registration Start</label>
            <input type="datetime-local" name="registration_start_date" value={newEventData.registration_start_date} onChange={handleChange} className="form-input" />
            <label>Registration End</label>
            <input type="datetime-local" name="registration_end_date" value={newEventData.registration_end_date} onChange={handleChange} className="form-input" />
            <select name="approval_mode" value={newEventData.approval_mode} onChange={handleChange} className="form-input">
              <option value="AUTO">AUTO</option>
              <option value="MANUAL">MANUAL</option>
            </select>
          </div>
        )}

        {createStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 3: Eligibility Rules (JSON)</h3>
            <textarea name="eligibility_rules" value={newEventData.eligibility_rules} onChange={handleChange} className="form-input" style={{ minHeight: '100px' }} />
          </div>
        )}

        {createStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 4: Team Config</h3>
            <select name="registration_type" value={newEventData.registration_type} onChange={handleChange} className="form-input">
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="TEAM">TEAM</option>
            </select>
            <select name="team_formation" value={newEventData.team_formation} onChange={handleChange} className="form-input">
              <option value="MANUAL">MANUAL</option>
              <option value="AUTO">AUTO</option>
            </select>
            <label>Min Team Size</label>
            <input type="number" name="min_team_size" value={newEventData.min_team_size} onChange={handleChange} className="form-input" />
            <label>Max Team Size</label>
            <input type="number" name="max_team_size" value={newEventData.max_team_size} onChange={handleChange} className="form-input" />
          </div>
        )}

        {createStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 5: Optional Features Config (JSON)</h3>
            <textarea name="features_config" value={newEventData.features_config} onChange={handleChange} className="form-input" style={{ minHeight: '100px' }} />
          </div>
        )}

        {createStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 6: Review + Create</h3>
            <pre style={{ background: '#111', padding: '1rem', color: '#0f0', borderRadius: '4px' }}>
              {JSON.stringify(newEventData, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {createStep > 1 && (
            <Button variant="outline" onClick={() => setCreateStep(createStep - 1)}>Back</Button>
          )}
          {createStep < 6 && (
            <Button onClick={() => setCreateStep(createStep + 1)}>Next</Button>
          )}
          {createStep === 6 && (
            <Button variant="primary" onClick={handleCreate}>Create Event</Button>
          )}
          <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Events Manager</h2>
        <Button onClick={() => setIsCreating(true)}>+ Create Event</Button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map(event => (
              <div 
                key={event.id} 
                className="admin-placeholder-card" 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setSelectedEvent(event)}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{event.title}</h3>
                  <p style={{ margin: 0, opacity: 0.7 }}>{event.event_date} | {event.registration_type}</p>
                </div>
                <div style={{ background: '#0f0', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                  {event.lifecycle_status || 'UNKNOWN'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
