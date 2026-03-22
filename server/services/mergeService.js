'use strict';

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Merge multiple PDF files into one.
 * @param {string[]} inputPaths - Absolute paths to input PDF files.
 * @param {string}   outputPath - Absolute path where the merged PDF will be written.
 */
async function mergePdfs(inputPaths, outputPath) {
  if (!inputPaths || inputPaths.length < 2) {
    const err = new Error('At least two PDF files are required to merge.');
    err.status = 400;
    throw err;
  }

  const mergedDoc = await PDFDocument.create();

  for (const filePath of inputPaths) {
    const bytes = fs.readFileSync(filePath);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  const mergedBytes = await mergedDoc.save();
  fs.writeFileSync(outputPath, mergedBytes);
}

module.exports = { mergePdfs };
