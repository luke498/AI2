import React from 'react';

function HistorySection({ items }) {
  return (
    <section className="card">
      <h2>History</h2>
      {items.length === 0 ? (
        <p className="muted">No drafts saved yet.</p>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <article key={item.id} className="history-item">
              <p className="history-meta">
                <strong>{item.messageType}</strong> · {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="history-preview">{(item.editedText || '').slice(0, 180)}...</p>
              {typeof item.draftingSeconds === 'number' && (
                <p className="history-kpi">Drafting time: {item.draftingSeconds}s</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistorySection;
