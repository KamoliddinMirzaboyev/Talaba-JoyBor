import React from 'react';
import { Building } from 'lucide-react';
import { Listing } from '../../types';

interface ApplicationSidebarProps {
  selectedListing: Listing | null;
}

const ApplicationSidebar: React.FC<ApplicationSidebarProps> = ({ selectedListing }) => {
  if (!selectedListing) return null;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-4 sticky top-20">
        <p className="text-[11px] font-medium text-surface-500 mb-2">Yotoqxona</p>
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-4 h-4 text-brand-600" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white leading-snug">
              {selectedListing.title}
            </h4>
            {selectedListing.university && (
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                {selectedListing.university}
              </p>
            )}
            {selectedListing.price > 0 && (
              <p className="text-xs font-medium text-brand-600 mt-1">
                {new Intl.NumberFormat('uz-UZ').format(selectedListing.price)} so'm / oy
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSidebar;
