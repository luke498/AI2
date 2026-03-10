import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDraftById, updateDraftById } from '../services/api';

function EditDraftPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draftText, setDraftText] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');

  useEffect(() => {
    getDraftById(id)
      .then((data) => {
        setDraftText(data.generated_draft || '');
      })
      .catch((error) => {
        setStatusType('error');
        setStatus(error.message || 'Failed to load draft.');
      });
  }, [id]);

  async function handleUpdate() {
    try {
      await updateDraftById(id, draftText);
      setStatusType('success');
      setStatus('Draft updated successfully.');
      setTimeout(() => navigate('/history'), 800);
    } catch (error) {
      setStatusType('error');
      setStatus(error.message || 'Failed to update draft.');
    }
  }

  return (
    <section className="card">
      <h2>Edit Draft #{id}</h2>
      <textarea
        value={draftText}
        onChange={(event) => setDraftText(event.target.value)}
        rows={12}
      />
      <button onClick={handleUpdate} disabled={!draftText.trim()}>
        Update Draft
      </button>
      {status && <p className={`status ${statusType === 'error' ? 'status-error' : ''}`}>{status}</p>}
    </section>
  );
}

export default EditDraftPage;
