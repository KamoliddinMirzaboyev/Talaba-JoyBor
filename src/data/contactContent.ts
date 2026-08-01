/** Aloqa / bot / social — Superadmin mock bilan bir xil schema. */

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

export const STORAGE_KEY = 'joybor_contact_content_v1';

export const DEFAULT_CONTACT: ContactContent = {
  phone: '+998 88 956 38 48',
  email: 'support@joybor.uz',
  telegramBot: '@Joyboronlinebot',
  telegramUrl: 'https://t.me/Joyboronlinebot',
  address: "Toshkent sh., O'zbekiston",
  workHours: '09:00 – 20:00 (onlayn 24/7)',
  emergencyPhone: '+998 88 956 38 48',
  emergencyNote: 'Shoshilinch holatlar uchun 24/7',
  mapLat: 41.2778,
  mapLng: 69.2028,
  mapLabel: "Toshkent sh., Chilonzor t., Bunyodkor ko'chasi, 12-uy",
  instagramUrl: 'https://instagram.com/joybor',
  facebookUrl: 'https://facebook.com/joybor',
  heroTitle: "Biz bilan bog'laning",
  heroSubtitle: 'Savollaringiz bormi? Yordam kerakmi? Biz sizga yordam berishga tayyormiz!',
  updatedAt: new Date().toISOString(),
};

export function phoneToTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return `tel:${digits}`;
  if (digits.startsWith('998')) return `tel:+${digits}`;
  return `tel:+${digits}`;
}

export async function loadContactContent(): Promise<ContactContent> {
  try {
    const res = await fetch('/contact.json', { cache: 'no-store' });
    if (res.ok) {
      return { ...structuredClone(DEFAULT_CONTACT), ...(await res.json()) };
    }
  } catch {
    /* fallback */
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...structuredClone(DEFAULT_CONTACT), ...JSON.parse(raw) };
  } catch {
    /* fallback */
  }
  return structuredClone(DEFAULT_CONTACT);
}
