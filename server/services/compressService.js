'use strict';

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Compress a PDF by re-saving it with pdf-lib's default optimizations.
 * For heavier compression, this service can be extended to shell out to Ghostscript
 * when it is available on the host.
 *
 * @param {string} inputPath  - Absolute path to the source PDF.
 * @param {string} outputPath - Absolute path for the compressed PDF.
 * @returns {{ originalSize: number, compressedSize: number }}
 */
async function compressPdf(inputPath, outputPath) {
  const bytes = fs.readFileSync(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  // pdf-lib can remove unused objects when saving
  const compressedBytes = await doc.save({ useObjectStreams: true });
  fs.writeFileSync(outputPath, compressedBytes);

  return {
    originalSize: bytes.length,
    compressedSize: compressedBytes.length,
  };
}

module.exports = { compressPdf };
