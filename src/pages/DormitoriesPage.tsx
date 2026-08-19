import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Building2, Map as MapIcon, LayoutGrid } from 'lucide-react';
import { Listing, Dormitory as DormitoryType } from '../types';
import DormitoryCard from '../components/DormitoryCard';
import DormitoryMap from '../components/DormitoryMap';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useDormitories } from '../hooks/useDormitories';

interface DormitoriesPageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const DormitoriesPage: React.FC<DormitoriesPageProps> = ({ onListingSelect, onApplicationStart }) => {
  const location = useLocation();
  const { data: dormitories = [], isLoading: loading } = useDormitories();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>(location.state?.viewMode || 'grid');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    university: '',
    priceRange: '',
    capacity: '',
    amenities: [] as string[]
  });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);


  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // HomePage dan kelgan qidiruv ma'lumotlarini olish
  useEffect(() => {
    if (location.state?.searchFilters) {
      const filters = location.state.searchFilters;
      setSearchQuery(filters.query || '');
      setSelectedFilters(prev => ({
        ...prev,
        location: filters.location || '',
        university: filters.university || '',
        priceRange: filters.priceRange || ''
      }));
      if (filters.university || filters.priceRange || filters.location) {
        setShowFilters(true);
      }
    }
  }, [location.state]);

  // Get unique universities for filter
  const universities = Array.from(new Set(dormitories.map(d => d.university_name))).sort();

  const priceRanges = [
    { label: '100,000 - 300,000', value: '100000-300000' },
    { label: '300,000 - 500,000', value: '300000-500000' },
    { label: '500,000 - 1,000,000', value: '500000-1000000' },
    { label: '1,000,000+', value: '1000000' }
  ];

  // Qidiruv va filtrlash (memo)
  const filteredDormitories = useMemo(() => {
    let filtered = [...dormitories];

    // Qidiruv bo'yicha filtrlash
    if (searchQuery) {
      filtered = filtered.filter(dormitory =>
        dormitory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dormitory.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dormitory.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrlar bo'yicha filtrlash
    if (selectedFilters.university) {
      filtered = filtered.filter(dormitory =>
        dormitory.university_name === selectedFilters.university
      );
    }

    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(dormitory => {
        const price = dormitory.month_price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    if (selectedFilters.capacity) {
      const capacity = parseInt(selectedFilters.capacity);
      filtered = filtered.filter(dormitory =>
        (dormitory.available_capacity || 0) >= capacity
      );
    }

    // Saralash
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.month_price - b.month_price;
        case 'price-high':
          return b.month_price - a.month_price;
        case 'capacity':
          return (b.available_capacity || 0) - (a.available_capacity || 0);
        case 'distance':
          return (a.distance_to_university || 0) - (b.distance_to_university || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [dormitories, searchQuery, selectedFilters, sortBy]);

  const activeFilterCount = [
    selectedFilters.university,
    selectedFilters.priceRange,
    selectedFilters.capacity,
  ].filter(Boolean).length;

  // Yotoqxonani Listing formatiga o'tkazish
  const convertDormitoryToListing = (dormitory: DormitoryType): Listing => {
    // Handle images - can be empty array
    const images = Array.isArray(dormitory.images) && dormitory.images.length > 0
      ? dormitory.images.map(img => typeof img === 'string' ? img : img?.image || '')
      : ['/placeholder-dormitory.svg'];

    // Handle amenities - can be empty array
    const amenities = Array.isArray(dormitory.amenities_list) && dormitory.amenities_list.length > 0
      ? dormitory.amenities_list.map(amenity => amenity?.name || '')
      : [];

    return {
      id: dormitory.id.toString(),
      title: dormitory.name,
      type: 'dormitory',
      price: dormitory.month_price,
      location: dormitory.address,
      university: dormitory.university_name,
      images: images.filter(Boolean),
      amenities: amenities.filter(Boolean),
      description: dormitory.description,
      capacity: dormitory.room_statistics?.total.capacity || dormitory.total_capacity || 0,
      available_capacity: dormitory.room_statistics 
        ? (dormitory.room_statistics.male.free + dormitory.room_statistics.female.free) 
        : (dormitory.available_capacity || 0),
      available: (dormitory.room_statistics 
        ? (dormitory.room_statistics.male.free + dormitory.room_statistics.female.free) 
        : (dormitory.available_capacity || 0)) > 0,
      rating: dormitory.rating || 0,
      reviews: 0,
      features: {
        furnished: true,
        wifi: amenities.some((a: string) => a.toLowerCase().includes('wifi')),
        parking: amenities.some((a: string) => a.toLowerCase().includes('parking')),
        security: amenities.some((a: string) => a.toLowerCase().includes('security'))
      },
      rules: (dormitory.rules || []).map((r) => typeof r === 'string' ? r : r.rule),
      coordinates: {
        lat: dormitory.latitude,
        lng: dormitory.longitude
      },
      room_statistics: dormitory.room_statistics,
    };
  };

  const renderDormitoryCard = (dormitory: DormitoryType) => {
    const listing = convertDormitoryToListing(dormitory);
    return (
      <DormitoryCard
        key={dormitory.id}
        id={dormitory.id}
        name={dormitory.name}
        month_price={dormitory.month_price}
        address={dormitory.address}
        universityName={dormitory.university_name}
        images={listing.images}
        amenities={listing.amenities}
        available_capacity={dormitory.room_statistics?.total.free || dormitory.available_capacity || 0}
        total_capacity={dormitory.room_statistics?.total.capacity || dormitory.total_capacity || 0}
        distance_to_university={dormitory.distance || dormitory.distance_to_university}
        description={dormitory.description}
        room_statistics={dormitory.room_statistics}
        rules={dormitory.rules}
        onSelect={() => onListingSelect(listing)}
        onApplicationStart={() => onApplicationStart(listing)}
        canApply={true}
      />
    );
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Skeleton className="h-64 w-full rounded-2xl" count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h1 className="text-base sm:text-xl font-semibold tracking-tight text-surface-900 dark:text-white">
            Yotoqxonalar
          </h1>
          <div className="flex items-center gap-1 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Ro'yxat"
              className={`p-1.5 rounded-lg transition-colors duration-150 ${
                viewMode === 'grid'
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              aria-label="Xarita"
              className={`p-1.5 rounded-lg transition-colors duration-150 ${
                viewMode === 'map'
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish..."
                className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Saralash"
              className="w-[7.5rem] shrink-0 px-2 py-2 text-xs border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-colors duration-150"
            >
              <option value="name">Nomi</option>
              <option value="price-low">Arzon</option>
              <option value="price-high">Qimmat</option>
              <option value="capacity">Joy</option>
              <option value="distance">Masofa</option>
            </select>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={`relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors duration-150 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 rounded-full bg-danger-500 text-white text-[10px] font-semibold leading-4 text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-2 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-2.5">
              <div className="grid grid-cols-2 gap-2">
                <label className="block col-span-2 sm:col-span-1">
                  <span className="block text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1">Universitet</span>
                  <select
                    value={selectedFilters.university}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-2 py-1.5 text-xs border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent"
                  >
                    <option value="">Barchasi</option>
                    {universities.map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1">Narx</span>
                  <select
                    value={selectedFilters.priceRange}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-2 py-1.5 text-xs border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent"
                  >
                    <option value="">Barchasi</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1">Joy</span>
                  <select
                    value={selectedFilters.capacity}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-2 py-1.5 text-xs border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-transparent"
                  >
                    <option value="">Istalgan</option>
                    <option value="1">1+</option>
                    <option value="5">5+</option>
                    <option value="10">10+</option>
                    <option value="20">20+</option>
                  </select>
                </label>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFilters({
                    location: '',
                    university: '',
                    priceRange: '',
                    capacity: '',
                    amenities: []
                  })}
                  className="mt-2 text-[11px] font-medium text-brand-600 dark:text-brand-400"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] sm:text-xs text-surface-500 dark:text-surface-400 mb-2.5">
          <span className="font-medium text-surface-800 dark:text-surface-200">{filteredDormitories.length}</span> ta yotoqxona
        </p>

        {/* View Content */}
        {viewMode === 'grid' ? (
          filteredDormitories.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Yotoqxona topilmadi"
              description="Qidiruv shartlarini o'zgartirib qaytadan urinib ko'ring"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredDormitories.map((dormitory) => renderDormitoryCard(dormitory))}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <DormitoryMap 
              height="600px"
              dormitories={filteredDormitories.map(dorm => ({
                id: dorm.id,
                name: dorm.name,
                address: dorm.address,
                price: `${dorm.month_price.toLocaleString()} so'm / oy`,
                phone: String(dorm.phone || dorm.phone_number || dorm.phone_numer || "+998 90 123 45 67"),
                latitude: dorm.latitude,
                longitude: dorm.longitude,
                availableSpots: dorm.available_capacity,
                university: dorm.university_name
              }))} 
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DormitoriesPage;