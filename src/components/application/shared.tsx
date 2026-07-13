import React from 'react';
import { AlertCircle } from 'lucide-react';

// ponytail: shared input style string instead of a styled-input component — every
// field still needs its own icon/placeholder, so a wrapper component would just
// forward props. One line beats one more file.
export const inputClass = (hasError?: boolean, extra = '', padLeft = 'pl-10') =>
  `w-full ${padLeft} pr-4 py-3 border rounded-xl bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${hasError ? 'border-danger-500' : ''} ${extra}`;

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
