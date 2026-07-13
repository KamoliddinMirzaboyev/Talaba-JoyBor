import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Home,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Phone,
    FileText,
    Building,
    User,
    MessageSquare,
    Download,
    Eye,
    Mail,
} from "lucide-react";
import { Application } from "../types";
import { statusTone, statusLabel, statusDescription } from "../utils/applicationStatus";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { formatPhoneNumber } from "../utils/format";
import { authAPI } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { formatDateTime } from "../utils/format";

const ApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sahifa yuklanganda yuqoriga scroll qilish
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // API dan ariza ma'lumotlarini yuklash
    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) {
                setError("Ariza ID topilmadi");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Bu yerda real API chaqiruvi bo'lishi kerak
                // Hozircha barcha arizalarni olib, kerakli arizani topamiz
                const applications = await authAPI.getApplications();
                const foundApplication = applications.find(app => app.id.toString() === id);

                if (foundApplication) {
                    setApplication(foundApplication);
                } else {
                    setError("Ariza topilmadi");
                }
            } catch (error) {
                setError("Ariza yuklanishda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        if (user && id) {
            fetchApplication();
        }
    }, [user, id]);

    if (!user) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
                        Tizimga kirish talab etiladi
                    </h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-150"
                    >
                        Tizimga kirish
                    </button>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (statusTone(status)) {
            case "approved":
            case "completed":
                return <CheckCircle className="w-6 h-6 text-success-500" />;
            case "pending":
                return <Clock className="w-6 h-6 text-warning-500" />;
            case "rejected":
                return <XCircle className="w-6 h-6 text-danger-500" />;
            case "interview":
                return <AlertCircle className="w-6 h-6 text-brand-500" />;
            default:
                return <Clock className="w-6 h-6 text-surface-500" />;
        }
    };

    const getStatusText = statusLabel;

    const getStatusColor = (status: string) => {
        switch (statusTone(status)) {
            case "approved":
            case "completed":
                return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300 border-success-200 dark:border-success-800";
            case "pending":
                return "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300 border-warning-200 dark:border-warning-800";
            case "rejected":
                return "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300 border-danger-200 dark:border-danger-800";
            case "interview":
                return "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300 border-brand-200 dark:border-brand-800";
            default:
                return "bg-surface-100 text-surface-800 dark:bg-surface-900/30 dark:text-surface-300 border-surface-200 dark:border-surface-800";
        }
    };

    const getStatusDescription = statusDescription;

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
                    <Skeleton className="h-40 w-full rounded-2xl" count={3} />
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
                <Header />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <EmptyState
                        icon={XCircle}
                        title="Xatolik yuz berdi"
                        description={error || "Ariza topilmadi"}
                        action={{ label: "Arizalar ro'yxatiga qaytish", onClick: () => navigate("/applications") }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/applications')}
                    className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors duration-150"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Arizalar ro'yxatiga qaytish
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-brand-600" />
                            Ariza Tafsilotlari
                        </h1>
                        <div className="text-right">
                            <p className="text-sm text-surface-600 dark:text-surface-400">Ariza ID</p>
                            <p className="text-lg font-semibold text-surface-900 dark:text-white">#{application.id}</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`rounded-2xl shadow-sm p-6 border-2 ${getStatusColor(application.status)}`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {getStatusIcon(application.status)}
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {getStatusText(application.status)}
                                    </h2>
                                    <p className="text-sm opacity-80">
                                        {getStatusDescription(application.status)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Jarayon</span>
                                    <span>
                                        {statusTone(application.status) === 'pending' ? '25%' :
                                            statusTone(application.status) === 'interview' ? '75%' :
                                                statusTone(application.status) === 'approved' || statusTone(application.status) === 'completed' ? '100%' :
                                                    statusTone(application.status) === 'rejected' ? '100%' : '0%'}
                                    </span>
                                </div>
                                <div className="w-full bg-white/30 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${statusTone(application.status) === 'pending' ? 'bg-warning-600 w-1/4' :
                                            statusTone(application.status) === 'interview' ? 'bg-brand-600 w-3/4' :
                                                statusTone(application.status) === 'approved' || statusTone(application.status) === 'completed' ? 'bg-success-600 w-full' :
                                                    statusTone(application.status) === 'rejected' ? 'bg-danger-600 w-full' : 'bg-surface-400 w-0'
                                            }`}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Dormitory Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                        >
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <Home className="w-5 h-5 text-brand-600" />
                                Yotoqxona Ma'lumotlari
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                                        {application.dormitory?.name || 'Yotoqxona nomi'}
                                    </h4>
                                    <p className="text-surface-600 dark:text-surface-400">
                                        {application.dormitory?.university?.name || application.university || 'Universitet'}
                                    </p>
                                </div>

                                {application.dormitory?.address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-surface-500 mt-1" />
                                        <p className="text-surface-600 dark:text-surface-400">
                                            {application.dormitory.address}
                                        </p>
                                    </div>
                                )}

                                {application.dormitory?.description && (
                                    <div>
                                        <p className="text-surface-600 dark:text-surface-400">
                                            {application.dormitory.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                        >
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-brand-600" />
                                Shaxsiy Ma'lumotlar
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                        To'liq ism
                                    </label>
                                    <p className="text-surface-900 dark:text-white font-semibold">
                                        {application.fio} {application.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                        Telefon raqam
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-surface-500" />
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {formatPhoneNumber('+' + String(application.phone))}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                        Manzil
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-surface-500" />
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {application.city}, {application.village}
                                        </p>
                                    </div>
                                </div>

                                {application.passport && (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                            Pasport raqami
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-surface-500" />
                                            <p className="text-surface-900 dark:text-white font-semibold">
                                                {application.passport}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Academic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                        >
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-brand-600" />
                                O'quv Ma'lumotlari
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {application.faculty && (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                            Fakultet
                                        </label>
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {application.faculty}
                                        </p>
                                    </div>
                                )}

                                {application.direction && (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                            Yo'nalish
                                        </label>
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {application.direction}
                                        </p>
                                    </div>
                                )}

                                {application.course && (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                            Kurs
                                        </label>
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {application.course}-kurs
                                        </p>
                                    </div>
                                )}

                                {application.group && (
                                    <div>
                                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                                            Guruh
                                        </label>
                                        <p className="text-surface-900 dark:text-white font-semibold">
                                            {application.group}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Comment */}
                        {application.comment && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                            >
                                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-brand-600" />
                                    Qo'shimcha Izoh
                                </h3>

                                <div className={`p-4 rounded-xl border-l-4 border-brand-500 ${theme === "dark"
                                    ? "text-surface-300 bg-surface-700"
                                    : "text-surface-700 bg-surface-50"
                                    }`}>
                                    <p>{application.comment}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                        >
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-brand-600" />
                                Vaqt Jadvali
                            </h3>

                            <div className="space-y-4">
                                {application.created_at && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-brand-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-medium text-surface-900 dark:text-white">
                                                Ariza yuborildi
                                            </p>
                                            <p className="text-xs text-surface-500 dark:text-surface-400">
                                                {formatDateTime(application.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${statusTone(application.status) === 'pending' ? 'bg-warning-500' :
                                        statusTone(application.status) === 'interview' ? 'bg-brand-500' :
                                            statusTone(application.status) === 'approved' ? 'bg-success-500' :
                                                statusTone(application.status) === 'rejected' ? 'bg-danger-500' :
                                                    'bg-surface-400'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900 dark:text-white">
                                            {getStatusText(application.status)}
                                        </p>
                                        <p className="text-xs text-surface-500 dark:text-surface-400">
                                            Joriy holat
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-6"
                        >
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                                Harakatlar
                            </h3>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.print()}
                                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:shadow-md transition-all duration-150"
                                >
                                    <Download className="w-5 h-5" />
                                    <span className="font-medium">Chop etish</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/listing/${application.dormitory?.id || ''}`)}
                                    className="w-full flex items-center gap-3 p-3 border-2 border-brand-600 text-brand-600 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-150"
                                >
                                    <Eye className="w-5 h-5" />
                                    <span className="font-medium">Yotoqxonani ko'rish</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/messages")}
                                    className="w-full flex items-center gap-3 p-3 border-2 border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-all duration-150"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">Xabar yuborish</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-gradient-to-br from-brand-50 via-brand-50 to-success-50 dark:from-brand-900/20 dark:via-brand-900/20 dark:to-success-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-xl">📞</span>
                                Yordam Kerakmi?
                            </h3>

                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                                Agar savollaringiz bo'lsa, biz bilan bog'laning
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/contact")}
                                className="w-full bg-gradient-to-r from-brand-600 to-brand-600 text-white py-2 rounded-xl font-medium hover:shadow-md transition-all duration-150"
                            >
                                Bog'lanish
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;