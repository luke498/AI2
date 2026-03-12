import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfileStats } from '../services/api';

const defaultProfile = {
  name: 'Student User',
  email: 'student@example.com',
};

function ProfilePage() {
  const [stats, setStats] = useState({ draftsGenerated: 0, savedDrafts: 0, feedbackCount: 0 });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [draftProfile, setDraftProfile] = useState(defaultProfile);

  useEffect(() => {
    getProfileStats()
      .then((data) => {
        setStats({
          draftsGenerated: data.draftsGenerated || 0,
          savedDrafts: data.savedDrafts || data.draftsSaved || 0,
          feedbackCount: data.feedbackCount || 0,
        });
      })
      .catch((err) => setError(err.message || 'Failed to load profile stats.'));
  }, []);

  function startEdit() {
    setDraftProfile(profile);
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraftProfile(profile);
    setIsEditing(false);
  }

  function saveEdit() {
    setProfile(draftProfile);
    setIsEditing(false);
  }

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraftProfile((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <section className="card">
      <h2>Profile</h2>
      <p className="muted">Welcome to your DraftMate AI profile. Track your writing activity here.</p>
      <div className="card profile-card">
        {isEditing ? (
          <>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={draftProfile.name}
                onChange={handleDraftChange}
                className="profile-input"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={draftProfile.email}
                onChange={handleDraftChange}
                className="profile-input"
              />
            </label>
            <div className="inline-actions">
              <button onClick={saveEdit}>Save</button>
              <button className="secondary" onClick={cancelEdit}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>User:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button onClick={startEdit}>Edit</button>
          </>
        )}
      </div>

      {error && <p className="status status-error">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Drafts Generated</h3>
          <p>{stats.draftsGenerated}</p>
        </div>
        <div className="stat-card">
          <h3>Total Saved Drafts</h3>
          <p>{stats.savedDrafts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Feedback Submitted</h3>
          <p>{stats.feedbackCount}</p>
        </div>
      </div>

      <div className="page-links">
        <Link to="/">Back to Home</Link>
      </div>
    </section>
  );
}

export default ProfilePage;
