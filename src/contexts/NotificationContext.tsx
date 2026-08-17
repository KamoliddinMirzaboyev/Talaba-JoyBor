import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await authAPI.getUnreadCount();
      if (typeof data === 'number') {
        setUnreadCount(data);
        return;
      }
      const count = data.count ?? data.unread;
      if (typeof count === 'number') {
        setUnreadCount(count);
        return;
      }
      const notifications = await authAPI.getNotifications();
      setUnreadCount(
        notifications.filter((n) => {
          const row = n as { read?: boolean; is_read?: boolean };
          return !row.read && !row.is_read;
        }).length
      );
    } catch {
      // keep previous count
    }
  }, [isAuthenticated, user]);

  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();

    const tick = () => {
      if (document.visibilityState === 'visible') fetchUnreadCount();
    };
    const interval = setInterval(tick, 60000);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [fetchUnreadCount]);

  const value = {
    unreadCount,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};