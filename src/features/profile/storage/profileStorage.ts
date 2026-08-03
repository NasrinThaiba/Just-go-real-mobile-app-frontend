// src/features/profile/storage/profileStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearAuthSession,
} from '@/features/auth/storage/authStorage';

import type {
  UserProfile,
} from '@/features/profile/types/profile.types';

const PROFILE_STORAGE_KEY =
  '@just-go-real/profile';

export async function getProfile(): Promise<
  UserProfile | null
> {
  try {
    const storedProfile =
      await AsyncStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(
      storedProfile,
    ) as UserProfile;
  } catch (error) {
    console.error(
      'Failed to load profile:',
      error,
    );

    return null;
  }
}

export async function saveProfile(
  profile: UserProfile,
): Promise<void> {
  await AsyncStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(
    PROFILE_STORAGE_KEY,
  );
}

export async function logoutUser(): Promise<void> {
  await Promise.all([
    clearAuthSession(),
    clearProfile(),
  ]);
}