import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Users,
  Award,
  Heart,
  MapPin,
  TrendingUp,
  Shield,
  Clock,
  Phone,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import {
  ContactContent,
  loadContactContent,
  phoneToTel,
  telegramHandle,
} from '../data/contactContent';

interface Statistics {
  dormitories_count: number;
  apartments_count: number;
  users_count: number;
  applications_count: number;
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
};

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [statistics, setStatistics] = useState<Statistics>({
    dormitories_count: 0,
    apartments_count: 0,
    users_count: 0,
    applications_count: 0,
  });
  const [contact, setContact] = useState<ContactContent | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await authAPI.getStatistics();
        setStatistics(stats);
      } catch {
        /* silent */
      }
    };
    fetchStatistics();
    loadContactContent().then(setContact);
  }, []);

  const stats = [
    {
      label: 'Yotoqxonalar',
      value: `${statistics.dormitories_count}`,
      icon: Users,
      chip: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    },
    {
      label: 'Ijara xonadonlar',
      value: `${statistics.apartments_count}`,
      icon: MapPin,
      chip: 'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400',
    },
    {
      label: 'Jami turar joylar',
      value: `${statistics.dormitories_count + statistics.apartments_count}`,
      icon: Award,
      chip: 'bg-info-100 text-info-600 dark:bg-info-900/40 dark:text-info-400',
    },
    {
      label: 'Xizmat vaqti',
      value: '24/7',
      icon: Heart,
      chip: 'bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Xavfsiz va ishonchli',
      description:
        "Barcha e'lonlar tekshiriladi va tasdiqlangan yotoqxonalar bilan ishlaymiz",
    },
    {
      icon: Clock,
      title: '24/7 yordam',
      description: "Har qanday vaqtda yordam olish uchun jamoamiz tayyor",
    },
    {
      icon: TrendingUp,
      title: 'Tez va oson',
      description: "Bir necha daqiqada o'zingizga mos yashash joyini toping",
    },
    {
      icon: Users,
      title: 'Talabalar uchun',
      description: "Maxsus talabalar ehtiyojlari uchun mo'ljallangan platforma",
    },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Loyiha boshlandi',
      description: "JoyBor g'oyasi tug'ildi va dastlabki ishlanma yaratildi",
    },
    {
      year: '2025',
      title: 'Beta versiya',
      description: "Birinchi foydalanuvchilar bilan beta test o'tkazildi",
    },
    {
      year: '2025',
      title: 'Rasmiy ishga tushirish',
      description: 'Platforma rasmiy ravishda ishga tushirildi',
    },
    {
      year: '2026',
      title: 'Kengayish',
      description: "Barcha viloyatlarga xizmat ko'rsatish rejalashtirilmoqda",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      {/* Hero */}
      <section className="relative border-b border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div {...fade}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-5 border border-brand-200/60 dark:border-brand-800/50 shadow-sm">
              <Target className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">
              Biz haqimizda
            </h1>
            <p className="mt-4 text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed">
              JoyBor — Oʻzbekiston talabalarining yashash joy muammosini hal qilish
              uchun yaratilgan zamonaviy platforma. Maqsadimiz — har bir talabaga
              qulay, xavfsiz va arzon yashash joyini topishda yordam berish.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16 sm:space-y-20">
        {/* Stats */}
        <motion.div
          {...fade}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-sm text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${stat.chip} mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Mission */}
        <motion.section
          {...fade}
          className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 sm:p-10 shadow-sm"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white text-center">
            Bizning missiyamiz
          </h2>
          <p className="mt-5 text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed text-center">
            Har bir talabaning taʼlim olish jarayonida eng muhim ehtiyojlaridan biri —
            qulay yashash joyi. Biz bu muammoni hal qilish uchun ishonchli, tez va oson
            foydalaniladigan platforma yaratdik. Maqsadimiz — Oʻzbekistondagi barcha
            talabalar uchun sifatli yashash joylarini topishni osonlashtirish.
          </p>
        </motion.section>

        {/* Features */}
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Nima uchun JoyBor?
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Platformaning asosiy afzalliklari
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Bizning yoʻlimiz
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              JoyBor platformasining rivojlanish tarixi
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-800" />
            <ul className="space-y-6">
              {timeline.map((item, index) => (
                <li
                  key={`${item.year}-${item.title}`}
                  className={`relative flex flex-col sm:flex-row sm:items-start gap-4 ${
                    index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className="sm:w-1/2 pl-12 sm:pl-0 sm:px-6">
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-sm">
                      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {item.year}
                      </p>
                      <h3 className="mt-1 font-semibold text-surface-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-5 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-surface-50 dark:ring-surface-950" />
                  <div className="hidden sm:block sm:w-1/2" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact CTA — Superadmin aloqa sozlamalaridan */}
        <section className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 sm:p-10 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
            Biz bilan bogʻlaning
          </h2>
          <p className="mt-3 text-surface-600 dark:text-surface-300 max-w-xl mx-auto">
            Savollaringiz bormi? Yordam kerakmi? Murojaat qiling yoki aloqa sahifasiga
            oʻting.
          </p>

          {contact && (
            <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
              <a
                href={phoneToTel(contact.phone)}
                className="flex items-center gap-3 rounded-xl border border-surface-200 dark:border-surface-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors duration-150"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <Phone className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-surface-900 dark:text-white">
                    Telefon
                  </span>
                  <span className="text-sm text-surface-500">{contact.phone}</span>
                </span>
              </a>
              <a
                href={contact.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-surface-200 dark:border-surface-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors duration-150"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-100 dark:bg-info-900/40 text-info-600 dark:text-info-400">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-surface-900 dark:text-white">
                    Telegram
                  </span>
                  <span className="text-sm text-surface-500">{telegramHandle(contact.telegram_url)}</span>
                </span>
              </a>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              Aloqa sahifasi
              <ArrowRight className="w-4 h-4" />
            </button>
            {contact?.telegram_url && (
              <a
                href={contact.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-100 font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150"
              >
                Telegram orqali
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
