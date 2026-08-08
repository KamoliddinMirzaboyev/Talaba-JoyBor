import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { formatPhoneInput, normalizePhoneForApi } from '../utils/format';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const subjects = [
  'Umumiy savol',
  'Texnik yordam',
  'Ariza haqida',
  "To'lov masalalari",
  'Takliflar',
  'Shikoyat',
];

const ContactForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: keyof FormState, value: string) => {
    if (field === 'phone') {
      value = formatPhoneInput(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Ism kiritilishi shart';
    if (!formData.email.trim()) newErrors.email = 'Email manzil kiritilishi shart';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon raqam kiritilishi shart';
    if (!formData.subject) newErrors.subject = 'Mavzu tanlanishi shart';
    if (!formData.message.trim()) newErrors.message = 'Xabar matni kiritilishi shart';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email manzil noto'g'ri formatda";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const phone = normalizePhoneForApi(formData.phone);
      await authAPI.createComplaint({
        title: formData.subject,
        description: [
          `Ism: ${formData.name}`,
          `Email: ${formData.email}`,
          `Tel: ${phone}`,
          '',
          formData.message,
        ].join('\n'),
        category: formData.subject === 'Shikoyat' ? 'other' : 'other',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSuccess('Xabaringiz shikoyat/so‘rov sifatida yuborildi (`POST /complaints/`).');
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : 'Yuborib bo‘lmadi. Tizimga kirganingizni tekshiring.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-surface-900 dark:text-white mb-2">
        Xabar yuborish
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        {user
          ? 'Xabar `POST /complaints/` orqali yuboriladi'
          : 'Yuborish uchun tizimga kiring'}
      </p>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-success-50 text-success-800 text-sm">
          {success}
        </div>
      )}
      {errors.form && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Ism
          </label>
          <input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900"
          />
          {errors.name && <p className="text-xs text-danger-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900"
          />
          {errors.email && <p className="text-xs text-danger-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Telefon
          </label>
          <input
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900"
            placeholder="+998 ..."
          />
          {errors.phone && <p className="text-xs text-danger-600 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Mavzu
          </label>
          <select
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900"
          >
            <option value="">Tanlang</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-xs text-danger-600 mt-1">{errors.subject}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Xabar
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900"
          />
          {errors.message && (
            <p className="text-xs text-danger-600 mt-1">{errors.message}</p>
          )}
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Yuborilmoqda...' : user ? 'Yuborish' : 'Kirish va yuborish'}
        </motion.button>
      </form>
    </div>
  );
};

export default ContactForm;
