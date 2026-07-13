import React from 'react';
import { User, Users } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, FieldError } from './shared';

type PersonalField = 'name' | 'familiya' | 'middle_name' | 'gender';

interface PersonalInfoSectionProps {
  formData: Pick<ApplicationFormData, PersonalField>;
  errors: Partial<Record<PersonalField, string>>;
  onFieldChange: (field: PersonalField, value: string) => void;
  registerFieldRef: FieldRefSetter;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  errors,
  onFieldChange,
  registerFieldRef,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Ism <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            ref={registerFieldRef('name')}
            className={inputClass(!!errors.name)}
            placeholder="Aziz"
          />
        </div>
        <FieldError message={errors.name} />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Familiya <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={formData.familiya}
            onChange={(e) => onFieldChange('familiya', e.target.value)}
            ref={registerFieldRef('familiya')}
            className={inputClass(!!errors.familiya)}
            placeholder="Karimov"
          />
        </div>
        <FieldError message={errors.familiya} />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Otasining ismi
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={formData.middle_name}
            onChange={(e) => onFieldChange('middle_name', e.target.value)}
            ref={registerFieldRef('middle_name')}
            className={inputClass(!!errors.middle_name)}
            placeholder="Akramovich"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Jins <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <select
            value={formData.gender}
            onChange={(e) => onFieldChange('gender', e.target.value)}
            ref={registerFieldRef('gender')}
            className={inputClass(!!errors.gender)}
          >
            <option value="">Tanlang</option>
            <option value="Erkak">Erkak</option>
            <option value="Ayol">Ayol</option>
          </select>
        </div>
        <FieldError message={errors.gender} />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
