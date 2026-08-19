import React from 'react';


interface NotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ value, onChange }) => {
  return (
    <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
      <label className="block text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1">
        Izoh
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 text-sm border rounded-xl bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 resize-none"
        placeholder="Qo'shimcha ma'lumot (ixtiyoriy)"
      />
    </div>
  );
};

export default NotesSection;
