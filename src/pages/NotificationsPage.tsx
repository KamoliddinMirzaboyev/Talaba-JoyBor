import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Filter, Search, Calendar, MessageCircle, CheckCircle, Info, RefreshCw, Clock } from 'lucide-react';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useTheme } from '../contexts/ThemeContext';
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
  const { theme } = useTheme();
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
  const ITEMS_PER_PAGE = 20;

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
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors duration-200"
          >
            Tizimga kirish
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
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'system':
      default:
        return <Info className="w-5 h-5" />;
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                    Bildirishnomalar
                  </h1>
                  <p className="text-surface-600 dark:text-surface-400">
                    {unreadCount > 0 ? `${unreadCount} ta yangi xabar` : 'Barcha xabarlar o\'qilgan'}
                  </p>
                </div>
              </div>

              {/* Action buttons - moved below for mobile */}
              <div className="flex flex-wrap items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Barchasini o'qilgan</span>
                    <span className="sm:hidden">Barchasi</span>
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Yangilash
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clean Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bildirishnomalarni qidiring..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-200 ${theme === 'dark'
                    ? 'border-surface-600 bg-surface-700 text-white placeholder-surface-400'
                    : 'border-surface-300 bg-white text-surface-900 placeholder-surface-500'
                  }`}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-surface-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'application' | 'message' | 'system')}
                className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-200 ${theme === 'dark'
                    ? 'border-surface-600 bg-surface-700 text-white'
                    : 'border-surface-300 bg-white text-surface-900'
                  }`}
              >
                <option value="all">Barchasi</option>
                <option value="unread">O'qilmaganlar</option>
                <option value="application">Arizalar</option>
                <option value="message">Xabarlar</option>
                <option value="system">Tizim</option>
                <option value="reminder">Eslatmalar</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <Skeleton className="h-28 w-full rounded-xl" count={4} />
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
          <div className="space-y-6">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative bg-white dark:bg-surface-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border ${!notification.read
                    ? 'border-l-4 border-l-brand-500 bg-brand-50/30 dark:bg-brand-900/10 border-surface-200 dark:border-surface-700'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                  }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Clean icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Image if available */}
                    {notification.image && (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border border-surface-200 dark:border-surface-700">
                        <img
                          src={notification.image}
                          alt="Notification"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1 sm:gap-2">
                        <h3 className={`font-semibold text-base sm:text-lg ${!notification.read
                            ? 'text-surface-900 dark:text-white'
                            : 'text-surface-700 dark:text-surface-300'
                          }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-surface-500 dark:text-surface-400 flex-shrink-0">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>

                      <p className={`text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 ${!notification.read
                          ? 'text-surface-700 dark:text-surface-300'
                          : 'text-surface-600 dark:text-surface-400'
                        } ${notification.message.length > 100 ? 'line-clamp-2' : ''}`}>
                        {notification.message.length > 100 ?
                          `${notification.message.substring(0, 100)}...` :
                          notification.message
                        }
                      </p>

                      {/* Action section */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.type === 'application' ? 'Ariza' :
                              notification.type === 'message' ? 'Xabar' :
                                notification.type === 'system' ? 'Tizim' :
                                  notification.type === 'reminder' ? 'Eslatma' : 'Bildirishnoma'}
                          </span>
                          {notification.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priority === 'high' ? 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400' :
                                notification.priority === 'medium' ? 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400' :
                                  'bg-surface-100 text-surface-600 dark:bg-surface-900/30 dark:text-surface-400'
                              }`}>
                              {notification.priority === 'high' ? 'Muhim' :
                                notification.priority === 'medium' ? 'O\'rta' : 'Past'}
                            </span>
                          )}
                          {(notification.image || notification.message.length > 200) && (
                            <span className="px-2 py-1 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-full text-xs font-medium">
                              Ko'proq o'qish
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors duration-200 text-xs sm:text-sm"
                              title="O'qilgan deb belgilash"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">O'qilgan</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded-lg text-xs sm:text-sm">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">O'qilgan</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
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