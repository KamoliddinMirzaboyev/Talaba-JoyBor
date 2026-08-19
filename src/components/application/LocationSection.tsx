import React from 'react';
import { ApplicationFormData, District, FieldRefSetter, Province } from './types';
import { selectClass, labelClass, FieldError } from './shared';

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
    <div className="grid grid-cols-2 gap-2.5">
      <div>
        <label className={labelClass}>
          Viloyat <span className="text-danger-500">*</span>
        </label>
        <select
          value={formData.city}
          onChange={(e) => onCityChange(e.target.value)}
          ref={registerFieldRef('city')}
          className={selectClass(!!errors.city)}
        >
          <option value="">Tanlang</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.city} />
      </div>

      <div>
        <label className={labelClass}>
          Tuman <span className="text-danger-500">*</span>
        </label>
        <select
          value={formData.village}
          onChange={(e) => onVillageChange(e.target.value)}
          disabled={!selectedProvinceId}
          ref={registerFieldRef('village')}
          className={selectClass(
            !!errors.village,
            !selectedProvinceId ? 'opacity-60 cursor-not-allowed' : ''
          )}
        >
          <option value="">
            {!selectedProvinceId ? 'Avval viloyat' : districts.length === 0 ? 'Yuklanmoqda...' : 'Tanlang'}
          </option>
          {districts.map((district) => (
            <option key={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.village} />
      </div>
    </div>
  );
};

export default LocationSection;
