import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Paperclip, Smile, Phone, Video, MoreVertical, ArrowLeft, MessageCircle } from 'lucide-react';
import { Conversation, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime } from "../utils/format";

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-150"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Hozircha xabarlar uchun API yo'q, shuning uchun bo'sh array
  const conversations: Conversation[] = [];

  // Mock messages for selected conversation
  const getMessagesForConversation = (conversationId: string): Message[] => {
    const baseMessages: Record<string, Message[]> = {
      '1': [
        {
          id: 'msg1-1',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Assalomu alaykum! Kvartira haqida ma\'lumot olsam bo\'ladimi?',
          timestamp: '2024-01-15T13:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-2',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Wa alaykum assalom! Albatta, qanday ma\'lumot kerak?',
          timestamp: '2024-01-15T13:15:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-3',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Kvartira qachondan boshlab bo\'sh? Va oylik ijara narxi qancha?',
          timestamp: '2024-01-15T13:30:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-4',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Kvartira hoziroq bo\'sh. Oylik ijara 2,500,000 so\'m. Kommunal to\'lovlar alohida.',
          timestamp: '2024-01-15T14:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-5',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Kvartira haqida qo\'shimcha savollaringiz bormi?',
          timestamp: '2024-01-15T14:30:00Z',
          read: false,
          type: 'text'
        }
      ],
      '2': [
        {
          id: 'msg2-1',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Yotoqxonaga ariza yubordim. Holati qanday?',
          timestamp: '2024-01-15T09:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg2-2',
          senderId: 'admin1',
          senderName: 'TATU Admin',
          content: 'Arizangiz qabul qilindi. Hujjatlaringiz tekshirilmoqda.',
          timestamp: '2024-01-15T09:30:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg2-3',
          senderId: 'admin1',
          senderName: 'TATU Admin',
          content: 'Arizangiz ko\'rib chiqilmoqda. Tez orada javob beramiz.',
          timestamp: '2024-01-15T10:15:00Z',
          read: true,
          type: 'text'
        }
      ]
    };
    return baseMessages[conversationId] || [];
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Here you would typically send the message to your backend
      setMessageText('');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? getMessagesForConversation(selectedConversation) : [];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-surface-200 dark:border-surface-700 flex flex-col`}>
              {/* Header */}
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
                  Xabarlar
                </h1>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Xabarlarni qidiring..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-150 ${
                      theme === 'dark' 
                        ? 'border-surface-600 bg-surface-700 text-white' 
                        : 'border-surface-300 bg-white text-surface-900'
                    }`}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <EmptyState
                    icon={MessageCircle}
                    title="Hali xabarlar yo'q"
                    description="Uy egasi yoki yotoqxona ma'muriyati bilan bog'laning"
                  />
                ) : (
                  <div className="divide-y divide-surface-200 dark:divide-surface-700">
                    {conversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer transition-colors duration-150 ${
                          selectedConversation === conversation.id 
                            ? 'bg-brand-50 dark:bg-brand-900/20 border-r-2 border-brand-600' 
                            : 'hover:bg-surface-50 dark:hover:bg-surface-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-brand-600 to-success-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {conversation.participantName.charAt(0)}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-medium truncate ${
                                conversation.unreadCount > 0 
                                  ? 'text-surface-900 dark:text-white' 
                                  : 'text-surface-700 dark:text-surface-300'
                              }`}>
                                {conversation.participantName}
                              </h3>
                              <span className="text-xs text-surface-500 dark:text-surface-400">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            {conversation.listingTitle && (
                              <p className="text-xs text-brand-600 dark:text-brand-400 mb-1">
                                {conversation.listingTitle}
                              </p>
                            )}
                            
                            <p className={`text-sm truncate ${
                              conversation.unreadCount > 0 
                                ? 'text-surface-900 dark:text-white font-medium' 
                                : 'text-surface-600 dark:text-surface-300'
                            }`}>
                              {conversation.lastMessage.senderId === (user?.id?.toString() || 'current-user') ? 'Siz: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
              {selectedConversation && selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedConversation(null)}
                          className="lg:hidden p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        
                        <div className="w-10 h-10 bg-gradient-to-r from-brand-600 to-success-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConv.participantName.charAt(0)}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-surface-900 dark:text-white">
                            {selectedConv.participantName}
                          </h3>
                          {selectedConv.listingTitle && (
                            <p className="text-sm text-brand-600 dark:text-brand-400">
                              {selectedConv.listingTitle}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                        >
                          <Phone className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                        >
                          <Video className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${message.senderId === (user?.id?.toString() || 'current-user') ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === (user?.id?.toString() || 'current-user')
                            ? 'bg-gradient-to-r from-brand-600 to-success-600 text-white'
                            : theme === 'dark' 
                              ? 'bg-surface-700 text-white' 
                              : 'bg-surface-100 text-surface-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === (user?.id?.toString() || 'current-user') 
                              ? 'text-brand-100' 
                              : 'text-surface-500 dark:text-surface-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                      >
                        <Paperclip className="w-5 h-5" />
                      </motion.button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Xabar yozing..."
                          className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-150 ${
                            theme === 'dark' 
                              ? 'border-surface-600 bg-surface-700 text-white' 
                              : 'border-surface-300 bg-white text-surface-900'
                          }`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="p-3 bg-gradient-to-r from-brand-600 to-success-600 text-white rounded-xl hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    icon={MessageCircle}
                    title="Suhbatni tanlang"
                    description="Xabar yuborish uchun chap tarafdan suhbatni tanlang"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;