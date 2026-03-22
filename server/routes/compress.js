'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');
const { compressController } = require('../controllers/compressController');

/**
 * POST /api/compress
 * Body: multipart/form-data with field "pdf" (single PDF)
 */
router.post('/', upload.single('pdf'), compressController);

module.exports = router;
