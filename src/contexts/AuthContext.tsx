import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { authAPI } from '../services/api';
import { sessionStore } from '../services/sessionStore';
import {
  getTelegramInitData,
  initTelegramWebApp,
  isInsideTelegram,
  openJoyborBot,
} from '../services/telegram';

interface JwtPayload {
  exp: number;
  user_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTelegram: boolean;
  authError: string | null;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (profileData: User) => void;
  reauthenticateWithTelegram: () => Promise<boolean>;
  openBot: (param?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  const authenticateWithInitData = useCallback(async (rawInitData: string): Promise<boolean> => {
    try {
      initTelegramWebApp();
      const tokens = await authAPI.telegramWebAppAuth(rawInitData);
      if (tokens?.access) {
        sessionStore.setTokens(tokens.access, tokens.refresh || '');
        const decoded = jwtDecode<JwtPayload>(tokens.access);
        try {
          const profileData = await authAPI.getProfile();
          setUser({ ...profileData, id: decoded.user_id });
        } catch {
          setUser({
            id: decoded.user_id,
            username: decoded.username || '',
            first_name: decoded.first_name || '',
            last_name: decoded.last_name || '',
            email: decoded.email || '',
            phone: decoded.phone || '',
          });
        }
        setIsAuthenticated(true);
        setAuthError(null);
        return true;
      }
    } catch (err: unknown) {
      console.warn('[Telegram Auth Error]:', err);
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data
          ?.detail ||
        (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data
          ?.message ||
        'Telegram orqali avtorizatsiya qilishda xatolik yuz berdi';
      setAuthError(message);
    }
    return false;
  }, []);

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    // 1. Check if running inside Telegram WebApp
    const insideTg = isInsideTelegram();
    setIsTelegram(insideTg);
    if (insideTg) {
      initTelegramWebApp();
    }

    const initData = getTelegramInitData();
    const existingToken = sessionStore.getAccess();

    // 2. If initData is present and we don't have a valid active token yet
    if (initData && (!existingToken || isTokenExpired(existingToken))) {
      const ok = await authenticateWithInitData(initData);
      if (ok) {
        setIsLoading(false);
        return;
      }
    }

    // 3. Check existing session token
    const token = sessionStore.getAccess();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 < Date.now()) {
          sessionStore.clear();
          setUser(null);
          setIsAuthenticated(false);
        } else {
          try {
            const profileData = await authAPI.getProfile();
            setUser({ ...profileData, id: decoded.user_id });
            setIsAuthenticated(true);
          } catch (error: unknown) {
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 401) {
              sessionStore.clear();
              setUser(null);
              setIsAuthenticated(false);
            } else {
              setUser({
                id: decoded.user_id,
                username: decoded.username || '',
                first_name: decoded.first_name || '',
                last_name: decoded.last_name || '',
                email: decoded.email || '',
                phone: decoded.phone || '',
              });
              setIsAuthenticated(true);
            }
          }
        }
      } catch {
        sessionStore.clear();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, [authenticateWithInitData]);

  useEffect(() => {
    sessionStore.migrateFromLocalStorage();
    initializeAuth();
  }, [initializeAuth]);

  const reauthenticateWithTelegram = async (): Promise<boolean> => {
    const initData = getTelegramInitData();
    if (!initData) {
      setAuthError("Telegram ma'lumotlari (initData) topilmadi. Iltimos bot orqali kiring.");
      return false;
    }
    setIsLoading(true);
    const ok = await authenticateWithInitData(initData);
    setIsLoading(false);
    return ok;
  };

  const login = async (access: string, refresh: string) => {
    sessionStore.setTokens(access, refresh);
    try {
      const decoded = jwtDecode<JwtPayload>(access);
      try {
        const profileData = await authAPI.getProfile();
        setUser({ ...profileData, id: decoded.user_id });
      } catch {
        setUser({
          id: decoded.user_id,
          username: decoded.username || '',
          first_name: decoded.first_name || '',
          last_name: decoded.last_name || '',
          email: decoded.email || '',
          phone: decoded.phone || '',
        });
      }
      setIsAuthenticated(true);
      setAuthError(null);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    sessionStore.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (profileData: User) => {
    setUser(profileData);
  };

  const openBot = (param?: string) => {
    openJoyborBot(param);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isTelegram,
    authError,
    login,
    logout,
    setUser,
    updateUserProfile,
    reauthenticateWithTelegram,
    openBot,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
