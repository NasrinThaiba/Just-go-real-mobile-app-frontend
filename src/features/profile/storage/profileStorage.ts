import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { UserProfile } from '@/features/profile/types/profile.types';
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/services/storage';

export async function getStoredProfile(): Promise<UserProfile | null> {
  return getStorageItem<UserProfile>(
    STORAGE_KEYS.PROFILE,
  );
}

export async function saveStoredProfile(
  profile: UserProfile,
): Promise<void> {
  await setStorageItem(
    STORAGE_KEYS.PROFILE,
    profile,
  );
}

export async function removeStoredProfile(): Promise<void> {
  await removeStorageItem(
    STORAGE_KEYS.PROFILE,
  );
}