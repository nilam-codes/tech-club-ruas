import React, { useState, useEffect } from 'react';
import { getAdminTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadTeamMemberPhoto, deleteTeamMemberPhoto } from '../../services/teamService';
import Button from '../../components/common/Button/Button';
import { Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';

export default function AdminClubTeamPanel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [year, setYear] = useState('Third Year');
  const [role, setRole] = useState('Tech Club Coordinator');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getAdminTeamMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setRegistrationNumber('');
    setYear('Third Year');
    setRole('Tech Club Coordinator');
    setDisplayOrder(0);
    setIsActive(true);
    setPhotoUrl('');
    setSelectedFile(null);
    setError('');
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditId(member.id);
    setName(member.name);
    setRegistrationNumber(member.registration_number);
    setYear(member.year);
    setRole(member.role);
    setDisplayOrder(member.display_order);
    setIsActive(member.is_active);
    setPhotoUrl(member.photo_url || '');
    setSelectedFile(null);
    setError('');
  };

  const handleDelete = async (id, currentPhotoUrl) => {
    if (!window.confirm('Are you sure you want to permanently delete this team member?')) return;
    try {
      await deleteTeamMember(id);
      if (currentPhotoUrl) {
        await deleteTeamMemberPhoto(currentPhotoUrl);
      }
      fetchMembers();
    } catch (err) {
      alert('Failed to delete member: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name || !registrationNumber || !year || !role) {
      setError('Name, registration number, year, and role are required.');
      setIsSubmitting(false);
      return;
    }
    
    if (!isEditing && !selectedFile && !photoUrl) {
      setError('Photo is required for new members.');
      setIsSubmitting(false);
      return;
    }

    try {
      let finalPhotoUrl = photoUrl;
      let oldPhotoUrl = null;
      
      if (isEditing) {
        const currentMember = members.find(m => m.id === editId);
        oldPhotoUrl = currentMember?.photo_url;
      }

      if (selectedFile) {
        const uploadResult = await uploadTeamMemberPhoto(selectedFile);
        finalPhotoUrl = uploadResult.url;
      }

      const memberData = {
        name,
        registration_number: registrationNumber,
        year,
        role,
        display_order: parseInt(displayOrder, 10) || 0,
        is_active: isActive,
        photo_url: finalPhotoUrl
      };

      if (isEditing) {
        await updateTeamMember(editId, memberData);
        if (selectedFile && oldPhotoUrl) {
          await deleteTeamMemberPhoto(oldPhotoUrl);
        }
      } else {
        await addTeamMember(memberData);
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      setError('Failed to save member: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="admin-panel"><p>Loading team members...</p></div>;

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Club Team Management</h2>
        {!isEditing && (
          <Button variant="signal" size="sm" onClick={() => setIsEditing('new')} icon={Plus}>
            Add Team Member
          </Button>
        )}
      </div>

      {(isEditing === 'new' || isEditing === true) && (
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '24px', borderRadius: '4px', border: '1px solid var(--border-strong)', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent-cyan)' }}>
            {isEditing === 'new' ? 'Add New Team Member' : 'Edit Team Member'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="admin-label">Name *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Registration Number *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={registrationNumber} 
                  onChange={e => setRegistrationNumber(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="admin-label">Role *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Year *</label>
                <select 
                  className="admin-input" 
                  value={year} 
                  onChange={e => setYear(e.target.value)}
                  required
                >
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="admin-label">Display Order</label>
                <input 
                  type="number" 
                  className="admin-input" 
                  value={displayOrder} 
                  onChange={e => setDisplayOrder(e.target.value)} 
                />
              </div>
              <div>
                <label className="admin-label">Status</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={e => setIsActive(e.target.checked)} 
                    id="isActiveCheck"
                  />
                  <label htmlFor="isActiveCheck" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Active (Visible publicly)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="admin-label">Photo {(!isEditing || isEditing === 'new') && '*'}</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {photoUrl && !selectedFile && (
                  <img src={photoUrl} alt="Current" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-strong)' }} />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setSelectedFile(e.target.files[0])} 
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
              {selectedFile && <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '4px' }}>Selected: {selectedFile.name}</div>}
            </div>

            {error && <div style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Button type="submit" variant="signal" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Member'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {members.length === 0 && !isEditing ? (
        <div style={{ padding: '32px', textAlign: 'center', border: '1px dashed var(--border-strong)', color: 'var(--text-muted)' }}>
          No team members found. Add one to get started.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Year</th>
                <th>Reg. Number</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="" style={{ width: 40, height: 40, borderRadius: '4px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={16} color="var(--text-muted)" />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.year}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {member.registration_number}
                  </td>
                  <td style={{ textAlign: 'center' }}>{member.display_order}</td>
                  <td>
                    {member.is_active ? (
                      <span style={{ color: 'var(--accent-green)', fontSize: '12px' }}>ACTIVE</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>HIDDEN</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(member)} className="admin-icon-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(member.id, member.photo_url)} className="admin-icon-btn danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
