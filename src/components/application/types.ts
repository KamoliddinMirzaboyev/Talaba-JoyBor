export interface ApplicationFormData {
  name: string;
  middle_name: string;
  familiya: string;
  gender: string;
  city: string;
  village: string;
  phone: string;
  passport: string;
  pinfl: string;
  faculty: string;
  direction: string;
  course: string;
  group: string;
  user_image?: File | null;
  comment: string;
  document?: File | null;
  passport_image_first?: File | null;
  passport_image_second?: File | null;
}

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  province: number;
}

export type FieldRefSetter = (
  key: string
) => (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => void;
