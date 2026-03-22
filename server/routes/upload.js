'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');

/**
 * POST /api/upload
 * Accepts up to 10 files (PDF or image). Returns metadata for each uploaded file.
 * This endpoint is used to pre-upload files before processing them with other endpoints.
 */
router.post('/', upload.array('files', 10), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files received.' });
  }

  const result = files.map((f) => ({
    originalName: f.originalname,
    storedName: f.filename,
    size: f.size,
    mimetype: f.mimetype,
    path: `/files/${f.filename}`,
  }));

  return res.json({ message: 'Files uploaded successfully.', files: result });
});

module.exports = router;
