import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Search, Calendar, MessageCircle, Info, RefreshCw } from 'lucide-react';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { authAPI } from '../services/api';
import { formatTime } from "../utils/format";

// Backend xom (raw) bildirishnoma javobi - maydon nomlari kelishmasligi mumkin
interface RawApiNotification {
  id: number;
  title?: string;
  message?: string;
  text?: string;
  content?: string;
  type?: string;
  created_at?: string;
  timestamp?: string;
  read?: boolean;
  is_read?: boolean;
  action_url?: string;
  url?: string;
  image?: string | null;
  priority?: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshUnreadCount } = useNotifications();
  const navigate = useNavigate();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'message' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  // Load notifications from API
  const loadNotifications = async (pageNum: number = 1, append: boolean = false) => {
    if (!user) return;

    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const apiNotifications = await authAPI.getNotifications();
      
      // Transform API data to our Notification type if needed
      const transformed: Notification[] = (apiNotifications as unknown as RawApiNotification[]).map((n) => ({
        id: n.id,
        title: n.title || 'Bildirishnoma',
        message: n.message || n.text || n.content || '',
        type: (n.type || 'system') as Notification['type'],
        timestamp: n.created_at || n.timestamp || new Date().toISOString(),
        read: n.read || n.is_read || false,
        actionUrl: n.action_url || n.url || '',
        image: n.image || undefined,
        priority: (n.priority || 'medium') as Notification['priority']
      }));

      if (append) {
        setNotifications(prev => [...prev, ...transformed]);
      } else {
        setNotifications(transformed);
      }

      // API typically handles pagination, but for now we'll assume it returns all or handle it simply
      setHasMore(false); // Update this if API supports pagination
      
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    } catch (error) {
      // Handle error silently
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadNotifications(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage, true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
            Tizimga kiring
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors duration-150"
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  const filteredNotifications = notifications.filter(notification => {
    const title = (notification.title || '').toLowerCase();
    const message = (notification.message || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch = title.includes(query) || message.includes(query);
    const notifType = (notification.type || 'system') as 'application' | 'message' | 'system' | 'reminder';
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      notifType === filter;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Calendar className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'system':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-success-600 bg-success-100 dark:bg-success-900/30 dark:text-success-400';
      case 'message':
        return 'text-brand-600 bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400';
      case 'system':
        return 'text-brand-600 bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400';
      case 'reminder':
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400';
      default:
        return 'text-surface-600 bg-surface-100 dark:bg-surface-900/30 dark:text-surface-400';
    }
  };



  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await authAPI.markNotificationAsRead(notificationId);
      
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));

      // Refresh unread count in header
      refreshUnreadCount();
    } catch (error) {
      // Handle error silently
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await authAPI.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      refreshUnreadCount();
    } catch (error) {
      // Handle error silently
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // If notification has image or is long, go to detail page
    if (notification.image || notification.message.length > 200) {
      navigate(`/notification/${notification.id}`);
      return;
    }

    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on actionUrl
    if (notification.actionUrl) {
      try {
        navigate(notification.actionUrl);
      } catch (error) {
        // Handle error silently
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div>
            <h1 className="text-base sm:text-xl font-semibold tracking-tight text-surface-900 dark:text-white">
              Bildirishnomalar
            </h1>
            <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} ta o'qilmagan` : "Yangi xabar yo'q"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-2.5 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400"
              >
                Barchasini o'qish
              </button>
            )}
            <button
              onClick={() => loadNotifications(1, false)}
              aria-label="Yangilash"
              className="w-8 h-8 inline-flex items-center justify-center rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'application' | 'message' | 'system')}
            className="w-[7.25rem] shrink-0 px-2 py-2 text-xs border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="all">Barchasi</option>
            <option value="unread">O'qilmagan</option>
            <option value="application">Ariza</option>
            <option value="message">Xabar</option>
            <option value="system">Tizim</option>
            <option value="reminder">Eslatma</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <Skeleton className="h-16 w-full rounded-2xl" count={4} />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={searchQuery || filter !== 'all' ? 'Hech narsa topilmadi' : 'Bildirishnomalar yo\'q'}
            description={
              searchQuery || filter !== 'all'
                ? 'Qidiruv shartlaringizni o\'zgartirib ko\'ring'
                : 'Yangi bildirishnomalar paydo bo\'lganda bu yerda ko\'rasiz'
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors duration-150 ${
                  !notification.read
                    ? 'bg-brand-50/60 dark:bg-brand-900/15 border-brand-200 dark:border-brand-800'
                    : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold truncate ${
                      !notification.read ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className="text-[11px] text-surface-400 shrink-0">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  {notification.message && (
                    <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                  )}
                </div>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="w-7 h-7 shrink-0 inline-flex items-center justify-center rounded-lg text-brand-600"
                    title="O'qilgan"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-4"
          >
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 text-sm font-medium transition-colors duration-150"
            >
              {loadingMore ? 'Yuklanmoqda...' : 'Ko\'proq yuklash'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;