'use strict';

const { PDFDocument } = require('pdf-lib');
const Jimp = require('jimp');
const fs = require('fs');

/**
 * Convert one or more image files (JPEG / PNG / WEBP) to a single PDF.
 *
 * @param {string[]} imagePaths - Absolute paths to image files.
 * @param {string}   outputPath - Absolute path for the resulting PDF.
 */
async function convertImagesToPdf(imagePaths, outputPath) {
  if (!imagePaths || imagePaths.length === 0) {
    const err = new Error('At least one image file is required.');
    err.status = 400;
    throw err;
  }

  const pdfDoc = await PDFDocument.create();

  for (const imgPath of imagePaths) {
    // Use Jimp to normalise the image to PNG bytes that pdf-lib can embed
    const jimpImg = await Jimp.read(imgPath);
    const pngBuffer = await jimpImg.getBuffer('image/png');

    const embeddedImg = await pdfDoc.embedPng(pngBuffer);
    const { width, height } = embeddedImg.scale(1);

    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embeddedImg, { x: 0, y: 0, width, height });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

module.exports = { convertImagesToPdf };
