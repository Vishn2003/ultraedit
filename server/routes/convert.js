'use strict';

const router = require('express').Router();
const { upload } = require('../utils/upload');
const { convertController } = require('../controllers/convertController');

/**
 * POST /api/convert
 * Body: multipart/form-data with field "images" (1–10 image files: JPEG/PNG/WEBP)
 */
router.post('/', upload.array('images', 10), convertController);

module.exports = router;
