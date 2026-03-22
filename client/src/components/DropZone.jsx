import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Reusable drag-and-drop file upload area.
 *
 * Props:
 *   onFiles(files: File[]) - called when files are dropped or selected
 *   accept     - react-dropzone accept object, e.g. { 'application/pdf': ['.pdf'] }
 *   multiple   - allow multiple files (default: true)
 *   label      - helper text shown in the drop zone
 *   files      - current file list (for display)
 *   onRemove(index) - callback to remove a file from the list
 */
function DropZone({ onFiles, accept, multiple = true, label, files = [], onRemove }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-500 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-12 h-12 ${isDragActive ? 'text-brand-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-brand-600 font-medium">Drop the files here…</p>
          ) : (
            <div>
              <p className="font-medium text-gray-700">
                Drag &amp; drop files here, or{' '}
                <span className="text-brand-600 underline">browse</span>
              </p>
              {label && <p className="text-sm text-gray-500 mt-1">{label}</p>}
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
            >
              <span className="text-sm text-gray-700 truncate max-w-xs">{f.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={() => onRemove && onRemove(i)}
                  className="text-red-400 hover:text-red-600 text-sm font-medium"
                  aria-label={`Remove ${f.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropZone;
