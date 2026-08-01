import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Building, CheckCircle, User } from 'lucide-react';
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
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            Ariza yuborish uchun avval tizimga kirishingiz kerak
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-150"
          >
            Tizimga kirish
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
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">
              Ariza Muvaffaqiyatli Yuborildi!
            </h2>
            <p className="text-surface-600 dark:text-surface-300 mb-2">
              Sizning arizangiz ko'rib chiqilmoqda.
            </p>
            <p className="text-surface-600 dark:text-surface-300 mb-8">
              Tez orada javob oling va keyingi qadamlar haqida xabar oling.
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dormitories')}
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white mb-2">
            Yashash Joyi Uchun Ariza Topshirish
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 font-medium uppercase tracking-widest">
            Iltimos, barcha ma'lumotlarni rasmiy hujjatlaringiz asosida to'ldiring
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-brand-600" />
                Ariza Ma'lumotlari
              </h2>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                    <p className="text-danger-700 dark:text-danger-300">{errors.general}</p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                      Form to'ldirish jarayoni
                    </span>
                    <span className="text-sm font-bold text-brand-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
                    <div
                      className="bg-brand-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {selectedListing ? (
                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-brand-600" />
                      <div>
                        <h3 className="font-semibold text-brand-900 dark:text-brand-100">
                          Ariza Yuborilayotgan Yotoqxona
                        </h3>
                        <p className="text-brand-700 dark:text-brand-300">{selectedListing.title}</p>
                        {selectedListing.university && (
                          <p className="text-sm text-brand-700 dark:text-brand-400">
                            {selectedListing.university}
                          </p>
                        )}
                        <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">
                          ✨ Bu yotoqxona uchun ariza yubormoqdasiz
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-danger-600" />
                      <div>
                        <h3 className="font-semibold text-danger-900 dark:text-danger-100">Xatolik</h3>
                        <p className="text-danger-700 dark:text-danger-300">
                          Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza
                          yuborish tugmasini bosing.
                        </p>
                      </div>
                    </div>
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

                <div className="pt-6">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Arizani Tasdiqlash
                      </>
                    )}
                  </motion.button>
                  <p className="text-[10px] text-center text-surface-400 mt-4 uppercase tracking-widest">
                    Tasdiqlash tugmasini bosish orqali ma'lumotlarning to'g'riligini tasdiqlaysiz
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <ApplicationSidebar selectedListing={selectedListing} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
