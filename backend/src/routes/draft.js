const express = require('express');
const { get, run } = require('../db/database');

const router = express.Router();

router.get('/draft/:id', async (req, res, next) => {
  try {
    const draftId = Number(req.params.id);
    if (!Number.isInteger(draftId)) {
      return res.status(400).json({ error: 'Invalid draft id.' });
    }

    const row = await get('SELECT id, generated_draft FROM requests WHERE id = ?', [draftId]);
    if (!row) {
      return res.status(404).json({ error: 'Draft not found.' });
    }

    return res.json({
      id: row.id,
      generated_draft: row.generated_draft,
    });
  } catch (error) {
    return next(error);
  }
});

router.put('/draft/:id', async (req, res, next) => {
  try {
    const draftId = Number(req.params.id);
    const { editedDraft } = req.body;

    if (!Number.isInteger(draftId)) {
      return res.status(400).json({ error: 'Invalid draft id.' });
    }

    if (!editedDraft || typeof editedDraft !== 'string') {
      return res.status(400).json({ error: 'editedDraft is required.' });
    }

    const existing = await get('SELECT id FROM requests WHERE id = ?', [draftId]);
    if (!existing) {
      return res.status(404).json({ error: 'Draft not found.' });
    }

    await run('UPDATE requests SET generated_draft = ? WHERE id = ?', [editedDraft.trim(), draftId]);

    const updated = await get('SELECT id, generated_draft FROM requests WHERE id = ?', [draftId]);
    return res.json({
      id: updated.id,
      generated_draft: updated.generated_draft,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
