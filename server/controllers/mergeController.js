'use strict';

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { mergePdfs } = require('../services/mergeService');
const { deleteFiles } = require('../utils/cleanup');
const { UPLOADS_DIR } = require('../utils/upload');

async function mergeController(req, res, next) {
  const files = req.files;
  if (!files || files.length < 2) {
    return res.status(400).json({ error: 'Please upload at least two PDF files.' });
  }

  const inputPaths = files.map((f) => f.path);
  const outputFileName = `merged-${uuidv4()}.pdf`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  try {
    await mergePdfs(inputPaths, outputPath);
    // Clean up source uploads immediately
    deleteFiles(inputPaths);
    return res.json({
      message: 'PDFs merged successfully.',
      downloadUrl: `/files/${outputFileName}`,
    });
  } catch (err) {
    deleteFiles(inputPaths);
    return next(err);
  }
}

module.exports = { mergeController };
