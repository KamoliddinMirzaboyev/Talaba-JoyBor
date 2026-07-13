import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Grid, List, Trash2, Share2, Eye } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { shareOrCopy } from '../utils/share';
import ListingCard from '../components/ListingCard';
import { useTheme } from '../contexts/ThemeContext';

interface SavedListingsPageProps {
  onListingSelect: (listing: Listing) => void;
}

const SavedListingsPage: React.FC<SavedListingsPageProps> = ({ onListingSelect }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dormitory' | 'rental'>('all');
  const [sortBy, setSortBy] = useState('newest');

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

  // Hozircha saqlangan e'lonlar uchun API yo'q, shuning uchun bo'sh array
  const savedListings: Listing[] = [];

  const filteredListings = savedListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || listing.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleRemoveFromSaved = (listingId: string) => {
    // Here you would typically update the user's saved listings
  };

  const handleShare = async (listing: Listing) => {
    await shareOrCopy({
      title: `${listing.title} - JoyBor`,
      text: `${listing.description || 'Yotoqxona haqida ma\'lumot'} - ${new Intl.NumberFormat('uz-UZ').format(listing.price)} so'm/oy`,
      url: `${window.location.origin}/listing/${listing.id}`,
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-danger-500 to-danger-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                Saqlangan Elonlar
              </h1>
              <p className="text-surface-600 dark:text-surface-300">
                Sizga yoqqan yashash joylarini bu yerda topasiz
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Saqlangan elonlarni qidiring..."
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-150 ${
                  theme === 'dark' 
                    ? 'border-surface-600 bg-surface-700 text-white' 
                    : 'border-surface-300 bg-white text-surface-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter by Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'dormitory' | 'rental')}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-150 ${
                  theme === 'dark' 
                    ? 'border-surface-600 bg-surface-700 text-white' 
                    : 'border-surface-300 bg-white text-surface-900'
                }`}
              >
                <option value="all">Barcha turlar</option>
                <option value="dormitory">Yotoqxonalar</option>
                <option value="rental">Ijara xonadonlar</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-150 ${
                  theme === 'dark' 
                    ? 'border-surface-600 bg-surface-700 text-white' 
                    : 'border-surface-300 bg-white text-surface-900'
                }`}
              >
                <option value="newest">Yangi saqlangan</option>
                <option value="oldest">Eski saqlangan</option>
                <option value="price-low">Arzon narx</option>
                <option value="price-high">Qimmat narx</option>
                <option value="rating">Reyting</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-xl transition-colors duration-150 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-surface-600 text-brand-600 shadow-sm' 
                      : 'text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-xl transition-colors duration-150 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-surface-600 text-brand-600 shadow-sm' 
                      : 'text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-600 dark:text-surface-300">
            {filteredListings.length} ta saqlangan elon
          </p>
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={searchQuery || filterType !== 'all' ? 'Hech narsa topilmadi' : 'Hali saqlangan elonlar yo\'q'}
            description={
              searchQuery || filterType !== 'all'
                ? 'Qidiruv shartlaringizni o\'zgartirib ko\'ring'
                : 'Yoqqan elonlarni saqlash uchun yurak belgisini bosing'
            }
            action={{ label: "Elonlarni Ko'rish", onClick: () => navigate('/') }}
          />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <ListingCard
                      listing={listing}
                      onSelect={() => onListingSelect(listing)}
                      user={user}
                    />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare(listing)}
                        className="w-8 h-8 bg-white/90 text-surface-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-150 shadow-sm"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromSaved(listing.id)}
                        className="w-8 h-8 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors duration-150 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 hover:shadow-md transition-shadow duration-150"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {listing.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              listing.type === 'dormitory' 
                                ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300'
                                : 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                            }`}>
                              {listing.type === 'dormitory' ? 'Yotoqxona' : 'Ijara'}
                            </span>
                            {!listing.available && (
                              <span className="px-2 py-1 bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300 rounded-full text-xs font-medium">
                                Band
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-surface-600 dark:text-surface-300 text-sm mb-2">
                          {listing.location} • {listing.university}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-surface-900 dark:text-white">
                            {new Intl.NumberFormat('uz-UZ').format(listing.price)} so'm
                            <span className="text-sm font-normal text-surface-600 dark:text-surface-300 ml-1">
                              /oyiga
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onListingSelect(listing)}
                              className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors duration-150 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ko'rish
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleShare(listing)}
                              className="p-2 border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-150"
                            >
                              <Share2 className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveFromSaved(listing.id)}
                              className="p-2 border border-danger-300 text-danger-600 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedListingsPage;