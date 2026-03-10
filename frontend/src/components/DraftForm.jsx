import React from 'react';

function DraftForm({ formData, onChange, onSubmit, loading }) {
  return (
    <section className="card">
      <h2>Generate Draft</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Message Type
          <select
            name="messageType"
            value={formData.messageType}
            onChange={onChange}
            required
          >
            <option value="complaint">Complaint</option>
            <option value="refund request">Refund Request</option>
            <option value="polite email">Polite Email</option>
          </select>
        </label>

        <label>
          Tone
          <select name="tone" value={formData.tone} onChange={onChange} required>
            <option value="polite">Polite</option>
            <option value="formal">Formal</option>
            <option value="concise">Concise</option>
          </select>
        </label>

        <label className="full-width">
          Issue Description
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={onChange}
            rows={5}
            placeholder="Explain your issue here..."
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </section>
  );
}

export default DraftForm;
