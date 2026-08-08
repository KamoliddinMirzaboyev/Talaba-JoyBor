/** Aloqa — real yotoqxonalar API dan (CMS localStorage olib tashlandi). */

import { API_BASE_URL } from '../services/api';

export interface ContactContent {
  phone: string;
  email: string;
  telegramBot: string;
  telegramUrl: string;
  address: string;
  workHours: string;
  emergencyPhone: string;
  emergencyNote: string;
  mapLat: number;
  mapLng: number;
  mapLabel: string;
  instagramUrl: string;
  facebookUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedAt: string;
}

export function phoneToTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return `tel:${digits}`;
  if (digits.startsWith('998')) return `tel:+${digits}`;
  return `tel:+${digits}`;
}

function emptyContact(): ContactContent {
  return {
    phone: '',
    email: '',
    telegramBot: '',
    telegramUrl: '',
    address: '',
    workHours: '',
    emergencyPhone: '',
    emergencyNote: '',
    mapLat: 41.3111,
    mapLng: 69.2797,
    mapLabel: '',
    instagramUrl: '',
    facebookUrl: '',
    heroTitle: "Biz bilan bog'laning",
    heroSubtitle: 'Yotoqxona ma’lumotlari API dan yuklanadi',
    updatedAt: new Date().toISOString(),
  };
}

/** Avval public CMS (agar backend qo‘shsa), so‘ng dormitories list. */
export async function loadContactContent(): Promise<ContactContent> {
  const base = emptyContact();

  try {
    const cms = await fetch(`${API_BASE_URL}/public/contact/`, { cache: 'no-store' });
    if (cms.ok) {
      const data = (await cms.json()) as Partial<ContactContent>;
      return { ...base, ...data, updatedAt: data.updatedAt || new Date().toISOString() };
    }
  } catch {
    /* CMS yo‘q — davom */
  }

  try {
    const res = await fetch(`${API_BASE_URL}/dormitories/`, { cache: 'no-store' });
    if (!res.ok) return base;
    const payload = (await res.json()) as {
      results?: Array<Record<string, unknown>>;
    } | Array<Record<string, unknown>>;
    const list = Array.isArray(payload) ? payload : payload.results || [];
    const active = list.find((d) => d.is_active !== false) || list[0];
    if (!active) return base;

    const phone = String(active.phone_numer || active.phone || '');
    const address = String(active.address || '');
    const lat = Number(active.latitude);
    const lng = Number(active.longitude);

    return {
      ...base,
      phone,
      emergencyPhone: phone,
      address,
      mapLabel: address,
      mapLat: Number.isFinite(lat) ? lat : base.mapLat,
      mapLng: Number.isFinite(lng) ? lng : base.mapLng,
      heroTitle: String(active.name || base.heroTitle),
      heroSubtitle: String(active.description || active.university_name || base.heroSubtitle),
      telegramUrl: String(active.link || ''),
      telegramBot: active.link ? String(active.link).replace(/^https?:\/\/t\.me\//, '@') : '',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return base;
  }
}
