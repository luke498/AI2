import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DraftForm from '../components/DraftForm';
import ResultEditor from '../components/ResultEditor';
import FeedbackSection from '../components/FeedbackSection';
import {
  buildProblemDescription,
  sendFeedback,
  submitDraft,
  saveDraft,
} from '../services/api';

function HomePage() {
  const [formData, setFormData] = useState({
    messageType: 'complaint',
    issueDescription: '',
    tone: 'polite',
  });
  const [loading, setLoading] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setStatusType('info');
    setStatusMessage('Generating draft...');

    try {
      const problemDescription = buildProblemDescription(formData);
      const result = await submitDraft(problemDescription);

      if (result.warning) {
        setDraftText('');
        setCurrentRequestId(null);
        setStatusType('error');
        setStatusMessage(result.warning);
        return;
      }

      if (!result.generatedDraft) {
        setStatusType('error');
        setStatusMessage('No draft text returned from server.');
        return;
      }

      setDraftText(result.generatedDraft);
      setCurrentRequestId(result.id);
      setStatusType('success');
      setStatusMessage('Draft generated. You can edit it and save it.');
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!currentRequestId) {
      setStatusType('error');
      setStatusMessage('Generate a draft first, then save your edits.');
      return;
    }

    try {
      const result = await saveDraft({ requestId: currentRequestId, editedDraft: draftText });
      const seconds = result.draftingSeconds;
      setStatusType('success');
      if (typeof seconds === 'number') {
        setStatusMessage(`Draft saved. Time spent: ${seconds} seconds.`);
      } else {
        setStatusMessage('Draft saved successfully.');
      }
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error.message || 'Save failed.');
    }
  }

  async function handleFeedback(useful) {
    if (!currentRequestId) {
      setStatusType('error');
      setStatusMessage('Generate a draft first, then send feedback.');
      return;
    }

    try {
      await sendFeedback({ requestId: currentRequestId, useful });
      setStatusType('success');
      setStatusMessage('Feedback submitted successfully.');
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error.message || 'Feedback failed.');
    }
  }

  return (
    <>
      <header>
        <h1>DraftMate AI</h1>
        <p className="warning">
          This AI-generated draft may contain mistakes. Please review before using.
        </p>
        <div className="page-links">
          <Link to="/profile">Go to Profile</Link>
          <Link to="/history">Go to History</Link>
        </div>
      </header>

      <DraftForm
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleGenerate}
        loading={loading}
      />

      <ResultEditor
        draft={draftText}
        onDraftChange={setDraftText}
        onSave={handleSave}
        savingDisabled={loading}
      />

      <FeedbackSection
        onFeedback={(value) => handleFeedback(value === 5)}
        disabled={loading || !currentRequestId}
      />

      {statusMessage && <p className={`status ${statusType === 'error' ? 'status-error' : ''}`}>{statusMessage}</p>}
    </>
  );
}

export default HomePage;
