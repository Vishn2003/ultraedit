import React from 'react';

/**
 * Progress bar component.
 * Props:
 *   value  - 0-100 integer
 *   label  - optional text shown next to bar
 */
function ProgressBar({ value, label }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-sm text-gray-600 flex justify-between">
          <span>{label}</span>
          <span>{clamped}%</span>
        </p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-brand-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
