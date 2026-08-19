import React from 'react';
import { AlertCircle } from 'lucide-react';

// ponytail: shared input style string instead of a styled-input component — every
// field still needs its own icon/placeholder, so a wrapper component would just
// forward props. One line beats one more file.
export const inputClass = (hasError?: boolean, extra = '', padLeft = 'pl-8') =>
  `w-full ${padLeft} pr-3 py-2 text-sm border rounded-xl bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${hasError ? 'border-danger-500' : ''} ${extra}`;

export const selectClass = (hasError?: boolean, extra = '') =>
  inputClass(hasError, extra, 'pl-3');

export const labelClass =
  'block text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1';

export const sectionTitleClass =
  'text-xs font-semibold text-surface-800 dark:text-surface-200 mb-2.5 flex items-center gap-1.5';

export const FieldError: React.FC<{ message?: string; className?: string }> = ({
  message,
  className = 'mt-1',
}) => {
  if (!message) return null;
  return (
    <p className={`text-danger-500 text-xs flex items-center gap-1 ${className}`}>
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </p>
  );
};
