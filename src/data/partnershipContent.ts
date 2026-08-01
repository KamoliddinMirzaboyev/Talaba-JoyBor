/** Hamkorlik sahifasi kontenti (default). Superadmin mock bilan bir xil schema. */

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

export const STORAGE_KEY = 'joybor_partnership_content_v1';

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

export const DEFAULT_PARTNERSHIP: PartnershipContent = {
  heroTitle: 'JoyBor — yotoqxona boshqaruvining raqamli platformasi',
  heroSubtitle:
    'Universitetlar, yotoqxona maʼmuriyati va talabalar uchun yagona ekotizim. Arizalar, toʻlovlar, davomat, xonalar va hisobotlar — bitta joyda.',
  heroCtaLabel: 'Hamkorlik uchun bogʻlanish',
  aboutTitle: 'Loyiha haqida',
  aboutBody:
    'JoyBor — Oʻzbekiston oliy taʼlim muassasalari yotoqxonalarini raqamlashtirishga moʻljallangan professional platforma. Talabalar onlayn ariza topshiradi, adminlar xona va toʻlovlarni boshqaradi, qavat sardorlari davomat va vazifalarni yuritadi, superadmin esa butun tarmoqni nazorat qiladi.\n\nBizning maqsadimiz — qogʻozbozlikni kamaytirish, shaffoflikni oshirish va har bir yotoqxonaga zamonaviy boshqaruv vositalarini yetkazish.',
  stats: [
    { id: 's1', label: 'Yotoqxonalar', value: '50+' },
    { id: 's2', label: 'Talabalar', value: '10 000+' },
    { id: 's3', label: 'Universitetlar', value: '20+' },
    { id: 's4', label: 'Qoʻllab-quvvatlash', value: '24/7' },
  ],
  features: [
    {
      id: 'f1',
      icon: 'Building2',
      title: 'Yotoqxona va xona boshqaruvi',
      description:
        'Qavat, xona, joy bandligi, talabani joylashtirish / koʻchirish / chiqarish — real vaqtda.',
    },
    {
      id: 'f2',
      icon: 'FileText',
      title: 'Onlayn arizalar',
      description:
        'Talaba arizasi, hujjatlar, tasdiqlash / rad etish jarayoni va bildirishnomalar avtomatlashtirilgan.',
    },
    {
      id: 'f3',
      icon: 'Coins',
      title: 'Toʻlovlar va hisobotlar',
      description:
        'Oylik toʻlovlar, eksport, moliyaviy koʻrsatkichlar va shaffof hisobotlar.',
    },
    {
      id: 'f4',
      icon: 'CalendarCheck',
      title: 'Davomat va navbatchilik',
      description:
        'Qavat sardori moduli: davomat, vazifalar, eʼlonlar va muloqot.',
    },
    {
      id: 'f5',
      icon: 'Shield',
      title: 'Xavfsizlik va rollar',
      description:
        'Superadmin, admin, qavat sardori va talaba rollari — har kim oʻz huquqi doirasida ishlaydi.',
    },
    {
      id: 'f6',
      icon: 'Smartphone',
      title: 'Mobilga mos interfeys',
      description:
        'Zamonaviy web ilova: desktop va telefonlarda qulay, tez va tushunarli.',
    },
  ],
  pricingTitle: 'Tariflar va narxlar',
  pricingSubtitle:
    'Yotoqxona hajmi va ehtiyojingizga mos paketni tanlang. Barcha paketlarda asosiy funksiyalar mavjud.',
  plans: [
    {
      id: 'p1',
      name: 'Start',
      price: '1 500 000',
      period: 'soʻm / oy',
      description: 'Kichik yotoqxonalar uchun boshlangʻich paket',
      features: [
        '1 yotoqxona',
        '500 tagacha talaba',
        'Ariza va xona boshqaruvi',
        'Asosiy hisobotlar',
        'Email qoʻllab-quvvatlash',
      ],
      highlighted: false,
      ctaLabel: 'Tanlash',
    },
    {
      id: 'p2',
      name: 'Business',
      price: '3 500 000',
      period: 'soʻm / oy',
      description: 'Oʻrta va yirik yotoqxonalar uchun tavsiya etiladi',
      features: [
        '3 tagacha yotoqxona',
        'Cheksiz talaba',
        'Toʻlovlar + eksport',
        'Qavat sardori moduli',
        'Davomat va vazifalar',
        'Ustuvor qoʻllab-quvvatlash',
      ],
      highlighted: true,
      ctaLabel: 'Tavsiya etiladi',
    },
    {
      id: 'p3',
      name: 'Enterprise',
      price: 'Kelishuv asosida',
      period: '',
      description: 'Universitet yoki tarmoq boʻyicha maxsus yechim',
      features: [
        'Cheksiz yotoqxona',
        'Superadmin tarmoq paneli',
        'Maxsus integratsiyalar',
        'Shaxsiy menejer',
        'Onboarding va trening',
        'SLA shartnomasi',
      ],
      highlighted: false,
      ctaLabel: 'Bogʻlanish',
    },
  ],
  videosTitle: 'Video taqdimotlar',
  videos: [
    {
      id: 'v1',
      title: 'JoyBor platformasi qisqacha',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Loyiha imkoniyatlari va foydalanuvchi rollari haqida qisqa video.',
    },
  ],
  galleryTitle: 'Loyiha rasmlari',
  gallery: [
    {
      id: 'g1',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      caption: 'Talabalar kampusi',
    },
    {
      id: 'g2',
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
      caption: 'Zamonaviy yotoqxona muhiti',
    },
    {
      id: 'g3',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      caption: 'Raqamli boshqaruv',
    },
  ],
  ctaTitle: 'Hamkorlikka tayyormisiz?',
  ctaBody:
    'Universitet yoki yotoqxona maʼmuriyati sifatida JoyBor bilan ishlashni xohlasangiz — biz bilan bogʻlaning. Demo, narx va joriy etish boʻyicha batafsil maʼlumot beramiz.',
  ctaButtonLabel: 'Aloqa sahifasi',
  ctaButtonHref: '/contact',
  updatedAt: new Date().toISOString(),
};

/** public/partnership.json yoki localStorage (demo) + default */
export async function loadPartnershipContent(): Promise<PartnershipContent> {
  try {
    const res = await fetch('/partnership.json', { cache: 'no-store' });
    if (res.ok) {
      const parsed = (await res.json()) as PartnershipContent;
      return mergeWithDefault(parsed);
    }
  } catch {
    /* fallback */
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeWithDefault(JSON.parse(raw) as PartnershipContent);
  } catch {
    /* fallback */
  }
  return structuredClone(DEFAULT_PARTNERSHIP);
}

function mergeWithDefault(parsed: PartnershipContent): PartnershipContent {
  return {
    ...structuredClone(DEFAULT_PARTNERSHIP),
    ...parsed,
    stats: parsed.stats?.length ? parsed.stats : DEFAULT_PARTNERSHIP.stats,
    features: parsed.features?.length ? parsed.features : DEFAULT_PARTNERSHIP.features,
    plans: parsed.plans?.length ? parsed.plans : DEFAULT_PARTNERSHIP.plans,
    videos: Array.isArray(parsed.videos) ? parsed.videos : DEFAULT_PARTNERSHIP.videos,
    gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_PARTNERSHIP.gallery,
  };
}
