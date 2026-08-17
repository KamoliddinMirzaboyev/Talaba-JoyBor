import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AxiosError } from 'axios';
import { authAPI } from '../services/api';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { theme } = useTheme();

  // Register sahifasidan kelgan xabar
  const registerMessage = (location.state as { message?: string })?.message;
  const registeredUsername = (location.state as { username?: string })?.username;

  const [formData, setFormData] = useState({
    username: registeredUsername || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage] = useState(registerMessage || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Foydalanuvchi nomi kiritilishi shart';
    if (!formData.password) newErrors.password = 'Parol kiritilishi shart';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      await login(data.access, data.refresh);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      if (axiosError.response?.data?.detail) {
        setGeneralError(axiosError.response.data.detail);
      } else {
        setGeneralError('Kirishda xatolik yuz berdi. Server ishlamayotgan bo\'lishi mumkin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-surface-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
          >
            <LogIn className="w-8 h-8 text-white dark:text-surface-900" />
          </motion.div>

          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Xush Kelibsiz!
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Hisobingizga kiring va yashash joyingizni toping
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-8 border border-surface-200 dark:border-surface-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl text-success-600 dark:text-success-400 text-sm"
              >
                {successMessage}
              </motion.div>
            )}

            {/* General Error */}
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl text-danger-600 dark:text-danger-400 text-sm"
              >
                {generalError}
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Foydalanuvchi Nomi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                    theme === 'dark'
                      ? 'bg-surface-900 border-surface-700 text-white'
                      : 'bg-surface-50 border-surface-200 text-surface-900'
                  } ${errors.username ? 'border-danger-500' : ''}`}
                  placeholder="foydalanuvchi_nomi"
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-danger-500 text-xs mt-1 font-medium"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                    theme === 'dark'
                      ? 'bg-surface-900 border-surface-700 text-white'
                      : 'bg-surface-50 border-surface-200 text-surface-900'
                  } ${errors.password ? 'border-danger-500' : ''}`}
                  placeholder="Parolingizni kiriting"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors duration-150"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-danger-500 text-xs mt-1 font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() =>
                  setErrors((prev) => ({
                    ...prev,
                    password:
                      "Parolni tiklash API da yo'q. Telegram bot yoki admin orqali tiklang.",
                  }))
                }
                className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white text-sm font-medium transition-colors duration-150"
              >
                Parolni unutdingizmi?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 py-3.5 rounded-xl font-bold hover:bg-surface-800 dark:hover:bg-surface-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Kirish
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200 dark:border-surface-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                <span className="px-4 bg-white dark:bg-surface-900 text-surface-400">Yoki</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton text="Google orqali kirish" />
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-surface-600 dark:text-surface-300">
              Hisobingiz yo'qmi?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150"
              >
                Ro'yhatdan o'ting
              </button>
            </p>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
};

export default LoginPage;
