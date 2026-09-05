export type ProfileRole =
  | 'reader'
  | 'admin';

export type UserProfile = {
  id: string;

  name: string;

  phone: string;

  email: string;

  profileImage: string;

  role: ProfileRole;

  locationName: string;

  createdAt: string;

  updatedAt: string;
};

export type GetProfileResponse = {
  message: string;

  data: {
    user: UserProfile;
  };
};

export type UpdateProfileInput = {
  name?: string;

  email?: string;

  profileImage?: string;
};

export type UpdateProfileResponse = {
  message: string;

  data: {
    user: UserProfile;
  };
};