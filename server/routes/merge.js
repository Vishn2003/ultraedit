'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');
const { mergeController } = require('../controllers/mergeController');

/**
 * POST /api/merge
 * Body: multipart/form-data with field "pdfs" (2–10 PDF files)
 */
router.post('/', upload.array('pdfs', 10), mergeController);

module.exports = router;
