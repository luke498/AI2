import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDraftById, updateDraftById } from '../services/api';

function EditDraftPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draftText, setDraftText] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getDraftById(id)
      .then((data) => {
        if (!data || data.generated_draft == null) {
          setNotFound(true);
          setStatusType('error');
          setStatus('No draft found');
          return;
        }
        setNotFound(false);
        setDraftText(data.generated_draft || '');
      })
      .catch((error) => {
        setStatusType('error');
        if (String(error.message || '').toLowerCase().includes('not found')) {
          setNotFound(true);
          setStatus('No draft found');
        } else {
          setStatus(error.message || 'Failed to load draft.');
        }
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
      <div className="page-links">
        <Link to="/history">Back to History</Link>
        <Link to="/">Back to Home</Link>
      </div>

      {notFound ? (
        <p className="status status-error">No draft found</p>
      ) : (
        <>
          <textarea
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            rows={12}
          />
          <button onClick={handleUpdate} disabled={!draftText.trim()}>
            Update Draft
          </button>
        </>
      )}

      {status && !notFound && (
        <p className={`status ${statusType === 'error' ? 'status-error' : ''}`}>{status}</p>
      )}
    </section>
  );
}

export default EditDraftPage;
