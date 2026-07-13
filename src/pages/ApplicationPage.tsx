import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Building, CheckCircle, User } from 'lucide-react';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getGlobalSelectedListing, clearGlobalSelectedListing } from '../App';
import { Dormitory } from '../types';
import { ApplicationFormData, District, Province } from '../components/application/types';
import PersonalInfoSection from '../components/application/PersonalInfoSection';
import LocationSection from '../components/application/LocationSection';
import AcademicInfoSection from '../components/application/AcademicInfoSection';
import ContactInfoSection from '../components/application/ContactInfoSection';
import PhotoUploadSection from '../components/application/PhotoUploadSection';
import DocumentUploadsSection from '../components/application/DocumentUploadsSection';
import NotesSection from '../components/application/NotesSection';
import ApplicationSidebar from '../components/application/ApplicationSidebar';

const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedListing = getGlobalSelectedListing();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user?.first_name || '',
    middle_name: '',
    familiya: user?.last_name || '',
    gender: '',
    city: '',
    village: '',
    phone: user?.phone || '',
    passport: '',
    pinfl: '',
    faculty: '',
    direction: '',
    course: '',
    group: '',
    user_image: null,
    comment: '',
    document: null,
    passport_image_first: null,
    passport_image_second: null
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [, setDormitories] = useState<Dormitory[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  // Field refs for auto-scroll/focus on validation errors
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>({});
  const registerFieldRef = (key: string) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
    fieldRefs.current[key] = el;
  };

  // When errors change, scroll to the first errored field
  useEffect(() => {
    const order = ['gender', 'name', 'familiya', 'city', 'village', 'course', 'phone', 'passport', 'faculty', 'direction', 'group'];
    const firstKey = order.find((k) => !!errors[k]);
    if (firstKey && fieldRefs.current[firstKey]) {
      const el = fieldRefs.current[firstKey]!;
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Defer focus slightly to ensure scroll completes on mobile
        setTimeout(() => {
          if ('focus' in el && typeof el.focus === 'function') {
            el.focus();
          }
        }, 150);
      } catch (scrollError) {
        // Ignore scroll errors
      }
    }
  }, [errors]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user?.first_name || '',
        familiya: user?.last_name || '',
        phone: user?.phone || '',
      }));
    }
  }, [user]);

  // API dan viloyatlar va yotoqxonalar ro'yxatini yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provincesData, dormitoriesResponse] = await Promise.all([
          authAPI.getProvinces(),
          authAPI.getDormitories()
        ]);

        setProvinces(provincesData);
        // Handle dormitories response (can be array or object with results)
        const dormitoriesData = (dormitoriesResponse.results || dormitoriesResponse) as Dormitory[];
        setDormitories(dormitoriesData);
      } catch (error) {
        // Handle error silently
      }
    };
    fetchData();
  }, []);

  // Tanlangan viloyat o'zgarganda tumanlarni yuklash
  useEffect(() => {
    if (selectedProvinceId) {
      const fetchDistricts = async () => {
        try {
          const data = await authAPI.getDistricts(selectedProvinceId);
          setDistricts(data);
        } catch (error) {
          setDistricts([]);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvinceId]);

  // Loading state
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

  // Authentication check
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

  // Pasport raqami validatsiya funksiyasi
  const validatePassportFormat = (passport: string): boolean => {
    // O'zbekiston pasport formati: 2 ta harf + 7 ta raqam (masalan: AA1234567)
    const passportRegex = /^[A-Z]{2}\d{7}$/;
    return passportRegex.test(passport);
  };

  const handlePassportChange = (value: string) => {
    // Faqat lotin harflari va raqamlarni qabul qilish
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Format bo'yicha tekshirish va to'g'rilash
    let formattedValue = '';
    for (let i = 0; i < cleanValue.length && i < 9; i++) {
      const char = cleanValue[i];
      if (i < 2) {
        // Birinchi 2 ta belgi faqat harflar bo'lishi kerak
        if (/[A-Z]/.test(char)) {
          formattedValue += char;
        }
      } else {
        // Keyingi 7 ta belgi faqat raqamlar bo'lishi kerak
        if (/[0-9]/.test(char)) {
          formattedValue += char;
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      passport: formattedValue
    }));

    // Real-time validatsiya
    if (formattedValue.length > 0) {
      if (formattedValue.length < 2) {
        setErrors(prev => ({ ...prev, passport: 'Avval 2 ta harf kiriting (masalan: AA)' }));
      } else if (formattedValue.length < 9) {
        const remainingChars = 9 - formattedValue.length;
        const needLetters = Math.max(0, 2 - formattedValue.replace(/[0-9]/g, '').length);
        const needNumbers = Math.max(0, 7 - formattedValue.replace(/[A-Z]/g, '').length);

        if (needLetters > 0) {
          setErrors(prev => ({ ...prev, passport: `Yana ${needLetters} ta harf kerak` }));
        } else if (needNumbers > 0) {
          setErrors(prev => ({ ...prev, passport: `Yana ${needNumbers} ta raqam kerak` }));
        } else {
          setErrors(prev => ({ ...prev, passport: `Yana ${remainingChars} ta belgi kerak` }));
        }
      } else if (!validatePassportFormat(formattedValue)) {
        setErrors(prev => ({ ...prev, passport: 'Pasport formati: 2 ta harf + 7 ta raqam (AA1234567)' }));
      } else {
        setErrors(prev => ({ ...prev, passport: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, passport: '' }));
    }
  };

  const handlePinflChange = (value: string) => {
    // Faqat raqamlarni qabul qilish
    const cleanValue = value.replace(/\D/g, '');

    // Maksimal 14 ta raqam
    const formattedValue = cleanValue.substring(0, 14);

    setFormData(prev => ({
      ...prev,
      pinfl: formattedValue
    }));

    // Real-time validatsiya
    if (formattedValue.length > 0) {
      if (formattedValue.length < 14) {
        setErrors(prev => ({ ...prev, pinfl: `JSHSHIR 14 ta raqamdan iborat bo'lishi kerak. Yana ${14 - formattedValue.length} ta raqam qoldi.` }));
      } else {
        setErrors(prev => ({ ...prev, pinfl: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, pinfl: '' }));
    }
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (field: keyof ApplicationFormData, file: File | null) => {
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'Fayl hajmi 5MB dan oshmasligi kerak' }));
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'Faqat JPG, PNG yoki PDF fayllar qabul qilinadi' }));
        return;
      }

      // Show loading state
      setUploadingFiles(prev => ({ ...prev, [field]: true }));

      // Simulate file processing (rasmni o'qish)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Hide loading state
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }

    handleInputChange(field, file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation (schema bo'yicha gender, name, last_name, dormitory, province, district, course majburiy)
    if (!selectedListing) {
      newErrors.general = 'Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.';
    }
    if (!formData.gender?.trim()) {
      newErrors.gender = 'Jins tanlanishi shart';
    }
    if (!formData.name?.trim()) {
      newErrors.name = 'Ism kiritilishi shart';
    }
    if (!formData.familiya?.trim()) {
      newErrors.familiya = 'Familiya kiritilishi shart';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'Viloyat tanlanishi shart';
    }
    if (!formData.village?.trim()) {
      newErrors.village = 'Tuman tanlanishi shart';
    }
    if (!formData.course?.trim()) {
      newErrors.course = 'Kurs tanlanishi shart';
    }
    // user_image ixtiyoriy

    // Optional fields - faqat format tekshiruvi

    // Phone validation
    if (formData.phone) {
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length !== 12) {
        newErrors.phone = 'Telefon raqam 12 ta raqamdan iborat bo\'lishi kerak (998901234567)';
      } else if (!phoneNumbers.startsWith('998')) {
        newErrors.phone = 'Telefon raqam 998 bilan boshlanishi kerak';
      }
    }

    // Passport validation
    if (formData.passport) {
      if (formData.passport.length !== 9) {
        newErrors.passport = 'Pasport raqami 9 ta belgidan iborat bo\'lishi kerak (2 harf + 7 raqam)';
      } else if (!validatePassportFormat(formData.passport)) {
        newErrors.passport = 'Pasport formati noto\'g\'ri. To\'g\'ri format: AA1234567';
      }
    }

    // PINFL validation
    if (formData.pinfl) {
      if (formData.pinfl.length !== 14) {
        newErrors.pinfl = 'JSHSHIR 14 ta raqamdan iborat bo\'lishi kerak';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // User authentication tekshiruvi
    if (!user || !user.id) {
      setErrors({ general: 'Foydalanuvchi ma\'lumotlari topilmadi. Iltimos, qaytadan tizimga kiring.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Telefon raqam validatsiyasi (agar kiritilgan bo'lsa)
      let phoneInt: number | undefined;
      if (formData.phone && formData.phone.trim()) {
        const phoneNumber = formData.phone.replace(/\D/g, '');
        if (phoneNumber.length !== 12 || !phoneNumber.startsWith('998')) {
          setErrors({ phone: 'Telefon raqam noto\'g\'ri formatda. To\'g\'ri format: 998901234567' });
          setIsSubmitting(false);
          return;
        }
        phoneInt = parseInt(phoneNumber);
        if (isNaN(phoneInt)) {
          setErrors({ phone: 'Telefon raqam noto\'g\'ri formatda' });
          setIsSubmitting(false);
          return;
        }
      }

      // Pasport validatsiyasi (agar kiritilgan bo'lsa)
      if (formData.passport && formData.passport.trim() && !validatePassportFormat(formData.passport)) {
        setErrors({ passport: 'Pasport raqami noto\'g\'ri formatda. To\'g\'ri format: AA1234567' });
        setIsSubmitting(false);
        return;
      }

      if (!selectedListing) {
        setErrors({ general: 'Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.' });
        setIsSubmitting(false);
        return;
      }

      // Viloyat va tuman ID larini topish
      const selectedProvince = provinces.find(p => p.name === formData.city);
      const selectedDistrict = districts.find(d => d.name === formData.village);

      if (!selectedProvince) {
        setErrors({ city: 'Viloyat tanlanmagan yoki noto\'g\'ri' });
        setIsSubmitting(false);
        return;
      }

      if (!selectedDistrict) {
        setErrors({ village: 'Tuman tanlanmagan yoki noto\'g\'ri' });
        setIsSubmitting(false);
        return;
      }

      // Yotoqxona ID sini to'g'ri formatga o'tkazish
      let dormitoryId: number;
      if (typeof selectedListing.id === 'string') {
        if (selectedListing.id.startsWith('dorm-')) {
          dormitoryId = parseInt(selectedListing.id.replace('dorm-', ''));
        } else {
          dormitoryId = parseInt(selectedListing.id);
        }
      } else {
        dormitoryId = selectedListing.id;
      }

      if (isNaN(dormitoryId) || dormitoryId <= 0) {
        setErrors({ general: 'Yotoqxona ID si noto\'g\'ri. Iltimos, yotoqxona sahifasiga qayting va qaytadan urinib ko\'ring.' });
        setIsSubmitting(false);
        return;
      }

      // Final validation before submission
      if (!user?.id) {
        setErrors({ general: 'Foydalanuvchi ma\'lumotlari topilmadi. Iltimos, qaytadan tizimga kiring.' });
        setIsSubmitting(false);
        return;
      }

      // API endpoint orqali ariza yuborish
      const applicationData = {
        user: user.id,
        dormitory: dormitoryId,
        name: formData.name.trim(),
        last_name: formData.familiya?.trim() || undefined,
        middle_name: formData.middle_name?.trim() || undefined,
        province: selectedProvince.id,
        district: selectedDistrict.id,  // API expects 'district' field
        faculty: formData.faculty?.trim() || undefined,
        direction: formData.direction?.trim() || undefined,
        course: formData.course.trim(),
        gender: formData.gender.trim(),
        group: formData.group?.trim() || undefined,
        phone: phoneInt ? phoneInt.toString() : undefined,  // Convert to string
        passport: formData.passport?.trim() || undefined,
        pinfl: formData.pinfl?.trim() || undefined,
        comment: formData.comment?.trim() || undefined,
        user_image: formData.user_image || undefined,
        document: formData.document || undefined,
        passport_image_first: formData.passport_image_first || undefined,
        passport_image_second: formData.passport_image_second || undefined,
      };

      // API orqali ariza yuborish
      await authAPI.submitApplication(applicationData);

      setSubmitSuccess(true);
      // Clear selected listing after successful submission
      clearGlobalSelectedListing();
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error: unknown) {
      let errorMessage = 'Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.';
      const fieldErrors: Record<string, string> = {};

      try {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: Record<string, unknown>;
          };
          message?: string;
        };

        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;

          // Agar server field-specific xatolarni qaytarsa
          if (typeof errorData === 'object' && !errorData.detail) {
            Object.keys(errorData).forEach(field => {
              const fieldError = errorData[field];
              if (Array.isArray(fieldError)) {
                fieldErrors[field] = fieldError[0];
              } else if (typeof fieldError === 'string') {
                fieldErrors[field] = fieldError;
              }
            });

            // Agar field xatolari bo'lsa, ularni ko'rsatish
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
              setIsSubmitting(false);
              return;
            }
          }

          // Umumiy xato xabari
          if (typeof errorData === 'object' && errorData !== null) {
            const dataObj = errorData as Record<string, unknown>;
            if (dataObj.detail) {
              errorMessage = String(dataObj.detail);
            } else if (dataObj.message) {
              errorMessage = String(dataObj.message);
            }
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (typeof errorData === 'object') {
            const firstError = Object.values(errorData)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = String(firstError[0]);
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
        } else if (axiosError.message) {
          if (axiosError.message.includes('timeout') || axiosError.message.includes('Network Error')) {
            errorMessage = 'Internetga ulanishni tekshiring';
          } else {
            errorMessage = axiosError.message;
          }
        }
      } catch (parseError) {
        const axiosError = error as { message?: string };
        if (axiosError.message && (axiosError.message.includes('timeout') || axiosError.message.includes('Network Error'))) {
          errorMessage = 'Internetga ulanishni tekshiring';
        } else {
          errorMessage = axiosError.message || errorMessage;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
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

  const progressPercent = Math.round(
    ((formData.gender ? 1 : 0) +
      (formData.name ? 1 : 0) +
      (formData.familiya ? 1 : 0) +
      (formData.city ? 1 : 0) +
      (formData.village ? 1 : 0) +
      (formData.course ? 1 : 0) +
      (formData.phone ? 1 : 0)) /
      7 *
      100
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dormitories')}
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Form to'ldirish jarayoni</span>
                    <span className="text-sm font-bold text-brand-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
                    <div
                      className="bg-brand-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Selected Dormitory Display */}
                {selectedListing ? (
                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-brand-600" />
                      <div>
                        <h3 className="font-semibold text-brand-900 dark:text-brand-100">
                          Ariza Yuborilayotgan Yotoqxona
                        </h3>
                        <p className="text-brand-700 dark:text-brand-300">
                          {selectedListing.title}
                        </p>
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
                        <h3 className="font-semibold text-danger-900 dark:text-danger-100">
                          Xatolik
                        </h3>
                        <p className="text-danger-700 dark:text-danger-300">
                          Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.
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
                  onCityChange={(value) => {
                    const selectedProvince = provinces.find(p => p.name === value);
                    handleInputChange('city', value);
                    setSelectedProvinceId(selectedProvince ? selectedProvince.id : null);
                    handleInputChange('village', '');
                  }}
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

                <NotesSection value={formData.comment} onChange={(value) => handleInputChange('comment', value)} />

                {/* Submit Button */}
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
