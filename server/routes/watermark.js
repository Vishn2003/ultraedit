'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');
const { watermarkController } = require('../controllers/watermarkController');

/**
 * POST /api/watermark
 * Body: multipart/form-data with field "pdf" + optional text/fontSize/opacity/rotation/color
 */
router.post('/', upload.single('pdf'), watermarkController);

module.exports = router;
