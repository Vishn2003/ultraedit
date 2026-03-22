'use strict';

const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');

/**
 * Add a text watermark to every page of a PDF.
 *
 * @param {string} inputPath  - Absolute path to the source PDF.
 * @param {string} outputPath - Absolute path for the watermarked PDF.
 * @param {object} options
 * @param {string} [options.text='CONFIDENTIAL']  - Watermark text.
 * @param {number} [options.fontSize=50]          - Font size in points.
 * @param {number} [options.opacity=0.25]         - Opacity (0–1).
 * @param {number} [options.rotation=45]          - Rotation in degrees.
 * @param {string} [options.color='#FF0000']      - Hex colour string.
 */
async function addWatermark(inputPath, outputPath, options = {}) {
  const {
    text = 'CONFIDENTIAL',
    fontSize = 50,
    opacity = 0.25,
    rotation = 45,
    color = '#FF0000',
  } = options;

  // Parse hex colour to rgb fractions
  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  };

  const bytes = fs.readFileSync(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const textColor = hexToRgb(color);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - fontSize / 2,
      size: fontSize,
      font,
      color: textColor,
      opacity,
      rotate: degrees(rotation),
    });
  }

  const outBytes = await doc.save();
  fs.writeFileSync(outputPath, outBytes);
}

module.exports = { addWatermark };
