import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfileStats } from '../services/api';

function ProfilePage() {
  const [stats, setStats] = useState({ draftsGenerated: 0, savedDrafts: 0, feedbackCount: 0 });
  const [error, setError] = useState('');

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

  return (
    <section className="card">
      <h2>Profile</h2>
      <p className="muted">Welcome to your DraftMate AI profile. Track your writing activity here.</p>
      <div className="card" style={{ marginBottom: '12px' }}>
        <p><strong>User:</strong> Student User</p>
        <p><strong>Email:</strong> student@example.com</p>
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

      <div style={{ marginTop: '12px' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </section>
  );
}

export default ProfilePage;
