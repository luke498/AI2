import React, { useEffect, useState } from 'react';
import { getProfileStats } from '../services/api';

function ProfilePage() {
  const [stats, setStats] = useState({ draftsGenerated: 0, draftsSaved: 0, feedbackCount: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    getProfileStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message || 'Failed to load profile stats.'));
  }, []);

  return (
    <section className="card">
      <h2>Profile</h2>
      {error && <p className="status status-error">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Drafts Generated</h3>
          <p>{stats.draftsGenerated}</p>
        </div>
        <div className="stat-card">
          <h3>Total Drafts Saved</h3>
          <p>{stats.draftsSaved}</p>
        </div>
        <div className="stat-card">
          <h3>Total Feedback Submitted</h3>
          <p>{stats.feedbackCount}</p>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
