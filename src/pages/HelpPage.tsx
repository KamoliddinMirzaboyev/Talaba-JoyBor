import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Video,
  FileText,
  CreditCard,
  Filter,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import EmptyState from '../components/EmptyState';
import {
  ContactContent,
  loadContactContent,
  phoneToTel,
  telegramHandle,
} from '../data/contactContent';

type CategoryId =
  | 'general'
  | 'registration'
  | 'search'
  | 'applications'
  | 'payments'
  | 'technical';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const categories: {
  id: CategoryId;
  label: string;
  icon: typeof HelpCircle;
  description: string;
}[] = [
  {
    id: 'general',
    label: 'Umumiy savollar',
    icon: HelpCircle,
    description: 'Platforma haqida asosiy maʼlumot',
  },
  {
    id: 'registration',
    label: "Ro'yxatdan o'tish",
    icon: FileText,
    description: 'Hisob va kirish',
  },
  {
    id: 'search',
    label: 'Qidiruv va filtrlar',
    icon: Filter,
    description: 'Yotoqxona topish',
  },
  {
    id: 'applications',
    label: 'Ariza yuborish',
    icon: MessageCircle,
    description: 'Ariza jarayoni',
  },
  {
    id: 'payments',
    label: "To'lovlar",
    icon: CreditCard,
    description: 'Narx va toʻlov usullari',
  },
  {
    id: 'technical',
    label: 'Texnik yordam',
    icon: Video,
    description: 'Qurilma va brauzer',
  },
];

const faqs: Record<CategoryId, FaqItem[]> = {
  general: [
    {
      id: 'what-is-joybor',
      question: 'JoyBor nima?',
      answer:
        "JoyBor — O'zbekistondagi talabalar uchun yotoqxona va ijara xonadonlarini topishga yordam beruvchi raqamli platforma. Bu yerda universitetga yaqin, qulay va arzon yashash joylarini topib, onlayn ariza yuborishingiz mumkin.",
    },
    {
      id: 'how-it-works',
      question: 'Platforma qanday ishlaydi?',
      answer:
        "Oddiy 3 bosqichda: 1) Ro'yxatdan o'ting, 2) O'zingizga mos yashash joyini qidiring, 3) Ariza yuboring. Arizangiz yotoqxona ma'muriyatiga yetkaziladi va holatini dashboardda kuzatasiz.",
    },
    {
      id: 'is-free',
      question: 'Xizmat bepulmi?',
      answer:
        "Ha, JoyBor platformasidan foydalanish talabalar uchun bepul. Siz faqat tanlagan yashash joyingiz uchun yotoqxona qoidalariga muvofiq to'lov qilasiz.",
    },
  ],
  registration: [
    {
      id: 'how-to-register',
      question: "Qanday ro'yxatdan o'tish mumkin?",
      answer:
        "Ro'yxatdan o'tish tugmasini bosing va kerakli ma'lumotlarni kiriting: ism-familiya, telefon raqam va parol. Google orqali ham tezroq ro'yxatdan o'tishingiz mumkin.",
    },
    {
      id: 'verification',
      question: 'Hisobni tasdiqlash kerakmi?',
      answer:
        "Xavfsizlik uchun telefon raqamingizni tasdiqlashingiz tavsiya etiladi. Ba'zi arizalarda talaba guvohnomasi va shaxsiy hujjatlar ham talab qilinishi mumkin.",
    },
    {
      id: 'forgot-password',
      question: 'Parolni unutsam nima qilish kerak?',
      answer:
        'Kirish sahifasida "Parolni unutdingizmi?" havolasini bosing. Telefon raqamingiz orqali parolni tiklash bo\'yicha ko\'rsatmalar yuboriladi.',
    },
  ],
  search: [
    {
      id: 'search-tips',
      question: 'Qanday qilib samarali qidiruv qilish mumkin?',
      answer:
        "Yotoqxonalar sahifasida joylashuv, narx oralig'i va qulayliklarni belgilang. Universitetga yaqin joylarni filtrlab, saqlangan elonlar ro'yxatiga qo'shib qo'ying.",
    },
    {
      id: 'save-listings',
      question: "Yoqqan e'lonlarni qanday saqlash mumkin?",
      answer:
        'Har bir kartadagi yurak belgisini bosing — e\'lon "Saqlangan" bo\'limiga tushadi va keyinroq oson topiladi.',
    },
    {
      id: 'filters',
      question: 'Qanday filtrlar mavjud?',
      answer:
        "Narx oralig'i, joylashuv, qulayliklar (Wi‑Fi, oshxona, sport zal va boshqalar) hamda bo'sh joy mavjudligi bo'yicha filtrlash mumkin.",
    },
  ],
  applications: [
    {
      id: 'how-to-apply',
      question: 'Qanday ariza yuborish mumkin?',
      answer:
        'Yoqqan yotoqxonani oching va "Ariza yuborish" tugmasini bosing. Shaxsiy ma\'lumotlar, manzil, hujjatlar va foto bo\'limlarini to\'ldiring, so\'ng yuboring.',
    },
    {
      id: 'required-documents',
      question: 'Qanday hujjatlar kerak?',
      answer:
        "Odatda shaxsiy ma'lumotlar, JSHSHIR, talaba hujjatlari va fotosurat talab qilinadi. Aniq ro'yxat ariza formasida ko'rsatiladi.",
    },
    {
      id: 'application-status',
      question: 'Ariza holatini qanday kuzatish mumkin?',
      answer:
        "Arizalar sahifasida barcha arizalaringiz: kutilmoqda, ko'rib chiqilmoqda, tasdiqlangan yoki rad etilgan holatlarini ko'rasiz. Bildirishnomalar ham keladi.",
    },
  ],
  payments: [
    {
      id: 'payment-methods',
      question: "Qanday to'lov usullari mavjud?",
      answer:
        "To'lov tartibi yotoqxona ma'muriyati bilan kelishiladi. Platformada to'lov holati va tarixini kuzatish mumkin.",
    },
    {
      id: 'deposit',
      question: "Oldindan to'lov kerakmi?",
      answer:
        "Ko'pincha birinchi oylik to'lov yoki kafolat puli talab qilinishi mumkin. Aniq shartlar yotoqxona qoidalarida yoziladi.",
    },
    {
      id: 'refund',
      question: 'Pulni qaytarish mumkinmi?',
      answer:
        "Qaytarish shartlari har bir yotoqxona uchun alohida. Batafsil ma'lumot uchun yotoqxona ma'muriyati yoki yordam xizmatiga murojaat qiling.",
    },
  ],
  technical: [
    {
      id: 'browser-support',
      question: "Qanday brauzerlar qo'llab-quvvatlanadi?",
      answer:
        "Chrome, Firefox, Safari, Edge va boshqa zamonaviy brauzerlarning so'nggi versiyalari tavsiya etiladi.",
    },
    {
      id: 'mobile-app',
      question: 'Mobil ilova bormi?',
      answer:
        "Hozircha alohida mobil ilova ishlab chiqilmoqda. Veb-sayt telefon va planshetda to'liq ishlaydi.",
    },
    {
      id: 'technical-issues',
      question: 'Texnik muammo boʻlsa nima qilish kerak?',
      answer:
        "Sahifani yangilang yoki brauzer keshini tozalang. Muammo davom etsa — Telegram bot, telefon yoki email orqali yordam xizmatiga yozing.",
    },
  ],
};

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('general');
  const [contact, setContact] = useState<ContactContent | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadContactContent().then(setContact);
  }, []);

  const supportOptions = contact
    ? [
        {
          title: 'Telegram bot',
          description: 'Tezkor yordam va savollar',
          meta: telegramHandle(contact.telegram_url),
          icon: MessageCircle,
          action: () => window.open(contact.telegram_url, '_blank'),
          chip: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
          accent: 'hover:border-brand-300 dark:hover:border-brand-700',
        },
        {
          title: "Telefon qo'ng'irog'i",
          description: contact.working_hours,
          meta: contact.phone,
          icon: Phone,
          action: () => window.open(phoneToTel(contact.phone)),
          chip: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
          accent: 'hover:border-success-300 dark:hover:border-success-700',
        },
        {
          title: 'Email',
          description: '24 soat ichida javob',
          meta: contact.email,
          icon: Mail,
          action: () => window.open(`mailto:${contact.email}`),
          chip: 'bg-info-100 text-info-700 dark:bg-info-900/40 dark:text-info-300',
          accent: 'hover:border-info-300 dark:hover:border-info-700',
        },
      ]
    : [];

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const filteredFaqs = useMemo(() => {
    if (isSearching) {
      return (Object.keys(faqs) as CategoryId[]).flatMap((cat) =>
        faqs[cat]
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(query) ||
              faq.answer.toLowerCase().includes(query)
          )
          .map((faq) => ({ ...faq, categoryId: cat }))
      );
    }
    return faqs[activeCategory].map((faq) => ({
      ...faq,
      categoryId: activeCategory,
    }));
  }, [activeCategory, isSearching, query]);

  const activeMeta = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      {/* Hero */}
      <section className="relative border-b border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-info-50 dark:from-surface-950 dark:via-surface-900 dark:to-brand-950/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-5 shadow-sm border border-brand-200/60 dark:border-brand-800/50">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">
              Yordam markazi
            </h1>
            <p className="mt-3 text-base sm:text-lg text-surface-600 dark:text-surface-300 leading-relaxed">
              JoyBor platformasidan foydalanish boʻyicha savollaringizga tezkor javob
              toping yoki jamoamiz bilan bogʻlaning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setExpandedFaq(null);
                }}
                placeholder="Savolingizni yozing… (masalan: ariza, toʻlov)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-colors duration-150"
              />
            </label>
            {isSearching && (
              <p className="mt-2 text-center text-xs text-surface-500">
                {filteredFaqs.length} ta natija barcha kategoriyalar boʻyicha
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Support cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {supportOptions.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.title}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                onClick={opt.action}
                className={`group text-left rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-sm hover:shadow-md transition-all duration-150 ${opt.accent}`}
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${opt.chip} mb-4`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">
                      {opt.title}
                    </h3>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                      {opt.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-surface-800 dark:text-surface-200">
                      {opt.meta}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors shrink-0 mt-1" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile category chips */}
        {!isSearching && (
          <div className="lg:hidden mb-6 -mx-1 overflow-x-auto pb-1">
            <div className="flex gap-2 px-1 min-w-max">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedFaq(null);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors duration-150 ${
                      active
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          {!isSearching && (
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-sm">
                <div className="flex items-center gap-2 px-2 mb-3">
                  <BookOpen className="w-4 h-4 text-surface-400" />
                  <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
                    Kategoriyalar
                  </h2>
                </div>
                <nav className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const active = activeCategory === category.id;
                    const count = faqs[category.id].length;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.id);
                          setExpandedFaq(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${
                          active
                            ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-200/80 dark:ring-brand-800'
                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/80'
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            active
                              ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
                              : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {category.label}
                          </span>
                          <span className="block text-xs text-surface-400 truncate">
                            {category.description}
                          </span>
                        </span>
                        <span
                          className={`text-xs tabular-nums px-1.5 py-0.5 rounded-full ${
                            active
                              ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300'
                              : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* FAQ */}
          <div
            className={
              isSearching ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'
            }
          >
            <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white">
                    {isSearching
                      ? 'Qidiruv natijalari'
                      : activeMeta?.label ?? 'Savollar'}
                  </h2>
                  {!isSearching && activeMeta && (
                    <p className="text-sm text-surface-500 mt-0.5">
                      {activeMeta.description}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  {filteredFaqs.length} ta savol
                </span>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Search}
                    title="Hech narsa topilmadi"
                    description="Boshqa kalit soʻz yozing yoki kategoriyani tanlang"
                  />
                </div>
              ) : (
                <ul className="divide-y divide-surface-100 dark:divide-surface-800">
                  {filteredFaqs.map((faq) => {
                    const open = expandedFaq === faq.id;
                    const catLabel = categories.find(
                      (c) => c.id === faq.categoryId
                    )?.label;
                    return (
                      <li key={`${faq.categoryId}-${faq.id}`}>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFaq(open ? null : faq.id)
                          }
                          className="w-full flex items-start gap-3 px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-surface-50/80 dark:hover:bg-surface-800/40 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40"
                          aria-expanded={open}
                        >
                          <span className="flex-1 min-w-0">
                            {isSearching && catLabel && (
                              <span className="inline-block mb-1.5 text-[11px] font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
                                {catLabel}
                              </span>
                            )}
                            <span className="block text-base font-medium text-surface-900 dark:text-white pr-2">
                              {faq.question}
                            </span>
                          </span>
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-700 transition-colors duration-150 ${
                              open
                                ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 text-brand-600'
                                : 'bg-surface-50 dark:bg-surface-800 text-surface-400'
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                open ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 sm:px-6 pb-5 pt-0">
                                <div className="rounded-xl bg-surface-50 dark:bg-surface-950/60 border border-surface-100 dark:border-surface-800 px-4 py-3.5 text-sm sm:text-[15px] leading-relaxed text-surface-600 dark:text-surface-300">
                                  {faq.answer}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Contact form */}
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Javob topmadingizmi?
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  Formani toʻldiring — jamoamiz siz bilan bogʻlanadi
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
