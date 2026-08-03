// src/features/profile/hooks/useProfile.ts

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getProfile,
  saveProfile,
} from '@/features/profile/storage/profileStorage';

import type {
  UpdateProfileInput,
  UserProfile,
} from '@/features/profile/types/profile.types';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local-user',
  name: 'User',
  phone: '',
  role: 'reader',
  profileImage: '',
  locationName: 'Tamil Nadu',
};

export function useProfile() {
  const [
    profile,
    setProfile,
  ] =
    useState<UserProfile>(
      DEFAULT_PROFILE,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const loadProfile =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedProfile =
          await getProfile();

        setProfile({
          ...DEFAULT_PROFILE,
          ...storedProfile,
        });
      } catch (loadError) {
        console.error(
          'Failed to load profile:',
          loadError,
        );

        setError(
          'Unable to load profile.',
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateProfile =
    useCallback(
      async (
        input: UpdateProfileInput,
      ) => {
        const updatedProfile: UserProfile =
          {
            ...profile,
            ...input,
          };

        await saveProfile(
          updatedProfile,
        );

        setProfile(
          updatedProfile,
        );

        return updatedProfile;
      },
      [profile],
    );

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: loadProfile,
  };
}