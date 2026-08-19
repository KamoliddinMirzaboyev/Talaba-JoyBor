import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Building, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import PersonalInfoSection from '../components/application/PersonalInfoSection';
import LocationSection from '../components/application/LocationSection';
import AcademicInfoSection from '../components/application/AcademicInfoSection';
import ContactInfoSection from '../components/application/ContactInfoSection';
import PhotoUploadSection from '../components/application/PhotoUploadSection';
import DocumentUploadsSection from '../components/application/DocumentUploadsSection';
import NotesSection from '../components/application/NotesSection';
import ApplicationSidebar from '../components/application/ApplicationSidebar';
import { useApplicationForm } from '../components/application/useApplicationForm';

const ApplicationPage: React.FC = () => {
  const {
    navigate,
    selectedListing,
    isAuthenticated,
    isLoading,
    user,
    formData,
    provinces,
    districts,
    selectedProvinceId,
    isSubmitting,
    errors,
    submitSuccess,
    uploadingFiles,
    progressPercent,
    registerFieldRef,
    handleInputChange,
    handlePassportChange,
    handlePinflChange,
    handleFileUpload,
    handleCityChange,
    handleSubmit,
  } = useApplicationForm();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user?.id) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
            Tizimga kiring
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
            Ariza yuborish uchun avval tizimga kirishingiz kerak
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors duration-150"
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-8 text-center"
          >
            <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
              Ariza yuborildi
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              Arizangiz ko'rib chiqilmoqda. Tez orada javob olasiz.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors duration-150"
            >
              Dashboard ga o'tish
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-24 lg:pb-8">
        <button
          onClick={() => navigate('/dormitories')}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 mb-3 transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </button>

        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-surface-900 dark:text-white">
              Ariza
            </h1>
            <p className="text-[11px] text-surface-500 mt-0.5">{progressPercent}% to'ldirilgan</p>
          </div>
          <div className="w-24 h-1 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-3.5 sm:p-6">
              {errors.general && (
                <div className="mb-3 p-2.5 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-danger-600 dark:text-danger-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-danger-700 dark:text-danger-300">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3.5">
                {selectedListing ? (
                  <div className="flex items-center gap-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 px-3 py-2">
                    <Building className="w-4 h-4 text-brand-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900 dark:text-brand-100 truncate">
                        {selectedListing.title}
                      </p>
                      {selectedListing.university && (
                        <p className="text-[11px] text-brand-700 dark:text-brand-400 truncate">
                          {selectedListing.university}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 rounded-xl border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-danger-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-danger-700 dark:text-danger-300">
                      Yotoqxona tanlanmagan. Ro'yxatdan ariza yuboring.
                    </p>
                  </div>
                )}

                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  onFieldChange={handleInputChange}
                  registerFieldRef={registerFieldRef}
                />

                <LocationSection
                  formData={formData}
                  errors={errors}
                  provinces={provinces}
                  districts={districts}
                  selectedProvinceId={selectedProvinceId}
                  onCityChange={handleCityChange}
                  onVillageChange={(value) => handleInputChange('village', value)}
                  registerFieldRef={registerFieldRef}
                />

                <AcademicInfoSection
                  formData={formData}
                  errors={errors}
                  onFieldChange={handleInputChange}
                  registerFieldRef={registerFieldRef}
                />

                <ContactInfoSection
                  formData={formData}
                  errors={errors}
                  onPhoneChange={(value) => handleInputChange('phone', value)}
                  onPassportChange={handlePassportChange}
                  onPinflChange={handlePinflChange}
                  registerFieldRef={registerFieldRef}
                />

                <PhotoUploadSection
                  userImage={formData.user_image}
                  uploading={!!uploadingFiles.user_image}
                  error={errors.user_image}
                  onFileChange={(file) => handleFileUpload('user_image', file)}
                />

                <DocumentUploadsSection
                  document={formData.document}
                  passportImageFirst={formData.passport_image_first}
                  passportImageSecond={formData.passport_image_second}
                  uploadingDocument={!!uploadingFiles.document}
                  onDocumentChange={(file) => handleFileUpload('document', file)}
                  onPassportFirstChange={(file) => handleFileUpload('passport_image_first', file)}
                  onPassportSecondChange={(file) => handleFileUpload('passport_image_second', file)}
                />

                <NotesSection
                  value={formData.comment}
                  onChange={(value) => handleInputChange('comment', value)}
                />

                <div className="hidden lg:block pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white py-2.5 rounded-xl font-semibold hover:bg-brand-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    {isSubmitting ? 'Yuborilmoqda...' : 'Arizani yuborish'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ApplicationSidebar selectedListing={selectedListing} />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-surface-200 dark:border-surface-800 bg-white/95 dark:bg-surface-900/95 backdrop-blur-sm px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors duration-150 disabled:opacity-50"
        >
          {isSubmitting ? 'Yuborilmoqda...' : 'Arizani yuborish'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationPage;
