import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { authAPI } from '../services/api';
import { sessionStore } from '../services/sessionStore';

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
  login: (access: string, refresh: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (profileData: User) => void;
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

  useEffect(() => {
    // Migrate tokens from localStorage -> sessionStorage; keep only theme in localStorage
    sessionStore.migrateFromLocalStorage();

    const initializeAuth = async () => {
      const token = sessionStore.getAccess();

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          // Token muddati tugaganmi tekshirish
          if (decoded.exp * 1000 < Date.now()) {
            sessionStore.clear();
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }

          try {
            // API dan to'liq profile ma'lumotlarini yuklash
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
                // API xatosi bo'lsa ham JWT ma'lumotlari bilan davom etamiz
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
    };

    initializeAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    sessionStore.setTokens(access, refresh);


    try {
      const decoded = jwtDecode<JwtPayload>(access);
      try {
        const profileData = await authAPI.getProfile();
        setUser({ ...profileData, id: decoded.user_id });
      } catch {
        // Fallback to decoded token data
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

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
