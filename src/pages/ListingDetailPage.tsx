import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Wifi,
  Car,
  Shield,
  Heart,
  Share2,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Coffee,
  BookOpen,
  Utensils,
  Dumbbell,
  Tv,
  Snowflake,
  Sun,
  Moon,
  Zap,
  Bus,
  Bike,
  Eye,
  GraduationCap,
  Droplets,
  Bed,
  Home,
  Trees,
  Leaf,
  Building2,
} from "lucide-react";
import { Listing } from "../types";
import { formatCapacityBucket, formatPhoneNumber } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import DormitoryLocationMap from "../components/DormitoryLocationMap";
import { getGlobalSelectedListing, setGlobalSelectedListing } from "../App";
import { authAPI } from "../services/api";
import { shareOrCopy } from "../utils/share";
import { useLikes } from "../contexts/LikesContext";

const ListingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const { user } = useAuth();
  const { toggleLike, isLiked } = useLikes();
  const [listing, setListing] = useState<Listing | null>(
    getGlobalSelectedListing()
  );
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const onApplicationStart = (listing: Listing) => {
    setGlobalSelectedListing(listing);
    navigate("/application");
  };

  // Load listing data if not available
  useEffect(() => {
    const loadListing = async () => {
      if (!listing && id) {
        setLoading(true);
        try {
          // Try to find listing from API
          const dormitoriesResponse = await authAPI.getDormitories();
          const dormitories =
            dormitoriesResponse.results || dormitoriesResponse;

          // Define the dormitory type
          type DormitoryAPI = {
            id: number;
            name: string;
            month_price: number;
            address: string;
            university_name: string;
            phone_number?: string;
            phone?: string;
            contact_phone?: string;
            admin_phone?: string;
            email?: string;
            images: Array<string | { image: string }>;
            amenities_list: Array<{ name: string }>;
            description?: string;
            total_capacity?: number;
            available_capacity?: number;
            rating?: number;
            admin_name?: string;
            rules?: Array<{ rule: string } | string>;
            latitude?: number;
            longitude?: number;
            room_statistics?: {
              total: {
                rooms: number;
                capacity: number;
                occupied: number;
                free: number;
                occupancy_rate: number;
              };
              male: { free: number };
              female: { free: number };
            };
          };

          // Convert API data to Listing format
          const allListings: Listing[] = (dormitories as DormitoryAPI[]).map(
            (dorm) => {
              const images =
                Array.isArray(dorm.images) && dorm.images.length > 0
                  ? dorm.images.map((img: string | { image: string }) =>
                      typeof img === "string" ? img : img?.image || ""
                    )
                  : ["/placeholder-dormitory.svg"];

              const amenities =
                Array.isArray(dorm.amenities_list) &&
                dorm.amenities_list.length > 0
                  ? dorm.amenities_list.map(
                      (a: { name: string }) => a?.name || ""
                    )
                  : [];

              const rules = Array.isArray(dorm.rules)
                ? dorm.rules.map((r) => (typeof r === "string" ? r : r.rule))
                : [];

              return {
                id: `dorm-${dorm.id}`,
                title: dorm.name,
                type: "dormitory" as const,
                price: dorm.month_price,
                location: dorm.address,
                university: dorm.university_name,
                images: images.filter(Boolean),
                amenities: amenities.filter(Boolean),
                description: dorm.description || "Tavsif mavjud emas",
                capacity: dorm.room_statistics?.total.capacity || dorm.total_capacity || 0,
                available_capacity: dorm.room_statistics 
                  ? (dorm.room_statistics.male.free + dorm.room_statistics.female.free) 
                  : (dorm.available_capacity || 0),
                available: (dorm.room_statistics 
                  ? (dorm.room_statistics.male.free + dorm.room_statistics.female.free) 
                  : (dorm.available_capacity || 0)) > 0,
                rating: dorm.rating || 0,
                reviews: 0,
                admin: {
                  name: dorm.admin_name || "Yotoqxona Ma'muriyati",
                  phone: dorm.phone_number || dorm.phone || dorm.contact_phone || dorm.admin_phone || undefined,
                  email: dorm.email || undefined,
                },
                features: {
                  furnished: true,
                  wifi: amenities.some((a: string) =>
                    a.toLowerCase().includes("wifi")
                  ),
                  parking: amenities.some((a: string) =>
                    a.toLowerCase().includes("parking")
                  ),
                  security: amenities.some((a: string) =>
                    a.toLowerCase().includes("security")
                  ),
                },
                rules: rules,
                coordinates: {
                  lat: dorm.latitude || 0,
                  lng: dorm.longitude || 0,
                },
                room_statistics: dorm.room_statistics,
              };
            }
          );

          const foundListing = allListings.find((l) => l.id === id);
          if (foundListing) {
            setListing(foundListing);
            setGlobalSelectedListing(foundListing);
          }
        } catch (error) {
          // Handle error silently
        } finally {
          setLoading(false);
        }
      }
    };

    loadListing();
  }, [id, listing]);

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Listing o'zgarganda ham yuqoriga scroll qilish va image index reset
  useEffect(() => {
    if (listing) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [listing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-6 w-2/3 rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <EmptyState
          icon={Building2}
          title="Elon topilmadi"
          action={{ label: "Bosh sahifaga qaytish", onClick: () => navigate("/") }}
        />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();

    // Internet va texnologiya
    if (name.includes("wifi") || name.includes("internet"))
      return <Wifi className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (name.includes("tv") || name.includes("televizor"))
      return <Tv className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (name.includes("ac") || name.includes("konditsioner"))
      return <Snowflake className="w-5 h-5 text-info-600 dark:text-info-400" />;
    if (name.includes("zap") || name.includes("elektr"))
      return <Zap className="w-5 h-5 text-warning-600 dark:text-warning-400" />;

    // Transport va parking
    if (name.includes("parking") || name.includes("avto"))
      return <Car className="w-5 h-5 text-success-600 dark:text-success-400" />;
    if (name.includes("bus") || name.includes("avtobus"))
      return <Bus className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (name.includes("bike") || name.includes("velosiped"))
      return <Bike className="w-5 h-5 text-success-600 dark:text-success-400" />;

    // Xavfsizlik va monitoring
    if (name.includes("security") || name.includes("xavfsizlik"))
      return (
        <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
      );
    if (name.includes("camera") || name.includes("kamera"))
      return <Eye className="w-5 h-5 text-brand-600 dark:text-brand-400" />;

    // Oshxona va ovqat
    if (name.includes("coffee") || name.includes("kofe"))
      return (
        <Coffee className="w-5 h-5 text-warning-600 dark:text-warning-400" />
      );
    if (name.includes("kitchen") || name.includes("oshxona"))
      return <Utensils className="w-5 h-5 text-danger-600 dark:text-danger-400" />;
    if (name.includes("restaurant") || name.includes("restoran"))
      return <Utensils className="w-5 h-5 text-danger-600 dark:text-danger-400" />;

    // O'qish va ish
    if (name.includes("library") || name.includes("kutubxona"))
      return <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (
      name.includes("darsxona") ||
      name.includes("study") ||
      name.includes("classroom")
    )
      return (
        <GraduationCap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
      );
    if (name.includes("computer") || name.includes("kompyuter"))
      return <Tv className="w-5 h-5 text-brand-600 dark:text-brand-400" />;

    // Sport va mashg'ulot
    if (
      name.includes("gym") ||
      name.includes("mashq") ||
      name.includes("sport")
    )
      return (
        <Dumbbell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
      );
    if (name.includes("pool") || name.includes("basseyn"))
      return <Droplets className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (name.includes("tennis") || name.includes("basketball"))
      return (
        <Dumbbell className="w-5 h-5 text-success-600 dark:text-success-400" />
      );

    // Turar joy va mebel
    if (name.includes("bed") || name.includes("krovat"))
      return <Bed className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    if (name.includes("furniture") || name.includes("mebel"))
      return <Home className="w-5 h-5 text-warning-600" />;
    if (name.includes("balcony") || name.includes("balkon"))
      return <Home className="w-5 h-5 text-success-600 dark:text-success-400" />;

    // Xizmatlar
    if (
      name.includes("kir yuvish") ||
      name.includes("washing") ||
      name.includes("laundry")
    )
      return <Droplets className="w-5 h-5 text-info-600 dark:text-info-400" />;
    if (name.includes("mashina") || name.includes("machine"))
      return <Droplets className="w-5 h-5 text-info-600 dark:text-info-400" />;
    if (name.includes("cleaning") || name.includes("tozalash"))
      return <Droplets className="w-5 h-5 text-brand-600 dark:text-brand-400" />;

    // Iqlim va muhit
    if (name.includes("heating") || name.includes("isitish"))
      return <Sun className="w-5 h-5 text-warning-600 dark:text-warning-400" />;
    if (name.includes("fan") || name.includes("ventilyator"))
      return <Moon className="w-5 h-5 text-surface-600 dark:text-surface-400" />;
    if (name.includes("garden") || name.includes("bog"))
      return <Trees className="w-5 h-5 text-success-600 dark:text-success-400" />;
    if (name.includes("nature") || name.includes("tabiat"))
      return <Leaf className="w-5 h-5 text-success-600 dark:text-success-400" />;

    // Boshqa
    if (name.includes("building") || name.includes("binolar"))
      return <Building2 className="w-5 h-5 text-surface-600 dark:text-surface-400" />;

    return (
      <CheckCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
    );
  };

  const handleShare = async () => {
    if (!listing) return;
    const priceText =
      new Intl.NumberFormat("uz-UZ").format(listing.price) + " so'm/oy";
    await shareOrCopy({
      title: `${listing.title} - JoyBor`,
      text: `${
        listing.description || "Yotoqxona haqida ma'lumot"
      } - ${priceText}`,
      url: `${window.location.origin}/listing/${listing.id}`,
    });
  };

  const handleLike = () => {
    if (!listing) return;
    toggleLike(listing.id);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-4xl space-y-6">
            {/* Image Gallery */}
            {/* Image Gallery with Swiper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden mb-6 group"
            >
              {listing.images && listing.images.length > 0 ? (
                <Swiper
                  modules={[Pagination, Autoplay, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  navigation
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  loop={listing.images.length > 1}
                  className="h-full"
                >
                  {listing.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${listing.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-room.svg";
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src="/placeholder-room.svg"
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 shadow-lg ${
                    listing && isLiked(listing.id)
                      ? "bg-danger-500 text-white"
                      : "bg-white/90 text-surface-600 hover:bg-white backdrop-blur-sm"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      listing && isLiked(listing.id) ? "fill-current" : ""
                    }`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/90 text-surface-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-150 backdrop-blur-sm shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Type Badge */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm bg-brand-100/90 text-brand-800 dark:bg-success-900/60 dark:text-brand-300">
                  Yotoqxona
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                  {listing.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-surface-600 dark:text-surface-300 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>
                    {listing.available_capacity !== undefined
                      ? `Bo'sh joylar: ${formatCapacityBucket(
                          listing.available_capacity
                        )}`
                      : `${listing.capacity} kishi`}
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
                {formatPrice(listing.price)}
                <span className="text-lg font-normal text-surface-600 dark:text-surface-300 ml-2">
                  /oyiga
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                Tavsif
              </h2>
              <div className="text-surface-600 dark:text-surface-300 leading-relaxed">
                {listing.description && listing.description.length > 200 ? (
                  <>
                    <p>
                      {showFullDescription
                        ? listing.description
                        : `${listing.description.substring(0, 200)}...`}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors duration-150 flex items-center gap-1"
                    >
                      {showFullDescription ? "Kamroq ko'rish" : "Ko'proq ko'rish"}
                      <span className="text-lg">{showFullDescription ? "↑" : "↓"}</span>
                    </motion.button>
                  </>
                ) : (
                  <p>{listing.description}</p>
                )}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                Qulayliklar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, index) => {
                    const amenityName =
                      typeof amenity === "string" ? amenity : "Qulaylik";
                    const icon = getAmenityIcon(amenityName);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                          {icon}
                        </div>
                        <span className="text-surface-700 dark:text-surface-300">
                          {amenityName}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to features if no amenities
                  <>
                    {listing.features.wifi && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-surface-700 dark:text-surface-300">
                          WiFi
                        </span>
                      </div>
                    )}
                    {listing.features.parking && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                          <Car className="w-5 h-5 text-success-600 dark:text-success-400" />
                        </div>
                        <span className="text-surface-700 dark:text-surface-300">
                          Parking
                        </span>
                      </div>
                    )}
                    {listing.features.security && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <span className="text-surface-700 dark:text-surface-300">
                          Xavfsizlik
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
            >
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                Qoidalar
              </h2>
              <ul className="space-y-2">
                {listing.rules && listing.rules.length > 0 ? (
                  listing.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-surface-600 dark:text-surface-300">
                        {typeof rule === "string" ? rule : "Qoida"}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-surface-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-surface-500 dark:text-surface-400">
                      Qoidalar haqida ma'lumot yo'q
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
            >
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-3">
                Yotoqxona Ma'muriyati
              </h3>
              <div className="space-y-2.5 mb-5">
                {listing.admin?.phone ? (
                  <a
                    href={`tel:${listing.admin.phone}`}
                    className="flex items-center gap-2.5 text-sm font-semibold text-surface-800 dark:text-surface-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>{formatPhoneNumber(listing.admin.phone)}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs text-surface-500">
                    <Phone className="w-4 h-4 text-surface-400 shrink-0" />
                    <span>Aloqa raqami kiritilmagan</span>
                  </div>
                )}
                {listing.admin?.email && (
                  <a
                    href={`mailto:${listing.admin.email}`}
                    className="flex items-center gap-2.5 text-xs text-surface-600 dark:text-surface-400 hover:text-brand-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-surface-400 shrink-0" />
                    <span>{listing.admin.email}</span>
                  </a>
                )}
              </div>

              <div className="space-y-3">
                {user ? (
                  <button
                    onClick={() => onApplicationStart(listing)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Ariza Yuborish</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-colors duration-150 text-sm"
                  >
                    Ariza Yuborish Uchun Kiring
                  </button>
                )}
              </div>
            </motion.div>

            {/* Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
            >
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-3">
                Joylashuv
              </h3>
              <div className="rounded-xl overflow-hidden border border-surface-100 dark:border-surface-800">
                <DormitoryLocationMap
                  name={listing.title}
                  address={listing.location}
                  latitude={listing.coordinates?.lat || 0}
                  longitude={listing.coordinates?.lng || 0}
                  month_price={listing.price}
                  phone_number={listing.admin?.phone || ""}
                />
              </div>
              <p className="text-surface-600 dark:text-surface-300 mt-3 text-xs sm:text-sm">
                {listing.location} • {listing.university}
              </p>
            </motion.div>

            {/* Dormitory Capacity Details */}
            {listing.type === 'dormitory' && listing.room_statistics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                  Bo'sh joylar statistikasi
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Erkaklar</span>
                    </div>
                    <p className="text-2xl font-black text-brand-900 dark:text-brand-100">
                      {listing.room_statistics.male.free} <span className="text-xs font-medium opacity-70">joy</span>
                    </p>
                  </div>
                  <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Ayollar</span>
                    </div>
                    <p className="text-2xl font-black text-brand-900 dark:text-brand-100">
                      {listing.room_statistics.female.free} <span className="text-xs font-medium opacity-70">joy</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-800 dark:text-brand-200">Umumiy bo'sh joy:</span>
                  <span className="text-xl font-black text-brand-900 dark:text-brand-100">
                    {listing.room_statistics.male.free + listing.room_statistics.female.free}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
