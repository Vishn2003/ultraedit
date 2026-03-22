import React from 'react';

/**
 * Download button that opens a link returned by the server.
 * Props:
 *   url      - relative or absolute URL
 *   filename - suggested download name
 */
function DownloadButton({ url, filename = 'result.pdf' }) {
  if (!url) return null;

  // Build absolute URL from server base when running in dev (CRA proxy)
  const href = url.startsWith('http') ? url : `${window.location.protocol}//${window.location.hostname}:5000${url}`;

  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download Result
    </a>
  );
}

export default DownloadButton;
