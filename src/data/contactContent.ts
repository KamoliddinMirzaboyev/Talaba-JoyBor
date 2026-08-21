/** Aloqa — real /superadmin/contact/ dan (GET ochiq). Mock/localStorage yo'q. */

import { API_BASE_URL } from '../services/api';

export interface ContactContent {
  phone: string;
  phone_extra: string;
  email: string;
  working_hours: string;
  address: string;
  telegram_url: string;
  instagram_url: string;
  youtube_url: string;
  website_url: string;
  updated_at: string;
}

export function phoneToTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return `tel:${digits}`;
  return `tel:+${digits}`;
}

/** t.me/JoyBorobot -> @JoyBorobot (havolani ko'rsatish uchun) */
export function telegramHandle(url: string): string {
  const m = url.match(/t\.me\/([^/?#]+)/i);
  return m ? `@${m[1]}` : url;
}

export async function loadContactContent(): Promise<ContactContent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/superadmin/contact/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as ContactContent;
  } catch {
    return null;
  }
}
