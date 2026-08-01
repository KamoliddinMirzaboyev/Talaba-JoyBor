import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getGlobalSelectedListing, clearGlobalSelectedListing } from '../../App';
import { ApplicationFormData, District, Province } from './types';

const FIELD_ORDER = [
  'gender',
  'name',
  'familiya',
  'city',
  'village',
  'course',
  'phone',
  'passport',
  'faculty',
  'direction',
  'group',
] as const;

function validatePassportFormat(passport: string): boolean {
  return /^[A-Z]{2}\d{7}$/.test(passport);
}

export function useApplicationForm() {
  const navigate = useNavigate();
  const selectedListing = getGlobalSelectedListing();
  const { user, isAuthenticated, isLoading } = useAuth();

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
    passport_image_second: null,
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>>({});
  const registerFieldRef =
    (key: string) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
      fieldRefs.current[key] = el;
    };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const firstKey = FIELD_ORDER.find((k) => !!errors[k]);
    if (firstKey && fieldRefs.current[firstKey]) {
      const el = fieldRefs.current[firstKey]!;
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if ('focus' in el && typeof el.focus === 'function') el.focus();
        }, 150);
      } catch {
        // ignore
      }
    }
  }, [errors]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.first_name || '',
        familiya: user?.last_name || '',
        phone: user?.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provincesData] = await Promise.all([
          authAPI.getProvinces(),
          authAPI.getDormitories(),
        ]);
        setProvinces(provincesData);
      } catch {
        // silent
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) {
      setDistricts([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const data = await authAPI.getDistricts(selectedProvinceId);
        setDistricts(data);
      } catch {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedProvinceId]);

  const handlePassportChange = (value: string) => {
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formattedValue = '';
    for (let i = 0; i < cleanValue.length && i < 9; i++) {
      const char = cleanValue[i];
      if (i < 2) {
        if (/[A-Z]/.test(char)) formattedValue += char;
      } else if (/[0-9]/.test(char)) {
        formattedValue += char;
      }
    }

    setFormData((prev) => ({ ...prev, passport: formattedValue }));

    if (formattedValue.length > 0) {
      if (formattedValue.length < 2) {
        setErrors((prev) => ({ ...prev, passport: 'Avval 2 ta harf kiriting (masalan: AA)' }));
      } else if (formattedValue.length < 9) {
        const needLetters = Math.max(0, 2 - formattedValue.replace(/[0-9]/g, '').length);
        const needNumbers = Math.max(0, 7 - formattedValue.replace(/[A-Z]/g, '').length);
        if (needLetters > 0) {
          setErrors((prev) => ({ ...prev, passport: `Yana ${needLetters} ta harf kerak` }));
        } else if (needNumbers > 0) {
          setErrors((prev) => ({ ...prev, passport: `Yana ${needNumbers} ta raqam kerak` }));
        } else {
          setErrors((prev) => ({
            ...prev,
            passport: `Yana ${9 - formattedValue.length} ta belgi kerak`,
          }));
        }
      } else if (!validatePassportFormat(formattedValue)) {
        setErrors((prev) => ({
          ...prev,
          passport: 'Pasport formati: 2 ta harf + 7 ta raqam (AA1234567)',
        }));
      } else {
        setErrors((prev) => ({ ...prev, passport: '' }));
      }
    } else {
      setErrors((prev) => ({ ...prev, passport: '' }));
    }
  };

  const handlePinflChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, '').substring(0, 14);
    setFormData((prev) => ({ ...prev, pinfl: formattedValue }));
    if (formattedValue.length > 0 && formattedValue.length < 14) {
      setErrors((prev) => ({
        ...prev,
        pinfl: `JSHSHIR 14 ta raqamdan iborat bo'lishi kerak. Yana ${14 - formattedValue.length} ta raqam qoldi.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, pinfl: '' }));
    }
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (field: keyof ApplicationFormData, file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [field]: 'Fayl hajmi 5MB dan oshmasligi kerak' }));
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: 'Faqat JPG, PNG yoki PDF fayllar qabul qilinadi',
        }));
        return;
      }
      setUploadingFiles((prev) => ({ ...prev, [field]: true }));
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadingFiles((prev) => ({ ...prev, [field]: false }));
    }
    handleInputChange(field, file);
  };

  const handleCityChange = (value: string) => {
    const selectedProvince = provinces.find((p) => p.name === value);
    handleInputChange('city', value);
    setSelectedProvinceId(selectedProvince ? selectedProvince.id : null);
    handleInputChange('village', '');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedListing) {
      newErrors.general =
        "Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.";
    }
    if (!formData.gender?.trim()) newErrors.gender = 'Jins tanlanishi shart';
    if (!formData.name?.trim()) newErrors.name = 'Ism kiritilishi shart';
    if (!formData.familiya?.trim()) newErrors.familiya = 'Familiya kiritilishi shart';
    if (!formData.city?.trim()) newErrors.city = 'Viloyat tanlanishi shart';
    if (!formData.village?.trim()) newErrors.village = 'Tuman tanlanishi shart';
    if (!formData.course?.trim()) newErrors.course = 'Kurs tanlanishi shart';

    if (formData.phone) {
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length !== 12) {
        newErrors.phone = "Telefon raqam 12 ta raqamdan iborat bo'lishi kerak (998901234567)";
      } else if (!phoneNumbers.startsWith('998')) {
        newErrors.phone = 'Telefon raqam 998 bilan boshlanishi kerak';
      }
    }

    if (formData.passport) {
      if (formData.passport.length !== 9) {
        newErrors.passport =
          "Pasport raqami 9 ta belgidan iborat bo'lishi kerak (2 harf + 7 raqam)";
      } else if (!validatePassportFormat(formData.passport)) {
        newErrors.passport = "Pasport formati noto'g'ri. To'g'ri format: AA1234567";
      }
    }

    if (formData.pinfl && formData.pinfl.length !== 14) {
      newErrors.pinfl = "JSHSHIR 14 ta raqamdan iborat bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user || !user.id) {
      setErrors({
        general: "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan tizimga kiring.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let phoneInt: number | undefined;
      if (formData.phone && formData.phone.trim()) {
        const phoneNumber = formData.phone.replace(/\D/g, '');
        if (phoneNumber.length !== 12 || !phoneNumber.startsWith('998')) {
          setErrors({ phone: "Telefon raqam noto'g'ri formatda. To'g'ri format: 998901234567" });
          setIsSubmitting(false);
          return;
        }
        phoneInt = parseInt(phoneNumber, 10);
        if (Number.isNaN(phoneInt)) {
          setErrors({ phone: "Telefon raqam noto'g'ri formatda" });
          setIsSubmitting(false);
          return;
        }
      }

      if (
        formData.passport &&
        formData.passport.trim() &&
        !validatePassportFormat(formData.passport)
      ) {
        setErrors({
          passport: "Pasport raqami noto'g'ri formatda. To'g'ri format: AA1234567",
        });
        setIsSubmitting(false);
        return;
      }

      if (!selectedListing) {
        setErrors({
          general:
            "Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.",
        });
        setIsSubmitting(false);
        return;
      }

      const selectedProvince = provinces.find((p) => p.name === formData.city);
      const selectedDistrict = districts.find((d) => d.name === formData.village);

      if (!selectedProvince) {
        setErrors({ city: "Viloyat tanlanmagan yoki noto'g'ri" });
        setIsSubmitting(false);
        return;
      }
      if (!selectedDistrict) {
        setErrors({ village: "Tuman tanlanmagan yoki noto'g'ri" });
        setIsSubmitting(false);
        return;
      }

      let dormitoryId: number;
      if (typeof selectedListing.id === 'string') {
        dormitoryId = selectedListing.id.startsWith('dorm-')
          ? parseInt(selectedListing.id.replace('dorm-', ''), 10)
          : parseInt(selectedListing.id, 10);
      } else {
        dormitoryId = selectedListing.id as number;
      }

      if (Number.isNaN(dormitoryId) || dormitoryId <= 0) {
        setErrors({
          general:
            "Yotoqxona ID si noto'g'ri. Iltimos, yotoqxona sahifasiga qayting va qaytadan urinib ko'ring.",
        });
        setIsSubmitting(false);
        return;
      }

      await authAPI.submitApplication({
        user: user.id,
        dormitory: dormitoryId,
        name: formData.name.trim(),
        last_name: formData.familiya?.trim() || undefined,
        middle_name: formData.middle_name?.trim() || undefined,
        province: selectedProvince.id,
        district: selectedDistrict.id,
        faculty: formData.faculty?.trim() || undefined,
        direction: formData.direction?.trim() || undefined,
        course: formData.course.trim(),
        gender: formData.gender.trim(),
        group: formData.group?.trim() || undefined,
        phone: phoneInt ? phoneInt.toString() : undefined,
        passport: formData.passport?.trim() || undefined,
        pinfl: formData.pinfl?.trim() || undefined,
        comment: formData.comment?.trim() || undefined,
        user_image: formData.user_image || undefined,
        document: formData.document || undefined,
        passport_image_first: formData.passport_image_first || undefined,
        passport_image_second: formData.passport_image_second || undefined,
      });

      setSubmitSuccess(true);
      clearGlobalSelectedListing();
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error: unknown) {
      let errorMessage = "Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.";
      const fieldErrors: Record<string, string> = {};

      try {
        const axiosError = error as {
          response?: { status?: number; data?: Record<string, unknown> };
          message?: string;
        };

        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;

          if (typeof errorData === 'object' && !errorData.detail) {
            Object.keys(errorData).forEach((field) => {
              const fieldError = errorData[field];
              if (Array.isArray(fieldError)) {
                fieldErrors[field] = String(fieldError[0]);
              } else if (typeof fieldError === 'string') {
                fieldErrors[field] = fieldError;
              }
            });
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
              setIsSubmitting(false);
              return;
            }
          }

          if (typeof errorData === 'object' && errorData !== null) {
            if (errorData.detail) errorMessage = String(errorData.detail);
            else if (errorData.message) errorMessage = String(errorData.message);
            else {
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                errorMessage = String(firstError[0]);
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else if (axiosError.message) {
          if (
            axiosError.message.includes('timeout') ||
            axiosError.message.includes('Network Error')
          ) {
            errorMessage = 'Internetga ulanishni tekshiring';
          } else {
            errorMessage = axiosError.message;
          }
        }
      } catch {
        const axiosError = error as { message?: string };
        if (
          axiosError.message &&
          (axiosError.message.includes('timeout') || axiosError.message.includes('Network Error'))
        ) {
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

  return {
    navigate,
    selectedListing,
    user,
    isAuthenticated,
    isLoading,
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
  };
}
