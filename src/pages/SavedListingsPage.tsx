import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Grid, List } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLikes } from '../contexts/LikesContext';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import ListingCard from '../components/ListingCard';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI, mediaUrl } from '../services/api';

interface SavedListingsPageProps {
  onListingSelect: (listing: Listing) => void;
}

function mapDormToListing(dormitory: Record<string, unknown>): Listing {
  const imagesRaw = (dormitory.images as Array<string | { image?: string }>) || [];
  const images =
    imagesRaw.length > 0
      ? imagesRaw
          .map((img) => mediaUrl(typeof img === 'string' ? img : img?.image))
          .filter(Boolean)
      : ['/placeholder-dormitory.svg'];

  const amenitiesList = (dormitory.amenities_list as Array<{ name?: string }>) || [];
  const roomStats = dormitory.room_statistics as
    | {
        total?: { capacity?: number; free?: number };
        male?: { free?: number };
        female?: { free?: number };
      }
    | undefined;

  const freeSpaces = roomStats
    ? (roomStats.male?.free || 0) + (roomStats.female?.free || 0)
    : Number(dormitory.available_capacity) || 0;

  return {
    id: `dorm-${dormitory.id}`,
    title: String(dormitory.name || ''),
    type: 'dormitory',
    price: Number(dormitory.month_price) || 0,
    location: String(dormitory.address || ''),
    university: String(dormitory.university_name || ''),
    images,
    amenities: amenitiesList.map((a) => a?.name || '').filter(Boolean),
    description: String(dormitory.description || ''),
    capacity: roomStats?.total?.capacity || Number(dormitory.total_capacity) || 0,
    available_capacity: freeSpaces,
    available: freeSpaces > 0,
    rating: Number(dormitory.rating) || 0,
    reviews: 0,
    features: {
      furnished: true,
      wifi: true,
      parking: false,
      security: true,
    },
    rules: [],
    coordinates: {
      lat: Number(dormitory.latitude) || 0,
      lng: Number(dormitory.longitude) || 0,
    },
    room_statistics: roomStats as Listing['room_statistics'],
  };
}

const SavedListingsPage: React.FC<SavedListingsPageProps> = ({ onListingSelect }) => {
  const { user } = useAuth();
  const { likedItems } = useLikes();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await authAPI.getDormitories();
        const results = (data.results || data) as Array<Record<string, unknown>>;
        const list = (Array.isArray(results) ? results : []).map(mapDormToListing);
        const liked = list.filter((l) => likedItems.has(l.id));
        if (!cancelled) setListings(liked);
      } catch {
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [likedItems]);

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

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-brand-600 fill-brand-600" />
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
              Saqlangan
            </h1>
          </div>
          <p className="text-surface-500 dark:text-surface-400">
            Sessiya bo‘ylab saqlangan yotoqxonalar (liked) — real `/dormitories/` dan
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                theme === 'dark'
                  ? 'border-surface-600 bg-surface-700 text-white'
                  : 'border-surface-300 bg-white text-surface-900'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl border ${viewMode === 'grid' ? 'bg-brand-600 text-white border-brand-600' : 'border-surface-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl border ${viewMode === 'list' ? 'bg-brand-600 text-white border-brand-600' : 'border-surface-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : filteredListings.length === 0 ? (
          <EmptyState
            title="Saqlanganlar yo‘q"
            description="Yotoqxona kartasidagi yurakcha orqali saqlang"
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
            }
          >
            {filteredListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard
                  listing={listing}
                  user={user}
                  onSelect={() => onListingSelect(listing)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedListingsPage;
