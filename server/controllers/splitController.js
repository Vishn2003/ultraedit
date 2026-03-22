'use strict';

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { splitPdf } = require('../services/splitService');
const { deleteFile } = require('../utils/cleanup');
const { UPLOADS_DIR } = require('../utils/upload');

async function splitController(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Please upload a PDF file.' });
  }

  const startPage = parseInt(req.body.startPage, 10);
  const endPage = parseInt(req.body.endPage, 10);

  if (isNaN(startPage) || isNaN(endPage) || startPage < 1 || endPage < startPage) {
    deleteFile(file.path);
    return res.status(400).json({ error: 'Invalid page range. Provide valid startPage and endPage.' });
  }

  const outputFileName = `split-${uuidv4()}.pdf`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  try {
    await splitPdf(file.path, outputPath, startPage, endPage);
    deleteFile(file.path);
    return res.json({
      message: `Pages ${startPage}–${endPage} extracted successfully.`,
      downloadUrl: `/files/${outputFileName}`,
    });
  } catch (err) {
    deleteFile(file.path);
    return next(err);
  }
}

module.exports = { splitController };
