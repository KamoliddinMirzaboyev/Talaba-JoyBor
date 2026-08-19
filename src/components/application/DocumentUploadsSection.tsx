import React from 'react';
import { FileText, Upload, X } from 'lucide-react';

interface DocumentUploadsSectionProps {
  document: File | null | undefined;
  passportImageFirst: File | null | undefined;
  passportImageSecond: File | null | undefined;
  uploadingDocument: boolean;
  onDocumentChange: (file: File | null) => void;
  onPassportFirstChange: (file: File | null) => void;
  onPassportSecondChange: (file: File | null) => void;
}

const DocumentUploadsSection: React.FC<DocumentUploadsSectionProps> = ({
  document,
  passportImageFirst,
  passportImageSecond,
  uploadingDocument,
  onDocumentChange,
  onPassportFirstChange,
  onPassportSecondChange,
}) => {
  return (
    <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
      <h3 className="text-xs font-semibold text-surface-800 dark:text-surface-200 mb-2.5 flex items-center gap-1.5">
        <Upload className="w-3.5 h-3.5 text-brand-600" />
        Hujjatlar
      </h3>

      <div className="space-y-3">
        <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-surface-700 dark:text-surface-300">Qo'shimcha Hujjat</h4>
              <p className="text-xs text-surface-500">PDF, JPG, PNG formatlarida</p>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onDocumentChange(e.target.files?.[0] || null)}
                className="hidden"
                id="document-upload"
                disabled={uploadingDocument}
              />
              <label
                htmlFor="document-upload"
                className={`p-2 rounded-xl cursor-pointer transition-colors duration-150 ${
                  uploadingDocument
                    ? 'bg-surface-200 text-surface-400'
                    : 'bg-white dark:bg-surface-800 text-brand-600 shadow-sm border border-surface-200 dark:border-surface-700 hover:border-brand-500'
                }`}
              >
                <Upload className="w-5 h-5" />
              </label>
              {document && (
                <button
                  onClick={() => onDocumentChange(null)}
                  className="p-2 rounded-xl text-danger-500 bg-danger-50 hover:bg-danger-100 transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          {document && (
            <div className="flex items-center gap-2 py-2 px-3 bg-white dark:bg-surface-800 rounded-lg border border-brand-100 dark:border-brand-900">
              <FileText className="w-4 h-4 text-brand-600" />
              <span className="text-xs text-surface-600 dark:text-surface-300 truncate max-w-[200px]">
                {document.name}
              </span>
              <span className="text-[10px] text-surface-400 ml-auto">
                {(document.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase">Pasport (1-bet)</h4>
              <div className="flex gap-1">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => onPassportFirstChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="passport-first-upload"
                />
                <label
                  htmlFor="passport-first-upload"
                  className="p-1.5 rounded-md cursor-pointer hover:bg-white dark:hover:bg-surface-800 text-brand-600 transition-colors duration-150"
                >
                  <Upload className="w-4 h-4" />
                </label>
                {passportImageFirst && (
                  <button
                    onClick={() => onPassportFirstChange(null)}
                    className="p-1.5 rounded-md text-danger-500 hover:bg-danger-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {passportImageFirst && (
              <div className="text-[10px] text-surface-500 truncate bg-white dark:bg-surface-800 p-2 rounded border border-surface-100 dark:border-surface-800">
                {passportImageFirst.name}
              </div>
            )}
          </div>

          <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase">Pasport (2-bet)</h4>
              <div className="flex gap-1">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => onPassportSecondChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="passport-second-upload"
                />
                <label
                  htmlFor="passport-second-upload"
                  className="p-1.5 rounded-md cursor-pointer hover:bg-white dark:hover:bg-surface-800 text-brand-600 transition-colors duration-150"
                >
                  <Upload className="w-4 h-4" />
                </label>
                {passportImageSecond && (
                  <button
                    onClick={() => onPassportSecondChange(null)}
                    className="p-1.5 rounded-md text-danger-500 hover:bg-danger-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {passportImageSecond && (
              <div className="text-[10px] text-surface-500 truncate bg-white dark:bg-surface-800 p-2 rounded border border-surface-100 dark:border-surface-800">
                {passportImageSecond.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadsSection;
