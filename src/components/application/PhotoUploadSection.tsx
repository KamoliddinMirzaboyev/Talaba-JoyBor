import React from 'react';
import { Upload, User, X } from 'lucide-react';
import { FieldError } from './shared';

interface PhotoUploadSectionProps {
  userImage: File | null | undefined;
  uploading: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  userImage,
  uploading,
  error,
  onFileChange,
}) => {
  return (
    <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <User className="w-4 h-4 text-brand-600" />
        Shaxsiy Fotosurat
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1">
          <div
            className={`w-32 h-40 mx-auto rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors duration-150 ${
              userImage
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : 'border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50'
            }`}
          >
            {userImage ? (
              <img loading="lazy" src={URL.createObjectURL(userImage)} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-surface-300" />
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            Yuzingiz aniq ko'ringan, sifatli rasm yuklang. Bu arizangizni ko'rib chiqishda muhim rol o'ynaydi.
          </p>

          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              className="hidden"
              id="user-image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="user-image-upload"
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors duration-150 flex items-center gap-2 ${
                uploading
                  ? 'bg-surface-100 text-surface-400 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
              }`}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Rasm tanlash
            </label>

            {userImage && (
              <button
                onClick={() => onFileChange(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors duration-150 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                O'chirish
              </button>
            )}
          </div>
          <p className="text-[10px] text-surface-400 uppercase">JPG, PNG (MAX: 5MB)</p>
        </div>
      </div>
      <FieldError message={error} className="mt-2" />
    </div>
  );
};

export default PhotoUploadSection;
