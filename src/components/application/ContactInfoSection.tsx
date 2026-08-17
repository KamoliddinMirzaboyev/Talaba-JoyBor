import React from 'react';
import { FileText, Hash, Phone } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, FieldError } from './shared';

interface ContactInfoSectionProps {
  formData: Pick<ApplicationFormData, 'phone' | 'passport' | 'pinfl'>;
  errors: Partial<Record<'phone' | 'passport' | 'pinfl', string>>;
  onPhoneChange: (fullNumber: string) => void;
  onPassportChange: (value: string) => void;
  onPinflChange: (value: string) => void;
  registerFieldRef: FieldRefSetter;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  errors,
  onPhoneChange,
  onPassportChange,
  onPinflChange,
  registerFieldRef,
}) => {
  return (
    <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Phone className="w-4 h-4 text-brand-600" />
        Bog'lanish va Shaxsiy Ma'lumotlar
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Telefon Raqam
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-surface-600 dark:text-surface-400 font-medium">
              +998
            </div>
            <input
              type="tel"
              value={formData.phone.replace(/^\+?998/, '').replace(/\D/g, '').slice(0, 9)}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 9) value = value.substring(0, 9);
                onPhoneChange('998' + value);
              }}
              ref={registerFieldRef('phone')}
              className={inputClass(!!errors.phone, '', 'pl-20')}
              placeholder="901234567"
              maxLength={9}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Pasport Raqami
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={formData.passport}
              onChange={(e) => onPassportChange(e.target.value)}
              ref={registerFieldRef('passport')}
              className={inputClass(!!errors.passport)}
              placeholder="AA1234567"
              maxLength={9}
            />
          </div>
          <FieldError message={errors.passport} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            JSHSHIR (PINFL) <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={formData.pinfl}
              onChange={(e) => onPinflChange(e.target.value)}
              ref={registerFieldRef('pinfl')}
              className={inputClass(!!errors.pinfl)}
              placeholder="14 ta raqamni kiriting"
              maxLength={14}
            />
          </div>
          <div className="text-[10px] text-surface-400 mt-1 uppercase tracking-tight">
            Pasportingizdagi 14 xonali raqam (PINFL)
          </div>
          <FieldError message={errors.pinfl} />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
