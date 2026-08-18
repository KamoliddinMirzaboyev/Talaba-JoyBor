export const JOYBOR_BOT_USERNAME = 'JoyBorobot';
export const JOYBOR_BOT_URL = 'https://t.me/JoyBorobot';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
    start_param?: string;
  };
  version?: string;
  platform?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  headerColor?: string;
  backgroundColor?: string;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  showAlert?: (message: string, callback?: () => void) => void;
  showConfirm?: (message: string, callback?: (ok: boolean) => void) => void;
  enableClosingConfirmation?: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Telegram WebApp ob'ektini olish
 */
export function getTelegramWebApp(): TelegramWebApp | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.Telegram?.WebApp;
}

/**
 * Telegram initData ni xavfsiz olish (WebApp, hash yoki query parametrlardan)
 */
export function getTelegramInitData(): string {
  if (typeof window === 'undefined') return '';

  // 1. window.Telegram.WebApp.initData
  const tgWebApp = getTelegramWebApp();
  if (tgWebApp?.initData && tgWebApp.initData.trim().length > 0) {
    return tgWebApp.initData;
  }

  // 2. Hash parametrlari (Telegram Web da URL hash da #tgWebAppData=... kelishi mumkin)
  if (window.location.hash) {
    try {
      const hashStr = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hashStr);
      const tgWebAppData = hashParams.get('tgWebAppData');
      if (tgWebAppData) {
        return tgWebAppData;
      }
    } catch {
      // ignore
    }
  }

  // 3. Query parametrlari (?tgWebAppInitData=... yoki ?initData=...)
  if (window.location.search) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryInitData = searchParams.get('tgWebAppInitData') || searchParams.get('initData');
      if (queryInitData) {
        return queryInitData;
      }
    } catch {
      // ignore
    }
  }

  return '';
}

/**
 * Foydalanuvchi Telegram Mini App ichidami yoki oddiy brauzerdami
 */
export function isInsideTelegram(): boolean {
  const initData = getTelegramInitData();
  if (initData && initData.length > 0) return true;

  const tgWebApp = getTelegramWebApp();
  if (tgWebApp && tgWebApp.platform && tgWebApp.platform !== 'unknown') {
    return true;
  }

  return false;
}

/**
 * Telegram WebApp ni tayyorlash (ready, expand)
 */
export function initTelegramWebApp(): void {
  const tgWebApp = getTelegramWebApp();
  if (!tgWebApp) return;

  try {
    tgWebApp.ready?.();
    tgWebApp.expand?.();
  } catch (err) {
    console.warn('[Telegram WebApp] Init warning:', err);
  }
}

/**
 * JoyBor Telegram botiga yo'naltirish
 */
export function openJoyborBot(startParam?: string): void {
  const tgWebApp = getTelegramWebApp();
  const botUrl = startParam
    ? `${JOYBOR_BOT_URL}?start=${encodeURIComponent(startParam)}`
    : JOYBOR_BOT_URL;

  if (tgWebApp?.openTelegramLink) {
    try {
      tgWebApp.openTelegramLink(botUrl);
      return;
    } catch {
      // Fallback below
    }
  }

  if (typeof window !== 'undefined') {
    window.location.href = botUrl;
  }
}
