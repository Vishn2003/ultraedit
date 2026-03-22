'use strict';

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Split a PDF into multiple documents based on page ranges.
 *
 * @param {string}   inputPath  - Absolute path to the source PDF.
 * @param {string}   outputPath - Absolute path for the output PDF.
 * @param {number}   startPage  - 1-based start page (inclusive).
 * @param {number}   endPage    - 1-based end page (inclusive).
 */
async function splitPdf(inputPath, outputPath, startPage, endPage) {
  const bytes = fs.readFileSync(inputPath);
  const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const start = Math.max(1, startPage);
  const end = Math.min(totalPages, endPage);

  if (start > end) {
    const err = new Error(`Invalid page range: ${startPage}–${endPage}. Document has ${totalPages} pages.`);
    err.status = 400;
    throw err;
  }

  const newDoc = await PDFDocument.create();
  // getPageIndices() are 0-based; user provides 1-based numbers
  const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
  const copiedPages = await newDoc.copyPages(srcDoc, indices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const outBytes = await newDoc.save();
  fs.writeFileSync(outputPath, outBytes);
}

module.exports = { splitPdf };
