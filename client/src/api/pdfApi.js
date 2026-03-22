import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

/**
 * Merge multiple PDF files.
 * @param {File[]} files
 */
export async function mergePdfs(files, onProgress) {
  const form = new FormData();
  files.forEach((f) => form.append('pdfs', f));
  const res = await axios.post(`${API_BASE}/merge`, form, {
    onUploadProgress: onProgress,
  });
  return res.data;
}

/**
 * Split a PDF into a page range.
 * @param {File}   file
 * @param {number} startPage
 * @param {number} endPage
 */
export async function splitPdf(file, startPage, endPage, onProgress) {
  const form = new FormData();
  form.append('pdf', file);
  form.append('startPage', startPage);
  form.append('endPage', endPage);
  const res = await axios.post(`${API_BASE}/split`, form, {
    onUploadProgress: onProgress,
  });
  return res.data;
}

/**
 * Compress a PDF.
 * @param {File} file
 */
export async function compressPdf(file, onProgress) {
  const form = new FormData();
  form.append('pdf', file);
  const res = await axios.post(`${API_BASE}/compress`, form, {
    onUploadProgress: onProgress,
  });
  return res.data;
}

/**
 * Convert images to PDF.
 * @param {File[]} files
 */
export async function convertToPdf(files, onProgress) {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  const res = await axios.post(`${API_BASE}/convert`, form, {
    onUploadProgress: onProgress,
  });
  return res.data;
}

/**
 * Add a watermark to a PDF.
 * @param {File}   file
 * @param {object} options
 */
export async function addWatermark(file, options, onProgress) {
  const form = new FormData();
  form.append('pdf', file);
  Object.entries(options).forEach(([k, v]) => form.append(k, v));
  const res = await axios.post(`${API_BASE}/watermark`, form, {
    onUploadProgress: onProgress,
  });
  return res.data;
}
