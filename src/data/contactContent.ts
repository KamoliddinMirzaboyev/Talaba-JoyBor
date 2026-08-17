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

function defaultContact(): ContactContent {
  return {
    phone: '+998 71 200 44 22',
    email: 'support@joybor.uz',
    telegramBot: '@JoyBorSupportBot',
    telegramUrl: 'https://t.me/JoyBorSupportBot',
    address: 'Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko‘chasi, 108-uy',
    workHours: 'Dushanba — Shanba, 09:00 — 18:00',
    emergencyPhone: '+998 71 200 44 22',
    emergencyNote: 'Shoshilinch murojaatlar va yordam uchun tunu-kun ishonch telefoni',
    mapLat: 41.3385,
    mapLng: 69.2845,
    mapLabel: 'JoyBor Bosh ofisi — Toshkent shahri',
    instagramUrl: 'https://instagram.com/joybor_uz',
    facebookUrl: 'https://facebook.com/joyboruz',
    heroTitle: "Biz bilan bog'laning",
    heroSubtitle: "Savollaringiz, takliflaringiz yoki arizalaringiz bo'yicha JoyBor qo'llab-quvvatlash jamoasi bilan bog'laning.",
    updatedAt: new Date().toISOString(),
  };
}

/** Avval public CMS (agar backend qo‘shsa), bo‘lmasa to‘liq standart ma’lumotlar. */
export async function loadContactContent(): Promise<ContactContent> {
  const base = defaultContact();

  try {
    const cms = await fetch(`${API_BASE_URL}/public/contact/`, { cache: 'no-store' });
    if (cms.ok) {
      const data = (await cms.json()) as Partial<ContactContent>;
      return { 
        ...base, 
        ...data, 
        phone: data.phone || base.phone,
        email: data.email || base.email,
        telegramBot: data.telegramBot || base.telegramBot,
        telegramUrl: data.telegramUrl || base.telegramUrl,
        address: data.address || base.address,
        workHours: data.workHours || base.workHours,
        heroTitle: data.heroTitle || base.heroTitle,
        heroSubtitle: data.heroSubtitle || base.heroSubtitle,
        updatedAt: data.updatedAt || new Date().toISOString() 
      };
    }
  } catch {
    /* CMS yo‘q — davom */
  }

  return base;
}
