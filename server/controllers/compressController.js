'use strict';

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { compressPdf } = require('../services/compressService');
const { deleteFile } = require('../utils/cleanup');
const { UPLOADS_DIR } = require('../utils/upload');

async function compressController(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Please upload a PDF file.' });
  }

  const outputFileName = `compressed-${uuidv4()}.pdf`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  try {
    const { originalSize, compressedSize } = await compressPdf(file.path, outputPath);
    deleteFile(file.path);
    return res.json({
      message: 'PDF compressed successfully.',
      downloadUrl: `/files/${outputFileName}`,
      originalSize,
      compressedSize,
      savings: `${(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%`,
    });
  } catch (err) {
    deleteFile(file.path);
    return next(err);
  }
}

module.exports = { compressController };
