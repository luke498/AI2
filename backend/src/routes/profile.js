const express = require('express');
const { get } = require('../db/database');

const router = express.Router();

router.get('/profile/stats', async (req, res, next) => {
  try {
    const draftsGeneratedRow = await get('SELECT COUNT(*) AS count FROM requests');
    const draftsSavedRow = await get('SELECT COUNT(*) AS count FROM requests WHERE saved_at IS NOT NULL');
    const feedbackRow = await get('SELECT COUNT(*) AS count FROM feedback');

    return res.json({
      draftsGenerated: draftsGeneratedRow?.count || 0,
      savedDrafts: draftsSavedRow?.count || 0,
      feedbackCount: feedbackRow?.count || 0,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
