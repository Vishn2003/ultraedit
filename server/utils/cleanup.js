'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Safely delete a file, ignoring errors if it doesn't exist.
 * @param {string} filePath - Absolute path to the file.
 */
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err.message);
  }
}

/**
 * Delete multiple files.
 * @param {string[]} filePaths
 */
function deleteFiles(filePaths) {
  filePaths.forEach(deleteFile);
}

/**
 * Schedule periodic cleanup of old files in a directory.
 * @param {string} dir        - Directory to scan.
 * @param {number} maxAge     - Maximum file age in ms before deletion.
 * @param {number} interval   - How often to run the cleanup, in ms.
 */
function scheduleCleanup(dir, maxAge, interval) {
  const run = () => {
    if (!fs.existsSync(dir)) return;
    const now = Date.now();
    let entries;
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && now - stat.mtimeMs > maxAge) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // ignore per-file errors
      }
    });
  };

  // Run immediately on startup, then on the interval
  run();
  setInterval(run, interval);
}

module.exports = { deleteFile, deleteFiles, scheduleCleanup };
