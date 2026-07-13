import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Building, CheckCircle, Phone } from 'lucide-react';
import { Listing } from '../../types';

interface ApplicationSidebarProps {
  selectedListing: Listing | null;
}

const ApplicationSidebar: React.FC<ApplicationSidebarProps> = ({ selectedListing }) => {
  return (
    <div className="lg:col-span-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-6 sticky top-8"
      >
        <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-brand-600" />
          Ariza Ma'lumotlari
        </h3>

        <div className="space-y-4">
          {selectedListing && (
            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900 dark:text-white">{selectedListing.title}</h4>
                  {selectedListing.university && (
                    <p className="text-sm text-surface-600 dark:text-surface-400">{selectedListing.university}</p>
                  )}
                </div>
              </div>
              <div className="bg-white dark:bg-surface-900 rounded-lg p-3 border border-brand-100 dark:border-brand-800">
                <p className="text-xs text-surface-700 dark:text-surface-300">
                  Siz ushbu yotoqxona uchun ariza yubormoqdasiz
                </p>
              </div>
            </div>
          )}

          <div className="bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-surface-600 dark:bg-surface-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-surface-900 dark:text-white mb-2">Muhim Eslatma</h4>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                  Barcha maydonlarni diqqat bilan to'ldiring. To'liq va aniq ma'lumotlar arizangizni tezroq ko'rib
                  chiqishga yordam beradi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-surface-900 dark:text-white mb-2">Tavsiyalar</h4>
                <ul className="text-sm text-surface-700 dark:text-surface-300 space-y-1.5">
                  <li>• Haqiqiy ma'lumotlarni kiriting</li>
                  <li>• Telefon raqamingiz faol bo'lsin</li>
                  <li>• Rasmlarni aniq tortib yuklang</li>
                  <li>• Qo'shimcha izohda o'zingiz haqida yozing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-xl p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-surface-600 dark:bg-surface-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-1">Yordam Kerakmi?</h4>
              <p className="text-xs text-surface-600 dark:text-surface-400">Savollaringiz bo'lsa, biz bilan bog'laning</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationSidebar;
