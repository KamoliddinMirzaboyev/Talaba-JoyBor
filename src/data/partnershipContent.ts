/** Hamkorlik kontenti — real API stats/dorms/unis (localStorage mock yo‘q). */

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

export interface PartnershipImage {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface PartnershipContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  aboutTitle: string;
  aboutBody: string;
  stats: PartnershipStat[];
  features: PartnershipFeature[];
  pricingTitle: string;
  pricingSubtitle: string;
  plans: PartnershipPlan[];
  videosTitle: string;
  videos: PartnershipVideo[];
  galleryTitle: string;
  gallery: PartnershipImage[];
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
      description: 'Superadmin, admin, sardor, talaba.',
    },
    {
      id: 'f6',
      icon: 'Smartphone',
      title: 'Web ilova',
      description: 'Desktop va mobil uchun qulay interfeys.',
    },
  ];
}

export async function loadPartnershipContent(): Promise<PartnershipContent> {
  try {
    const cms = await fetch(`${API_BASE_URL}/public/partnership/`, { cache: 'no-store' });
    if (cms.ok) {
      return (await cms.json()) as PartnershipContent;
    }
  } catch {
    /* CMS yo‘q */
  }

  let statsPayload: Record<string, unknown> = {};
  let dorms: Array<Record<string, unknown>> = [];
  let unis: Array<Record<string, unknown>> = [];

  try {
    const [sRes, dRes, uRes] = await Promise.all([
      fetch(`${API_BASE_URL}/stats/`),
      fetch(`${API_BASE_URL}/dormitories/`),
      fetch(`${API_BASE_URL}/universities/`),
    ]);
    if (sRes.ok) statsPayload = (await sRes.json()) as Record<string, unknown>;
    if (dRes.ok) {
      const d = await dRes.json();
      dorms = Array.isArray(d) ? d : d.results || [];
    }
    if (uRes.ok) {
      const u = await uRes.json();
      unis = Array.isArray(u) ? u : u.results || [];
    }
  } catch {
    /* partial */
  }

  const rooms = (statsPayload.rooms as Record<string, unknown>) || {};
  const dormsStat = (statsPayload.dormitories as Record<string, unknown>) || {};
  const users = (statsPayload.users as Record<string, unknown>) || {};
  const unisStat = (statsPayload.universities as Record<string, unknown>) || {};

  const uniCount = num(unisStat.total) || unis.length;
  const dormCount = num(dormsStat.total) || dorms.length;
  const roomCount = num(rooms.total);
  const studentCount = num(users.students) || num(users.active) || num(users.total);

  const dormNames = dorms
    .map((d) => String(d.name || ''))
    .filter(Boolean)
    .join(', ');

  const gallery: PartnershipImage[] = [];
  dorms.forEach((d) => {
    const images = (d.images as Array<string | { image?: string }>) || [];
    images.forEach((img, i) => {
      const url = mediaUrl(typeof img === 'string' ? img : img?.image);
      if (url) {
        gallery.push({
          id: `g-${d.id}-${i}`,
          imageUrl: url,
          caption: String(d.name || ''),
        });
      }
    });
  });

  const plans: PartnershipPlan[] =
    dorms.length > 0
      ? dorms.slice(0, 3).map((d, i) => ({
          id: `plan-${d.id}`,
          name: String(d.name || `Yotoqxona ${i + 1}`),
          price:
            d.month_price != null
              ? Number(d.month_price).toLocaleString('uz-UZ')
              : '—',
          period: d.month_price != null ? 'so‘m / oy' : '',
          description: String(d.university_name || d.address || ''),
          features: [
            String(d.address || 'Manzil'),
            d.is_active ? 'Faol' : 'Nofaol',
            d.phone_numer ? `Tel: ${d.phone_numer}` : 'Telefon API da yo‘q',
          ],
          highlighted: i === 0,
          ctaLabel: 'Ariza topshirish',
        }))
      : [
          {
            id: 'empty',
            name: 'Hozircha tarif yo‘q',
            price: '—',
            period: '',
            description: 'API da yotoqxona topilmadi',
            features: ['Keyinroq yangilanadi'],
            highlighted: false,
            ctaLabel: 'Aloqa',
          },
        ];

  return {
    heroTitle: 'JoyBor — yotoqxona boshqaruvi',
    heroSubtitle:
      'Universitet, yotoqxona va talabalar uchun yagona platforma. Ma’lumotlar real API dan.',
    heroCtaLabel: 'Bog‘lanish',
    aboutTitle: 'Loyiha haqida',
    aboutBody: dormNames
      ? `Platformadagi yotoqxonalar: ${dormNames}.\n\nAriza, to‘lov, davomat va xona boshqaruvi bitta tizimda.`
      : 'JoyBor — yotoqxona boshqaruvi. Hozircha ochiq yotoqxona ro‘yxati bo‘sh yoki yuklanmadi.',
    stats: [
      { id: 's1', label: 'Yotoqxonalar', value: String(dormCount) },
      { id: 's2', label: 'Talabalar', value: String(studentCount) },
      { id: 's3', label: 'Universitetlar', value: String(uniCount) },
      { id: 's4', label: 'Xonalar', value: String(roomCount) },
    ],
    features: baseFeatures(),
    pricingTitle: 'Yotoqxonalar',
    pricingSubtitle: 'API dagi joriy yotoqxonalar va oylik narxlar',
    plans,
    videosTitle: 'Video',
    videos: [],
    galleryTitle: 'Yotoqxona rasmlari',
    gallery: gallery.slice(0, 12),
    ctaTitle: 'Hamkorlikka tayyormisiz?',
    ctaBody: 'Universitet yoki yotoqxona sifatida ulanish uchun aloqa sahifasiga o‘ting.',
    ctaButtonLabel: 'Aloqa sahifasi',
    ctaButtonHref: '/contact',
    updatedAt: new Date().toISOString(),
  };
}
