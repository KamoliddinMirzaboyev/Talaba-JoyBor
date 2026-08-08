import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FileText,
  Coins,
  CalendarCheck,
  Shield,
  Smartphone,
  Users,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Headphones,
  Check,
  ArrowRight,
  Play,
  Handshake,
  type LucideIcon,
} from 'lucide-react';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import {
  loadPartnershipContent,
  PartnershipContent,
  youtubeEmbedUrl,
} from '../data/partnershipContent';

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  FileText,
  Coins,
  CalendarCheck,
  Shield,
  Smartphone,
  Users,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Headphones,
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
};

const PartnershipPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<PartnershipContent | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPartnershipContent().then(setContent);
  }, []);

  const goCta = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(href || '/contact');
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-200 dark:border-surface-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-surface-950 dark:via-surface-900 dark:to-brand-950/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-5">
              <Handshake className="w-3.5 h-3.5" />
              Hamkorlik
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-surface-900 dark:text-white tracking-tight leading-tight">
              {content.heroTitle}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-surface-600 dark:text-surface-300 leading-relaxed">
              {content.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goCta(content.ctaButtonHref)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                {content.heroCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white/80 dark:bg-surface-900 text-surface-800 dark:text-surface-100 font-medium hover:bg-white dark:hover:bg-surface-800 transition-colors duration-150"
              >
                Narxlarni koʻrish
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {content.stats.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-5 shadow-sm"
              >
                <p className="text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              {content.aboutTitle}
            </h2>
            <div className="mt-5 space-y-4 text-surface-600 dark:text-surface-300 leading-relaxed">
              {content.aboutBody.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 sm:p-8 shadow-sm">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">
              Kimlar uchun?
            </h3>
            <ul className="space-y-3">
              {[
                'Universitetlar va yotoqxona boshqarmalari',
                'Yotoqxona adminlari va xodimlar',
                'Qavat sardorlari',
                'Talabalar (ariza, toʻlov, bildirishnoma)',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-surface-700 dark:text-surface-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-400">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Imkoniyatlar
            </h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400">
              JoyBor yotoqxona hayotining barcha asosiy jarayonlarini raqamlashtiradi
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {content.features.map((f, idx) => {
              const Icon = ICON_MAP[f.icon] || Zap;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-150 bg-surface-50/50 dark:bg-surface-950/40"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
            {content.pricingTitle}
          </h2>
          <p className="mt-3 text-surface-500 dark:text-surface-400">{content.pricingSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {content.plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 shadow-sm transition-shadow duration-150 ${
                plan.highlighted
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 dark:border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-white text-xs font-semibold">
                  Eng mashhur
                </span>
              )}
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{plan.description}</p>
              <div className="mt-5 mb-6">
                <span className="text-3xl font-bold text-surface-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="ml-1.5 text-sm text-surface-500">{plan.period}</span>
                ) : null}
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex gap-2 text-sm text-surface-700 dark:text-surface-300"
                  >
                    <Check className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goCta(content.ctaButtonHref)}
                className={`w-full py-3 rounded-xl font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
                  plan.highlighted
                    ? 'bg-brand-600 hover:bg-brand-700 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-900 dark:text-white'
                }`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      {content.videos.length > 0 && (
        <section className="bg-white dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="flex items-center gap-2 mb-10">
              <Play className="w-5 h-5 text-brand-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                {content.videosTitle}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {content.videos.map((v) => {
                const embed = youtubeEmbedUrl(v.youtubeUrl);
                if (!embed) return null;
                return (
                  <div
                    key={v.id}
                    className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-sm bg-surface-50 dark:bg-surface-950"
                  >
                    <div className="aspect-video bg-surface-200 dark:bg-surface-800">
                      <iframe
                        title={v.title}
                        src={embed}
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-surface-900 dark:text-white">{v.title}</h3>
                      {v.description && (
                        <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
                          {v.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {content.gallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-10">
            {content.galleryTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.gallery.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setLightbox(img.imageUrl)}
                className="group text-left rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-100 dark:bg-surface-800">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || ''}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                {img.caption && (
                  <p className="p-3 text-sm text-surface-600 dark:text-surface-400">{img.caption}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">{content.ctaTitle}</h2>
            <p className="mt-3 text-brand-100 leading-relaxed">{content.ctaBody}</p>
            <button
              type="button"
              onClick={() => goCta(content.ctaButtonHref)}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors duration-150"
            >
              {content.ctaButtonLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <img loading="lazy"
            src={lightbox}
            alt=""
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PartnershipPage;
