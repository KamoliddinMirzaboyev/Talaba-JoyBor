import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ value, onChange }) => {
  return (
    <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
      <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
        Qo'shimcha Izoh
      </label>
      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full pl-10 pr-4 py-3 border rounded-xl bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 resize-none"
          placeholder="Maxsus talablar yoki qo'shimcha ma'lumotlar..."
        />
      </div>
    </div>
  );
};

export default NotesSection;
