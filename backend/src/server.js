require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDatabase, run, all, get } = require('./db/database');
const { generateDraft } = require('./services/openaiService');

const app = express();
const port = Number(process.env.PORT) || 4000;

const SENSITIVE_TOPIC_PATTERNS = [
  /legal advice/i,
  /medical advice/i,
  /financial advice/i,
];

function hasSensitiveTopic(text) {
  return SENSITIVE_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}

function mapHistoryRow(row) {
  let draftingSeconds = null;
  if (row.generated_at && row.saved_at) {
    const generatedAt = new Date(row.generated_at).getTime();
    const savedAt = new Date(row.saved_at).getTime();
    if (!Number.isNaN(generatedAt) && !Number.isNaN(savedAt) && savedAt >= generatedAt) {
      draftingSeconds = Math.round((savedAt - generatedAt) / 1000);
    }
  }

  return {
    id: row.id,
    problemDescription: row.problem_description,
    generatedDraft: row.generated_draft,
    editedDraft: row.edited_draft,
    generatedAt: row.generated_at,
    savedAt: row.saved_at,
    draftingSeconds,
    createdAt: row.created_at,
  };
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/submit', async (req, res, next) => {
  try {
    const { problemDescription } = req.body;

    if (!problemDescription || typeof problemDescription !== 'string') {
      return res.status(400).json({ error: 'problemDescription is required.' });
    }

    const trimmedDescription = problemDescription.trim();

    if (hasSensitiveTopic(trimmedDescription)) {
      return res.status(200).json({
        warning:
          'Sensitive topic detected (legal/medical/financial advice). Please consult a qualified professional instead of using an AI draft.',
      });
    }

    const draft = await generateDraft(trimmedDescription);

    const result = await run(
      `INSERT INTO requests (problem_description, generated_draft)
       VALUES (?, ?)`,
      [trimmedDescription, draft]
    );

    const saved = await get(
      'SELECT id, generated_at, saved_at, created_at FROM requests WHERE id = ?',
      [result.id]
    );

    return res.status(201).json({
      id: saved.id,
      problemDescription: trimmedDescription,
      generatedDraft: draft,
      generatedAt: saved.generated_at,
      savedAt: saved.saved_at,
      createdAt: saved.created_at,
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/save', async (req, res, next) => {
  try {
    const { requestId, editedDraft } = req.body;

    if (!Number.isInteger(requestId)) {
      return res.status(400).json({ error: 'requestId must be an integer.' });
    }

    if (!editedDraft || typeof editedDraft !== 'string') {
      return res.status(400).json({ error: 'editedDraft is required.' });
    }

    const existing = await get('SELECT id FROM requests WHERE id = ?', [requestId]);
    if (!existing) {
      return res.status(404).json({ error: 'request not found.' });
    }

    await run(
      `UPDATE requests
       SET edited_draft = ?, saved_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [editedDraft.trim(), requestId]
    );

    const updated = await get(
      `SELECT id, generated_at, saved_at, edited_draft
       FROM requests
       WHERE id = ?`,
      [requestId]
    );

    let draftingSeconds = null;
    if (updated.generated_at && updated.saved_at) {
      draftingSeconds = Math.round(
        (new Date(updated.saved_at).getTime() - new Date(updated.generated_at).getTime()) / 1000
      );
    }

    return res.status(200).json({
      id: updated.id,
      editedDraft: updated.edited_draft,
      generatedAt: updated.generated_at,
      savedAt: updated.saved_at,
      draftingSeconds,
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/history', async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT id, problem_description, generated_draft, edited_draft, generated_at, saved_at, created_at
       FROM requests
       ORDER BY created_at DESC`
    );

    return res.json(rows.map(mapHistoryRow));
  } catch (error) {
    return next(error);
  }
});

app.post('/feedback', async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (!Number.isInteger(requestId)) {
      return res.status(400).json({ error: 'requestId must be an integer.' });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be an integer from 1 to 5.' });
    }

    const existing = await get('SELECT id FROM requests WHERE id = ?', [requestId]);
    if (!existing) {
      return res.status(404).json({ error: 'request not found.' });
    }

    const result = await run(
      `INSERT INTO feedback (request_id, rating, comment)
       VALUES (?, ?, ?)`,
      [requestId, rating, comment || null]
    );

    return res.status(201).json({
      id: result.id,
      requestId,
      rating,
      comment: comment || null,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error.' : err.message;
  res.status(status).json({ error: message });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`DraftMate backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
