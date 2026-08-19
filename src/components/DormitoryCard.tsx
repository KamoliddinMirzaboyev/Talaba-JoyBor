import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MapPin, Users, Building2, CheckCircle, Share2, ShieldCheck } from 'lucide-react';
import { shareOrCopy } from '../utils/share';

interface DormitoryCardProps {
  id: number | string;
  name: string;
  month_price: number;
  address: string;
  universityName: string;
  images: string[];
  amenities: string[];
  available_capacity: number;
  total_capacity: number;
  distance_to_university?: number;
  description?: string;
  room_statistics?: {
    total: {
      rooms: number;
      capacity: number;
      occupied: number;
      free: number;
      occupancy_rate: number;
    };
    male: {
      free: number;
    };
    female: {
      free: number;
    };
    by_status?: {
      available: number;
      partially_occupied: number;
      fully_occupied: number;
    };
  };
  rules?: Array<{ id: number; rule: string; dormitory: number }>;
  onSelect: () => void;
  onApplicationStart?: () => void;
  canApply?: boolean;
}

const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const DormitoryCard: React.FC<DormitoryCardProps> = ({
  name,
  month_price,
  address,
  universityName,
  images,
  amenities,
  available_capacity,
  description,
  room_statistics,
  rules,
  onSelect,
  onApplicationStart,
  canApply,
}) => {
  const totalFreeSpaces = room_statistics 
    ? (room_statistics.male.free + room_statistics.female.free)
    : available_capacity;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareOrCopy({
      title: `${name} - JoyBor`,
      text: `${description || "Yotoqxona haqida ma'lumot"} - ${formatPrice(month_price)}/oy`,
      url: window.location.href,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onSelect}
      className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-150 group flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {images && images.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={images.length > 1}
            className="h-full"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`${name} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-dormitory.svg';
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src="/placeholder-dormitory.svg"
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="absolute top-2 left-2 z-10 w-8 h-8 bg-white/90 text-surface-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-150 backdrop-blur-sm shadow-lg"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 z-10 bg-brand-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
          {formatPrice(month_price)}/oy
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white line-clamp-1">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-brand-600 mb-1">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-medium line-clamp-1">{universityName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs line-clamp-1">{address}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-xs text-surface-700 dark:text-surface-300 font-medium">
              Bo'sh joy: {totalFreeSpaces}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-xs text-surface-700 dark:text-surface-300 font-medium">
              Xonalar: {room_statistics ? room_statistics.total.rooms : '?'}
            </span>
          </div>
        </div>

        {/* Rules Summary */}
        {rules && rules.length > 0 && (
          <div className="mb-4 space-y-1">
            <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Asosiy Qoidalar</span>
            </div>
            <div className="flex flex-col gap-1">
              {rules.map((rule, idx) => (
                <p key={rule.id || idx} className="text-xs text-surface-600 dark:text-surface-400 line-clamp-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-brand-500 rounded-full flex-shrink-0"></span>
                  {rule.rule}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 text-success-500" />
              <span className="text-xs text-surface-700 dark:text-surface-300">{amenity}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <span className="text-xs text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
              +{amenities.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="flex-1 mb-4">
            <p className="text-surface-500 dark:text-surface-400 text-xs sm:text-sm line-clamp-2">
              {description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2 px-3 rounded-xl text-sm font-medium shadow-sm transition-colors duration-150 flex items-center justify-center gap-2"
          >
            Ko'rish
          </motion.button>

          {canApply && onApplicationStart && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); onApplicationStart(); }}
              className="px-3 py-2 border border-brand-600 text-brand-600 rounded-xl text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors duration-150 whitespace-nowrap"
            >
              Ariza
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DormitoryCard; 