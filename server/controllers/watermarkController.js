'use strict';

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { addWatermark } = require('../services/watermarkService');
const { deleteFile } = require('../utils/cleanup');
const { UPLOADS_DIR } = require('../utils/upload');

async function watermarkController(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Please upload a PDF file.' });
  }

  const { text, fontSize, opacity, rotation, color } = req.body;
  const options = {
    text: text || 'CONFIDENTIAL',
    fontSize: fontSize ? Number(fontSize) : 50,
    opacity: opacity !== undefined ? Number(opacity) : 0.25,
    rotation: rotation !== undefined ? Number(rotation) : 45,
    color: color || '#FF0000',
  };

  // Validate colour format (must be a 6-digit hex like #RRGGBB)
  if (!/^#[0-9A-Fa-f]{6}$/.test(options.color)) {
    deleteFile(file.path);
    return res.status(400).json({ error: 'Invalid color format. Use #RRGGBB hex notation.' });
  }

  const outputFileName = `watermarked-${uuidv4()}.pdf`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  try {
    await addWatermark(file.path, outputPath, options);
    deleteFile(file.path);
    return res.json({
      message: 'Watermark added successfully.',
      downloadUrl: `/files/${outputFileName}`,
    });
  } catch (err) {
    deleteFile(file.path);
    return next(err);
  }
}

module.exports = { watermarkController };
