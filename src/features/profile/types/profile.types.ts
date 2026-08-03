// src/features/profile/types/profile.types.ts

export type ProfileRole =
  | 'reader'
  | 'reporter'
  | 'editor'
  | 'admin';

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: ProfileRole;
  profileImage: string;
  locationName?: string;
};

export type UpdateProfileInput =
  Partial<Omit<UserProfile, 'id'>>;