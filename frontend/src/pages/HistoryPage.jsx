import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';

function HistoryPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getHistory()
      .then((rows) => setItems(rows))
      .catch((err) => setError(err.message || 'Failed to load history.'));
  }, []);

  return (
    <section className="card">
      <h2>History</h2>
      <div style={{ marginBottom: '8px' }}>
        <Link to="/">Back to Home</Link>
      </div>
      {error && <p className="status status-error">{error}</p>}
      {items.length === 0 ? (
        <p className="muted">No drafts saved yet.</p>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <article key={item.id} className="history-item">
              <p className="history-meta">
                <strong>Draft #{item.id}</strong> · {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="history-preview">{(item.editedDraft || item.generatedDraft || '').slice(0, 180)}...</p>
              <Link to={`/edit/${item.id}`}>Edit this draft</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistoryPage;
