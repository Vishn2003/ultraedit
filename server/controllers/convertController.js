'use strict';

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { convertImagesToPdf } = require('../services/convertService');
const { deleteFiles } = require('../utils/cleanup');
const { UPLOADS_DIR } = require('../utils/upload');

async function convertController(req, res, next) {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Please upload at least one image file.' });
  }

  const imagePaths = files.map((f) => f.path);
  const outputFileName = `converted-${uuidv4()}.pdf`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  try {
    await convertImagesToPdf(imagePaths, outputPath);
    deleteFiles(imagePaths);
    return res.json({
      message: 'Images converted to PDF successfully.',
      downloadUrl: `/files/${outputFileName}`,
    });
  } catch (err) {
    deleteFiles(imagePaths);
    return next(err);
  }
}

module.exports = { convertController };
