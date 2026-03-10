import React from 'react';

function ResultEditor({ draft, onDraftChange, onSave, savingDisabled }) {
  return (
    <section className="card">
      <h2>Generated Draft</h2>
      <textarea
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        rows={10}
        placeholder="Generated draft will appear here..."
      />
      <button onClick={onSave} disabled={savingDisabled || !draft.trim()}>
        Save
      </button>
    </section>
  );
}

export default ResultEditor;
