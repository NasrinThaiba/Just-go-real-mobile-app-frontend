import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  UserProfile,
} from '@/features/profile/types/profile.types';

const PROFILE_KEY =
  '@just_go_real/user_profile';

export async function saveProfile(
  profile: UserProfile,
): Promise<void> {
  await AsyncStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile),
  );
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const storedProfile =
      await AsyncStorage.getItem(
        PROFILE_KEY,
      );

    if (!storedProfile) {
      return null;
    }

    const parsedProfile =
      JSON.parse(
        storedProfile,
      ) as Partial<UserProfile>;

    if (!parsedProfile.id) {
      return null;
    }

    return {
      id: parsedProfile.id,
      name:
        parsedProfile.name ??
        'New User',
      phone:
        parsedProfile.phone ?? '',
      email:
        parsedProfile.email ?? '',
      role:
        parsedProfile.role ===
        'admin'
          ? 'admin'
          : 'reader',
      profileImage:
        parsedProfile.profileImage ??
        '',
      locationName:
        parsedProfile.locationName ??
        'Tamil Nadu',
    };
  } catch (error) {
    console.error(
      'Failed to get profile:',
      error,
    );

    return null;
  }
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(
    PROFILE_KEY,
  );
}