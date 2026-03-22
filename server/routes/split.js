'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');
const { splitController } = require('../controllers/splitController');

/**
 * POST /api/split
 * Body: multipart/form-data with field "pdf" (single PDF) + startPage + endPage
 */
router.post('/', upload.single('pdf'), splitController);

module.exports = router;
