import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Mail,
} from 'lucide-react';
import Header from '../components/Header';
import DormitoryMap from '../components/DormitoryMap';
import ContactForm from '../components/ContactForm';
import Skeleton from '../components/Skeleton';
import {
  ContactContent,
  loadContactContent,
  phoneToTel,
} from '../data/contactContent';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [c, setC] = useState<ContactContent | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadContactContent().then(setC);
  }, []);

  if (!c) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="grid md:grid-cols-4 gap-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const infoCards = [
    {
      icon: Phone,
      title: 'Telefon',
      detail: c.phone,
      href: phoneToTel(c.phone),
      chip: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
    },
    {
      icon: MessageCircle,
      title: 'Telegram bot',
      detail: c.telegramBot,
      href: c.telegramUrl,
      chip: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    },
    {
      icon: MapPin,
      title: 'Manzil',
      detail: c.address,
      href: undefined,
      chip: 'bg-info-100 text-info-700 dark:bg-info-900/40 dark:text-info-300',
    },
    {
      icon: Clock,
      title: 'Ish vaqti',
      detail: c.workHours,
      href: undefined,
      chip: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
    },
  ];

  const socialLinks = [
    {
      icon: MessageCircle,
      label: 'Telegram',
      url: c.telegramUrl,
      show: !!c.telegramUrl,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      url: c.instagramUrl,
      show: !!c.instagramUrl,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      url: c.facebookUrl,
      show: !!c.facebookUrl,
    },
    {
      icon: Mail,
      label: 'Email',
      url: c.email ? `mailto:${c.email}` : '',
      show: !!c.email,
    },
  ].filter((s) => s.show);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      <section className="border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-5 border border-brand-200/60 dark:border-brand-800/50 shadow-sm">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">
            {c.heroTitle}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            {c.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {infoCards.map((info) => {
            const Icon = info.icon;
            const inner = (
              <>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${info.chip}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-1">
                  {info.title}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  {info.detail}
                </p>
              </>
            );
            const cls =
              'block rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-sm hover:shadow-md transition-shadow duration-150 text-left';
            return info.href ? (
              <a
                key={info.title}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <div key={info.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />

          <div className="space-y-6">
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                Tez-tez soʻraladigan savollar
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                Ehtimol, savolingizga javob allaqachon mavjud.
              </p>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors duration-150"
              >
                FAQ boʻlimiga oʻtish
              </button>
            </div>

            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  Ijtimoiy tarmoqlar
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                  Yangiliklar uchun bizni kuzating.
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-surface-200 dark:border-surface-700 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150"
                      title={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {c.emergencyPhone && (
              <div className="rounded-2xl border border-danger-200 dark:border-danger-900/50 bg-danger-50 dark:bg-danger-950/30 p-6">
                <h3 className="text-lg font-semibold text-danger-800 dark:text-danger-200 mb-2">
                  Shoshilinch yordam
                </h3>
                <p className="text-sm text-danger-700/80 dark:text-danger-300/80 mb-3">
                  {c.emergencyNote}
                </p>
                <a
                  href={phoneToTel(c.emergencyPhone)}
                  className="inline-flex items-center gap-2 text-lg font-semibold text-danger-700 dark:text-danger-300"
                >
                  <Phone className="w-5 h-5" />
                  {c.emergencyPhone}
                </a>
              </div>
            )}

            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Joylashuv
              </h3>
              <div className="rounded-xl overflow-hidden">
                <DormitoryMap
                  height="240px"
                  dormitories={[
                    {
                      id: 'office',
                      name: c.mapLabel || 'JoyBor',
                      address: c.mapLabel || c.address,
                      price: '',
                      phone: c.phone,
                      latitude: c.mapLat,
                      longitude: c.mapLng,
                    },
                  ]}
                  center={[c.mapLat, c.mapLng]}
                  zoom={15}
                />
              </div>
              <p className="text-surface-600 dark:text-surface-300 mt-3 text-sm">
                {c.mapLabel || c.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
