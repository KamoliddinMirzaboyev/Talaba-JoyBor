import React from 'react';
import { Building, User, Users } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, FieldError } from './shared';

type AcademicField = 'faculty' | 'direction' | 'course' | 'group';

interface AcademicInfoSectionProps {
  formData: Pick<ApplicationFormData, AcademicField>;
  errors: Partial<Record<AcademicField, string>>;
  onFieldChange: (field: AcademicField, value: string) => void;
  registerFieldRef: FieldRefSetter;
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({
  formData,
  errors,
  onFieldChange,
  registerFieldRef,
}) => {
  return (
    <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Building className="w-4 h-4 text-brand-600" />
        O'quv Ma'lumotlari
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Fakultet
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={formData.faculty}
              onChange={(e) => onFieldChange('faculty', e.target.value)}
              ref={registerFieldRef('faculty')}
              className={inputClass(!!errors.faculty)}
              placeholder="Kompyuter injiniringi"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Yo'nalish
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={formData.direction}
              onChange={(e) => onFieldChange('direction', e.target.value)}
              ref={registerFieldRef('direction')}
              className={inputClass(!!errors.direction)}
              placeholder="Dasturiy injiniring"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Kurs <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <select
              value={formData.course}
              onChange={(e) => onFieldChange('course', e.target.value)}
              ref={registerFieldRef('course')}
              className={inputClass(!!errors.course)}
            >
              <option value="">Kursni tanlang</option>
              <option value="1-kurs">1-kurs</option>
              <option value="2-kurs">2-kurs</option>
              <option value="3-kurs">3-kurs</option>
              <option value="4-kurs">4-kurs</option>
              <option value="5-kurs">5-kurs</option>
            </select>
          </div>
          <FieldError message={errors.course} />
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Guruh
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={formData.group}
              onChange={(e) => onFieldChange('group', e.target.value)}
              ref={registerFieldRef('group')}
              className={inputClass(!!errors.group)}
              placeholder="KI-21-01"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoSection;
