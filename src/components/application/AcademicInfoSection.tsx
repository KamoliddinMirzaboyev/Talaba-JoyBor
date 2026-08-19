import React from 'react';
import { Building } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, selectClass, labelClass, sectionTitleClass, FieldError } from './shared';

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
    <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
      <h3 className={sectionTitleClass}>
        <Building className="w-3.5 h-3.5 text-brand-600" />
        O'quv ma'lumotlari
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="col-span-2">
          <label className={labelClass}>Fakultet</label>
          <input
            type="text"
            value={formData.faculty}
            onChange={(e) => onFieldChange('faculty', e.target.value)}
            ref={registerFieldRef('faculty')}
            className={inputClass(!!errors.faculty, '', 'px-3')}
            placeholder="Kompyuter injiniringi"
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Yo'nalish</label>
          <input
            type="text"
            value={formData.direction}
            onChange={(e) => onFieldChange('direction', e.target.value)}
            ref={registerFieldRef('direction')}
            className={inputClass(!!errors.direction, '', 'px-3')}
            placeholder="Dasturiy injiniring"
          />
        </div>

        <div>
          <label className={labelClass}>
            Kurs <span className="text-danger-500">*</span>
          </label>
          <select
            value={formData.course}
            onChange={(e) => onFieldChange('course', e.target.value)}
            ref={registerFieldRef('course')}
            className={selectClass(!!errors.course)}
          >
            <option value="">Tanlang</option>
            <option value="1-kurs">1-kurs</option>
            <option value="2-kurs">2-kurs</option>
            <option value="3-kurs">3-kurs</option>
            <option value="4-kurs">4-kurs</option>
            <option value="5-kurs">5-kurs</option>
          </select>
          <FieldError message={errors.course} />
        </div>

        <div>
          <label className={labelClass}>Guruh</label>
          <input
            type="text"
            value={formData.group}
            onChange={(e) => onFieldChange('group', e.target.value)}
            ref={registerFieldRef('group')}
            className={inputClass(!!errors.group, '', 'px-3')}
            placeholder="KI-21-01"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoSection;
