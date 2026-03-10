import React from 'react';

function FeedbackSection({ onFeedback, disabled }) {
  return (
    <section className="card">
      <h2>Feedback</h2>
      <p className="muted">Was this draft useful?</p>
      <div className="feedback-buttons">
        <button disabled={disabled} onClick={() => onFeedback(5)}>
          Useful
        </button>
        <button disabled={disabled} className="secondary" onClick={() => onFeedback(1)}>
          Not Useful
        </button>
      </div>
    </section>
  );
}

export default FeedbackSection;
