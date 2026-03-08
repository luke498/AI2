import React, { useEffect, useState } from 'react';
import DraftForm from './components/DraftForm';
import ResultEditor from './components/ResultEditor';
import HistorySection from './components/HistorySection';
import FeedbackSection from './components/FeedbackSection';
import {
  buildProblemDescription,
  getHistory,
  sendFeedback,
  submitDraft,
  saveDraft,
} from './services/api';

function App() {
  const [formData, setFormData] = useState({
    messageType: 'complaint',
    issueDescription: '',
    tone: 'polite',
  });
  const [loading, setLoading] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const serverHistory = await getHistory();
      const mapped = serverHistory.map((item) => ({
        id: item.id,
        messageType: 'generated draft',
        editedText: item.editedDraft || item.generatedDraft,
        draftingSeconds: item.draftingSeconds,
        createdAt: item.createdAt,
      }));
      setHistoryItems(mapped);
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const problemDescription = buildProblemDescription(formData);
      const result = await submitDraft(problemDescription);

      if (result.warning) {
        setDraftText('');
        setCurrentRequestId(null);
        setStatusMessage(result.warning);
        return;
      }

      setDraftText(result.generatedDraft);
      setCurrentRequestId(result.id);
      setStatusMessage('Draft generated. You can edit it and save it.');
      await loadHistory();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!currentRequestId) {
      setStatusMessage('Generate a draft first, then save your edits.');
      return;
    }

    try {
      const result = await saveDraft({ requestId: currentRequestId, editedDraft: draftText });
      const seconds = result.draftingSeconds;
      if (typeof seconds === 'number') {
        setStatusMessage(`Draft saved. Time spent: ${seconds} seconds.`);
      } else {
        setStatusMessage('Draft saved successfully.');
      }
      await loadHistory();
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  async function handleFeedback(useful) {
    if (!currentRequestId) {
      setStatusMessage('Generate a draft first, then send feedback.');
      return;
    }

    try {
      await sendFeedback({ requestId: currentRequestId, useful });
      setStatusMessage('Feedback submitted successfully.');
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>DraftMate AI</h1>
        <p className="warning">
          This AI-generated draft may contain mistakes. Please review before using.
        </p>
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

      <HistorySection items={historyItems} />

      {statusMessage && <p className="status">{statusMessage}</p>}
    </main>
  );
}

export default App;
