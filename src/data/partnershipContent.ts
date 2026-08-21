/** Hamkorlik kontenti — real API (`/superadmin/platform/`, `/stats/`, `/tariffs/`). */

import { API_BASE_URL, mediaUrl } from '../services/api';

export interface PartnershipStat {
  id: string;
  label: string;
  value: string;
}

export interface PartnershipFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PartnershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

export interface PartnershipVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string;
}

export interface PartnershipContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutBody: string;
  stats: PartnershipStat[];
  features: PartnershipFeature[];
  pricingTitle: string;
  pricingSubtitle: string;
  plans: PartnershipPlan[];
  videosTitle: string;
  videos: PartnershipVideo[];
  ctaTitle: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  updatedAt: string;
}

export function extractYoutubeId(url: string): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const re of patterns) {
    const m = u.match(re);
    if (m?.[1]) return m[1];
  }
  try {
    const parsed = new URL(u);
    const v = parsed.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function baseFeatures(): PartnershipFeature[] {
  return [
    {
      id: 'f1',
      icon: 'Building2',
      title: 'Yotoqxona va xona boshqaruvi',
      description: 'Qavat, xona, joy bandligi — real vaqtda.',
    },
    {
      id: 'f2',
      icon: 'FileText',
      title: 'Onlayn arizalar',
      description: 'Ariza, hujjatlar va bildirishnomalar.',
    },
    {
      id: 'f3',
      icon: 'Coins',
      title: 'To‘lovlar',
      description: 'Oylik to‘lovlar va hisobotlar.',
    },
    {
      id: 'f4',
      icon: 'CalendarCheck',
      title: 'Davomat',
      description: 'Qavat sardori moduli orqali nazorat.',
    },
    {
      id: 'f5',
      icon: 'Shield',
      title: 'Rollar',
      description: 'Admin, sardor, talaba.',
    },
    {
      id: 'f6',
      icon: 'Smartphone',
      title: 'Web ilova',
      description: 'Desktop va mobil uchun qulay interfeys.',
    },
  ];
}

interface PlatformBannerApi {
  id: number;
  image_url?: string;
  source_url?: string;
  is_primary?: boolean;
  sort_order?: number;
}

interface PlatformSettingsApi {
  official_name?: string;
  hero_title?: string;
  hero_subtitle?: string;
  support_url?: string;
  about?: string;
  banners?: PlatformBannerApi[];
}

export async function loadPartnershipContent(): Promise<PartnershipContent> {
  let platform: PlatformSettingsApi = {};
  let statsPayload: Record<string, unknown> = {};
  let tariffs: Array<Record<string, unknown>> = [];

  try {
    const [pRes, sRes, tRes] = await Promise.all([
      fetch(`${API_BASE_URL}/superadmin/platform/`),
      fetch(`${API_BASE_URL}/stats/`),
      fetch(`${API_BASE_URL}/tariffs/`),
    ]);
    if (pRes.ok) platform = (await pRes.json()) as PlatformSettingsApi;
    if (sRes.ok) statsPayload = (await sRes.json()) as Record<string, unknown>;
    if (tRes.ok) {
      const t = await tRes.json();
      tariffs = Array.isArray(t) ? t : t.results || [];
    }
  } catch {
    /* partial */
  }

  const dormsStat = (statsPayload.dormitories as Record<string, unknown>) || {};
  const users = (statsPayload.users as Record<string, unknown>) || {};
  const unisStat = (statsPayload.universities as Record<string, unknown>) || {};

  const banners = (platform.banners || []).slice().sort((a, b) => num(a.sort_order) - num(b.sort_order));
  const primaryBanner = banners.find((b) => b.is_primary) || banners[0];

  const activeTariffs = tariffs
    .filter((t) => t.is_active !== false)
    .sort((a, b) => num(a.sort_order) - num(b.sort_order));

  const plans: PartnershipPlan[] =
    activeTariffs.length > 0
      ? activeTariffs.map((t) => ({
          id: `tariff-${t.id}`,
          name: String(t.name || ''),
          price: t.month_price != null ? Number(t.month_price).toLocaleString('uz-UZ') : '—',
          period: t.month_price != null ? 'so‘m / oy' : '',
          description: String(t.subtitle || ''),
          features: Array.isArray(t.features) ? (t.features as string[]) : [],
          highlighted: Boolean(t.is_popular),
          ctaLabel: 'Hamkor bo‘lish',
        }))
      : [
          {
            id: 'empty',
            name: 'Hozircha tarif yo‘q',
            price: '—',
            period: '',
            description: 'Tariflar hali e’lon qilinmagan',
            features: ['Keyinroq yangilanadi'],
            highlighted: false,
            ctaLabel: 'Aloqa',
          },
        ];

  return {
    heroTitle: platform.hero_title || 'JoyBor — yotoqxona boshqaruvi',
    heroSubtitle:
      platform.hero_subtitle ||
      'Universitet, yotoqxona va talabalar uchun yagona platforma. Ma’lumotlar real API dan.',
    heroCtaLabel: 'Bog‘lanish',
    heroImageUrl: mediaUrl(primaryBanner?.image_url) || '',
    aboutTitle: 'Loyiha haqida',
    aboutBody: platform.about || 'JoyBor — yotoqxona boshqaruvi.',
    stats: [
      { id: 's1', label: 'Hamkorlar', value: String(num(dormsStat.total)) },
      { id: 's2', label: 'Foydalanuvchilar', value: String(num(users.total)) },
      { id: 's3', label: 'Universitetlar', value: String(num(unisStat.total)) },
    ],
    features: baseFeatures(),
    pricingTitle: 'Tariflar',
    pricingSubtitle: 'Yotoqxonangiz hajmiga mos tarifni tanlang',
    plans,
    videosTitle: 'Video',
    videos: [],
    ctaTitle: 'Hamkorlikka tayyormisiz?',
    ctaBody: platform.support_url
      ? 'Universitet yoki yotoqxona sifatida ulanish uchun biz bilan bog‘laning.'
      : 'Universitet yoki yotoqxona sifatida ulanish uchun aloqa sahifasiga o‘ting.',
    ctaButtonLabel: 'Aloqa sahifasi',
    ctaButtonHref: platform.support_url || '/contact',
    updatedAt: new Date().toISOString(),
  };
}
