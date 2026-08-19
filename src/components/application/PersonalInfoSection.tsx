import React from 'react';
import { User } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, selectClass, labelClass, FieldError } from './shared';

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
    <div className="grid grid-cols-2 gap-2.5">
      <div>
        <label className={labelClass}>
          Ism <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
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
        <label className={labelClass}>
          Familiya <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
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
        <label className={labelClass}>Otasining ismi</label>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
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
        <label className={labelClass}>
          Jins <span className="text-danger-500">*</span>
        </label>
        <select
          value={formData.gender}
          onChange={(e) => onFieldChange('gender', e.target.value)}
          ref={registerFieldRef('gender')}
          className={selectClass(!!errors.gender)}
        >
          <option value="">Tanlang</option>
          <option value="Erkak">Erkak</option>
          <option value="Ayol">Ayol</option>
        </select>
        <FieldError message={errors.gender} />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
