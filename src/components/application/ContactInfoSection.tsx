import React from 'react';
import { FileText, Hash, Phone } from 'lucide-react';
import { ApplicationFormData, FieldRefSetter } from './types';
import { inputClass, labelClass, sectionTitleClass, FieldError } from './shared';

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
    <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
      <h3 className={sectionTitleClass}>
        <Phone className="w-3.5 h-3.5 text-brand-600" />
        Aloqa
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className={labelClass}>Telefon</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-500">
              +998
            </span>
            <input
              type="tel"
              value={formData.phone.replace(/^\+?998/, '').replace(/\D/g, '').slice(0, 9)}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 9) value = value.substring(0, 9);
                onPhoneChange('998' + value);
              }}
              ref={registerFieldRef('phone')}
              className={inputClass(!!errors.phone, '', 'pl-12')}
              placeholder="901234567"
              maxLength={9}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>

        <div>
          <label className={labelClass}>Pasport</label>
          <div className="relative">
            <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
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

        <div className="col-span-2">
          <label className={labelClass}>JSHSHIR</label>
          <div className="relative">
            <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="text"
              value={formData.pinfl}
              onChange={(e) => onPinflChange(e.target.value)}
              ref={registerFieldRef('pinfl')}
              className={inputClass(!!errors.pinfl)}
              placeholder="14 ta raqam"
              maxLength={14}
            />
          </div>
          <FieldError message={errors.pinfl} />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
