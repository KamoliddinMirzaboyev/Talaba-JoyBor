import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface RentalsPageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart?: (listing: Listing) => void;
}

const RentalsPage: React.FC<RentalsPageProps> = ({ onListingSelect }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    priceRange: '',
    roomType: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [apartments, setApartments] = useState<Listing[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // API dan shaharlar ro'yxatini yuklash
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await authAPI.getProvinces();
        setProvinces(data);
      } catch (error) {
        // Fallback shaharlar ro'yxati
        setProvinces([
          { id: 1, name: 'Toshkent' },
          { id: 2, name: 'Samarqand' },
          { id: 3, name: 'Buxoro' },
          { id: 4, name: 'Andijon' },
          { id: 5, name: 'Namangan' },
          { id: 6, name: 'Farg\'ona' },
          { id: 7, name: 'Qashqadaryo' },
          { id: 8, name: 'Surxondaryo' },
          { id: 9, name: 'Jizzax' },
          { id: 10, name: 'Sirdaryo' },
          { id: 11, name: 'Navoiy' },
          { id: 12, name: 'Xorazm' },
          { id: 13, name: 'Qoraqalpog\'iston' }
        ]);
      }
    };
    fetchProvinces();
  }, []);

  // API dan apartments ma'lumotlarini yuklash
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const apartmentsData = await authAPI.getApartments();

        // API strukturasiga mos apartments mapping
        type ApartmentAPI = {
          id: number | string;
          title?: string;
          monthly_price?: number;
          exact_address?: string;
          room_type?: string;
          gender?: string;
          images?: Array<{ image: string }>;
          amenities?: Array<{ name?: string }>;
          description?: string;
          total_rooms?: number;
          available_rooms?: number;
          is_active?: boolean;
          user?: { username?: string; email?: string };
          phone_number?: string;
          user_phone_number?: string;
          province?: number;
          created_at?: string;
        };

        const convertedListings: Listing[] = (apartmentsData as ApartmentAPI[]).map((apartment) => ({
          id: `apt-${apartment.id}`,
          title: String(apartment.title || 'Ijara Xonadon'),
          type: 'rental' as const,
          price: Number(apartment.monthly_price || 0),
          location: String(apartment.exact_address || 'Manzil ko\'rsatilmagan'),
          university: `${apartment.room_type || 'Xona'} - ${apartment.gender || 'Aralash'}`,
          images: (apartment.images as { image: string }[] | undefined)?.map((img) => img.image) || ['/placeholder-apartment.jpg'],
          amenities: (apartment.amenities as { name: string }[] | undefined)?.map((amenity) => amenity.name) || [],
          description: String(apartment.description || 'Tavsif mavjud emas'),
          capacity: Number(apartment.total_rooms || 1),
          available_capacity: Number(apartment.available_rooms || 0),
          available: Boolean(Number(apartment.available_rooms || 0) > 0 && apartment.is_active),
          rating: 4.2, // Default rating
          reviews: Math.floor(Math.random() * 20) + 5, // Random reviews 5-25
          features: {
            furnished: true, // Default
            wifi: (apartment.amenities as { name?: string }[] | undefined)?.some((a) => 
              a.name?.toLowerCase().includes('wifi') || 
              a.name?.toLowerCase().includes('internet')
            ) || false,
            parking: (apartment.amenities as { name?: string }[] | undefined)?.some((a) => 
              a.name?.toLowerCase().includes('parking') || 
              a.name?.toLowerCase().includes('avtomobil')
            ) || false,
            security: (apartment.amenities as { name?: string }[] | undefined)?.some((a) => 
              a.name?.toLowerCase().includes('security') || 
              a.name?.toLowerCase().includes('xavfsizlik')
            ) || true // Default security
          },
          rules: [
            'Chekish taqiqlanadi',
            'Begonalar kirishi taqiqlanadi',
            'Kechqurun 22:00 dan keyin shovqin qilish taqiqlanadi'
          ],
          coordinates: {
            lat: 40.3833, // Farg'ona coordinates
            lng: 71.7833
          },
          // Qo'shimcha apartment ma'lumotlari
          rooms: Number(apartment.total_rooms || 1),
          available_rooms: Number(apartment.available_rooms || 0),
          room_type: String(apartment.room_type || 'Xona'),
          gender: String(apartment.gender || 'Aralash'),
          owner: String(apartment.user?.username || 'Egasi ko\'rsatilmagan'),
          phone_number: String(apartment.phone_number || apartment.user_phone_number || ''),
          user_phone_number: String(apartment.user_phone_number || ''),
          province: Number(apartment.province || 3), // Farg'ona province ID
          created_at: String(apartment.created_at || new Date().toISOString()),
          is_active: apartment.is_active !== false,
          // Landlord ma'lumotlari
          landlord: {
            name: String((apartment.user as { username?: string } | undefined)?.username || 'Egasi'),
            phone: String((apartment.phone_number as string | undefined) || (apartment.user_phone_number as string | undefined) || ''),
            email: String((apartment.user as { email?: string } | undefined)?.email || ''),
            verified: true,
            rating: 4.5
          }
        }));

        setApartments(convertedListings);
        setFilteredApartments(convertedListings);
      } catch (error) {
        setApartments([]);
        setFilteredApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Qidiruv va filtrlash
  useEffect(() => {
    let filtered = [...apartments];

    // Qidiruv bo'yicha
    if (searchQuery) {
      filtered = filtered.filter(apt =>
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Viloyat bo'yicha
    if (selectedFilters.location) {
      filtered = filtered.filter(apt => 
        apt.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
      );
    }

    // Narx oralig'i bo'yicha
    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(apt => {
        if (max) return apt.price >= min && apt.price <= max;
        return apt.price >= min;
      });
    }

    // Xonalar soni bo'yicha
    if (selectedFilters.roomType) {
      filtered = filtered.filter(apt => 
        apt.room_type?.toLowerCase().includes(selectedFilters.roomType.toLowerCase())
      );
    }

    // Saralash
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    setFilteredApartments(filtered);
  }, [apartments, searchQuery, selectedFilters, sortBy]);

  const priceRanges = [
    { label: '500,000 - 1,000,000', value: '500000-1000000' },
    { label: '1,000,000 - 2,000,000', value: '1000000-2000000' },
    { label: '2,000,000 - 3,000,000', value: '2000000-3000000' },
    { label: '3,000,000+', value: '3000000' }
  ];
  const roomTypes = ['1-xonali', '2-xonali', '3-xonali', '4+ xonali'];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Ijara Xonadonlar
          </h1>
          <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            Talabalar uchun qulay va arzon ijara xonadonlarini toping
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kvartira yoki xona qidiring..."
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                  theme === 'dark' 
                    ? 'border-surface-600 bg-surface-700 text-white' 
                    : 'border-surface-300 bg-white text-surface-900'
                }`}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                  theme === 'dark' 
                    ? 'border-surface-600 bg-surface-700 text-white' 
                    : 'border-surface-300 bg-white text-surface-900'
                }`}
              >
                <option value="rating">Reyting bo'yicha</option>
                <option value="price-low">Arzon narx</option>
                <option value="price-high">Qimmat narx</option>
                <option value="newest">Yangi qo'shilgan</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtrlar
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-surface-200 dark:border-surface-700 pt-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Viloyat
                  </label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                      theme === 'dark' 
                        ? 'border-surface-600 bg-surface-700 text-white' 
                        : 'border-surface-300 bg-white text-surface-900'
                    }`}
                  >
                    <option value="">Barcha viloyatlar</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.name}>{province.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Narx oralig'i
                  </label>
                  <select
                    value={selectedFilters.priceRange}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                      theme === 'dark' 
                        ? 'border-surface-600 bg-surface-700 text-white' 
                        : 'border-surface-300 bg-white text-surface-900'
                    }`}
                  >
                    <option value="">Barcha narxlar</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label} so'm</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Xonalar soni
                  </label>
                  <select
                    value={selectedFilters.roomType}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, roomType: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150 ${
                      theme === 'dark' 
                        ? 'border-surface-600 bg-surface-700 text-white' 
                        : 'border-surface-300 bg-white text-surface-900'
                    }`}
                  >
                    <option value="">Barcha turlar</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFilters({ location: '', priceRange: '', roomType: '' })}
                  className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-medium transition-colors duration-150"
                >
                  Filtrlarni Tozalash
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-600 dark:text-surface-300">
            {loading ? 'Yuklanmoqda...' : `${filteredApartments.length} ta ijara xonadoni topildi`}
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Skeleton className="h-80 w-full rounded-2xl" count={6} />
          </div>
        ) : filteredApartments.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Ijara xonadonlar topilmadi"
            description="Qidiruv shartlarini o'zgartirib qaytadan urinib ko'ring"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredApartments.map((apartment, index) => (
              <motion.div
                key={apartment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ListingCard
                  listing={apartment}
                  onSelect={() => onListingSelect(apartment)}
                  user={user}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-brand-600 to-success-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-150">
            Ko'proq Ko'rish
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RentalsPage;