import React from 'react';
import { Inbox, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-100 dark:bg-surface-800">
      <Icon className="w-7 h-7 text-surface-400 dark:text-surface-500" />
    </div>
    <div>
      <p className="font-semibold text-surface-900 dark:text-white">{title}</p>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{description}</p>
      )}
    </div>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors duration-150"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
