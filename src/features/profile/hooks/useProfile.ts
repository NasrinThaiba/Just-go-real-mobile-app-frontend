import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getStoredProfile,
  saveStoredProfile,
} from '@/features/profile/storage/profileStorage';
import type {
  UserProfile,
  UpdateProfileInput,
} from '@/features/profile/types/profile.types';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  phone: '',
  profileImage: '',
};

export function useProfile() {
  const [profile, setProfile] =
    useState<UserProfile>(
      DEFAULT_PROFILE,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const loadProfile = useCallback(
    async () => {
      try {
        setIsLoading(true);

        const storedProfile =
          await getStoredProfile();

        if (storedProfile) {
          setProfile(storedProfile);
        }
      } catch (error) {
        console.error(
          'Failed to load profile:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(
    async (
      input: UpdateProfileInput,
    ) => {
      const updatedProfile: UserProfile = {
        ...profile,
        ...input,
      };

      await saveStoredProfile(
        updatedProfile,
      );

      setProfile(updatedProfile);

      return updatedProfile;
    },
    [profile],
  );

  return {
    profile,
    isLoading,
    updateProfile,
    refetch: loadProfile,
  };
}