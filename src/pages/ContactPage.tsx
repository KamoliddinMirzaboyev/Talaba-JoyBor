import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Mail,
  ShieldCheck,
  Headphones,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  Instagram,
  Facebook,
  Send,
  ChevronDown,
  ArrowRight,
  Building2,
  CheckCircle2,
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

const quickFaqs = [
  {
    q: "Yotoqxonaga ariza qanday topshiriladi?",
    a: "Platformada ro'yxatdan o'tib, o'zingizga mos yotoqxonani tanlang va «Ariza topshirish» tugmasini bosing. Kerakli hujjatlarni yuklab yuborsangiz, arizangiz avtomatik qabul qilinadi.",
  },
  {
    q: "To'lovlar qanday amalga oshiriladi?",
    a: "Arizangiz tasdiqlangandan so'ng, shaxsiy kabinetingiz orqali Click, Payme yoki bank kartasi orqali to'lovni xavfsiz amalga oshirishingiz mumkin.",
  },
  {
    q: "Arizam holatini qayerdan bilsam bo'ladi?",
    a: "Barcha topshirilgan arizalaringiz va ularning joriy holatini (Kutilmoqda, Tasdiqlandi, Rad etildi) «Mening arizalarim» bo'limida real vaqt rejimida kuzatib borishingiz mumkin.",
  },
];

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [c, setC] = useState<ContactContent | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadContactContent().then(setC);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!c) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] rounded-3xl" />
            <Skeleton className="h-[500px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const primaryCards = [
    {
      icon: Phone,
      title: 'Call-markaz',
      value: c.phone || '+998 71 200 44 22',
      subtext: 'Bepul qo‘ng‘iroq va maslahat',
      actionLabel: 'Qo‘ng‘iroq qilish',
      href: phoneToTel(c.phone || '+998712004422'),
      badge: 'Faol',
      chipStyle: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
      iconBg: 'bg-brand-600 text-white',
    },
    {
      icon: Send,
      title: 'Telegram Bot',
      value: c.telegramBot || '@JoyBorSupportBot',
      subtext: '24/7 onlayn qo‘llab-quvvatlash',
      actionLabel: 'Telegramda yozish',
      href: c.telegramUrl || 'https://t.me/JoyBorSupportBot',
      badge: '24/7 Onlayn',
      chipStyle: 'bg-info-500/10 text-info-600 dark:text-info-400 border-info-500/20',
      iconBg: 'bg-info-600 text-white',
    },
    {
      icon: Mail,
      title: 'Email manzil',
      value: c.email || 'support@joybor.uz',
      subtext: 'Rasmiy murojaat va hamkorlik',
      actionLabel: 'Xat yuborish',
      href: `mailto:${c.email || 'support@joybor.uz'}`,
      badge: 'Rasmiy',
      chipStyle: 'bg-success-500/10 text-success-600 dark:text-success-400 border-success-500/20',
      iconBg: 'bg-success-600 text-white',
    },
    {
      icon: Clock,
      title: 'Ish tartibi',
      value: c.workHours || 'Du — Sha: 09:00 — 18:00',
      subtext: 'Yakshanba — onlayn navbatchi',
      actionLabel: 'Joylashuvni ko‘rish',
      href: '#office-map',
      badge: 'Ish vaqti',
      chipStyle: 'bg-warning-500/10 text-warning-600 dark:text-warning-400 border-warning-500/20',
      iconBg: 'bg-warning-600 text-white',
    },
  ];

  const socials = [
    {
      name: 'Telegram Kanal',
      handle: '@JoyBorUz',
      url: 'https://t.me/JoyBorUz',
      icon: MessageCircle,
      desc: 'Yangiliklar va bo‘sh joylar',
    },
    {
      name: 'Instagram',
      handle: '@joybor_uz',
      url: c.instagramUrl || 'https://instagram.com/joybor_uz',
      icon: Instagram,
      desc: 'Foto va video sharhlar',
    },
    {
      name: 'Facebook',
      handle: 'JoyBor Rasmiy',
      url: c.facebookUrl || 'https://facebook.com/joyboruz',
      icon: Facebook,
      desc: 'Hamjamiyat va e’lonlar',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-400/20 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-5 shadow-sm"
          >
            <Headphones className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Aloqa va Yordam Markazi</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight"
          >
            Biz bilan bog‘laning
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed"
          >
            JoyBor platformasi, yotoqxonalarga ariza topshirish yoki hamkorlik bo‘yicha savollaringiz bormi? Mutaxassislarimiz sizga yordam berishga doim tayyor.
          </motion.p>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-surface-600 dark:text-surface-400"
          >
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>O‘rtacha javob: <strong>5-15 daqiqa</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-success-600" />
              <span>100% Xavfsiz & Rasmiy</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 px-3.5 py-1.5 rounded-full">
              <Building2 className="w-4 h-4 text-info-600" />
              <span>Barcha OTM yotoqxonalari</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Top 4 Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {primaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.chipStyle}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-white text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1 break-all">
                    {card.value}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    {card.subtext}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                  <a
                    href={card.href}
                    target={card.href.startsWith('http') ? '_blank' : undefined}
                    rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 group-hover:underline"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(card.value, card.title)}
                    className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
                    title="Nusxalash"
                  >
                    {copiedText === card.title ? (
                      <Check className="w-3.5 h-3.5 text-success-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Form and Right Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Trust */}
          <div className="lg:col-span-7 space-y-6">
            <ContactForm />

            {/* Trust and Safety Banner */}
            <div className="bg-gradient-to-br from-surface-900 to-surface-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center flex-shrink-0 text-brand-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Talabalar huquqi va ishonchli nazorat
                  </h3>
                  <p className="text-xs sm:text-sm text-surface-300 mt-1 leading-relaxed">
                    JoyBor platformasiga kelib tushgan har bir murojaat maxsus nazorat ostida ko‘rib chiqiladi. Shaxsiy ma’lumotlaringiz to‘liq himoyalangan.
                  </p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-2 text-xs text-surface-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
                      <span>100% Rasmiy tekshirilgan OTMlar</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
                      <span>Maxfiy va xavfsiz ma'lumotlar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Office Location, FAQ Accordion, Socials, Hotline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Office & Map Card */}
            <div id="office-map" className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-surface-900 dark:text-white text-base">
                    Bosh ofis va joylashuv
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(c.address, 'address')}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  {copiedText === 'address' ? <Check className="w-3 h-3 text-success-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedText === 'address' ? 'Nusxalandi' : 'Nusxalash'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
                {c.address}
              </p>

              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-inner">
                <DormitoryMap
                  height="220px"
                  dormitories={[
                    {
                      id: 'joybor-hq',
                      name: c.mapLabel || 'JoyBor Bosh Ofisi',
                      address: c.address,
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

              <div className="mt-3 flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                <span>Mo'ljal: Amir Temur shoh ko‘chasi</span>
                <a
                  href={`https://maps.google.com/?q=${c.mapLat},${c.mapLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Interactive Mini FAQ */}
            <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-info-100 dark:bg-info-900/40 text-info-600 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-surface-900 dark:text-white text-base">
                    Tez-tez so‘raladigan savollar
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {quickFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden bg-surface-50/50 dark:bg-surface-800/40 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-surface-900 dark:text-white"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-surface-400 transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180 text-brand-600' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3.5 pb-3.5 text-xs text-surface-600 dark:text-surface-300 leading-relaxed border-t border-surface-200/60 dark:border-surface-700/60 pt-2.5"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => navigate('/help')}
                className="w-full mt-4 py-2.5 px-4 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/60 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Barcha savol-javoblar (FAQ)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Social Channels */}
            <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm">
              <h3 className="font-bold text-surface-900 dark:text-white text-base mb-1">
                Biz ijtimoiy tarmoqlarda
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">
                Eng so‘nggi yotoqxona o‘rinlari va yangiliklardan xabardor bo‘ling.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl border border-surface-200 dark:border-surface-800 hover:border-brand-500 dark:hover:border-brand-600 bg-surface-50/40 dark:bg-surface-800/40 hover:bg-white dark:hover:bg-surface-800 flex items-center justify-between transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-surface-900 dark:text-white">
                            {s.name}
                          </p>
                          <p className="text-[11px] text-surface-500 dark:text-surface-400">
                            {s.handle} • {s.desc}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-surface-400 group-hover:text-brand-600 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Emergency Hotline */}
            {c.emergencyPhone && (
              <div className="rounded-3xl border border-danger-200 dark:border-danger-900/50 bg-danger-50/80 dark:bg-danger-950/30 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-danger-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-danger-800 dark:text-danger-200">
                      Shoshilinch ishonch telefoni
                    </h4>
                    <p className="text-xs text-danger-700/80 dark:text-danger-400">
                      {c.emergencyNote || '24/7 navbatchi operator'}
                    </p>
                  </div>
                </div>
                <a
                  href={phoneToTel(c.emergencyPhone)}
                  className="px-3.5 py-2 rounded-xl bg-danger-600 hover:bg-danger-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
                >
                  Qo‘ng‘iroq
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
