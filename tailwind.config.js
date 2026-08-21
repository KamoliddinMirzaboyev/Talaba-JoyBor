import colors from 'tailwindcss/colors';

// Yagona brend — havorang/ko'k (Admin-JoyBor bilan bir xil)
const brand = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand,
        // Eski nomlar — mavjud kodni buzmaslik uchun brend rangga ko'rsatiladi
        primary: brand,
        secondary: brand,
        // Semantic tokenlar — yangi/migratsiya qilingan kodda FAQAT shular ishlatiladi
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        info: colors.sky,
        surface: colors.slate,
      },
    },
  },
  plugins: [],
};
