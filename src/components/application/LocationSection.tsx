import React from 'react';
import { MapPin } from 'lucide-react';
import { ApplicationFormData, District, FieldRefSetter, Province } from './types';
import { inputClass, FieldError } from './shared';

interface LocationSectionProps {
  formData: Pick<ApplicationFormData, 'city' | 'village'>;
  errors: Partial<Record<'city' | 'village', string>>;
  provinces: Province[];
  districts: District[];
  selectedProvinceId: number | null;
  onCityChange: (value: string) => void;
  onVillageChange: (value: string) => void;
  registerFieldRef: FieldRefSetter;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  provinces,
  districts,
  selectedProvinceId,
  onCityChange,
  onVillageChange,
  registerFieldRef,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Viloyat <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <select
            value={formData.city}
            onChange={(e) => onCityChange(e.target.value)}
            ref={registerFieldRef('city')}
            className={inputClass(!!errors.city)}
          >
            <option value="">Viloyatni tanlang</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <FieldError message={errors.city} />
      </div>

      <div>
        <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
          Tuman/Shahar <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <select
            value={formData.village}
            onChange={(e) => onVillageChange(e.target.value)}
            disabled={!selectedProvinceId || districts.length === 0}
            ref={registerFieldRef('village')}
            className={inputClass(
              !!errors.village,
              !selectedProvinceId || districts.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
            )}
          >
            <option value="">
              {!selectedProvinceId
                ? 'Avval viloyatni tanlang'
                : districts.length === 0
                  ? 'Yuklanmoqda...'
                  : 'Tumanni tanlang'}
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <FieldError message={errors.village} />
      </div>
    </div>
  );
};

export default LocationSection;
