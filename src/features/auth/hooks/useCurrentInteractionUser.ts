import {
  useCallback,
  useState,
} from 'react';
import {
  useFocusEffect,
} from 'expo-router';

import {
  getAuthSession,
} from '@/features/auth/storage/authStorage';
import {
  getProfile,
} from '@/features/profile/storage/profileStorage';

import type {
  InteractionUser,
} from '@/features/interactions/types/interaction.types';

export function useCurrentInteractionUser() {
  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<InteractionUser | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const loadCurrentUser =
    useCallback(async () => {
      try {
        setIsLoading(true);

        const [
          session,
          profile,
        ] = await Promise.all([
          getAuthSession(),
          getProfile(),
        ]);

        const isLoggedIn =
          Boolean(
            session?.isAuthenticated,
          ) &&
          Boolean(
            session?.userId,
          );

        if (!isLoggedIn) {
          setCurrentUser(null);
          return;
        }

        const userId =
          profile?.id ||
          session?.userId;

        if (!userId) {
          setCurrentUser(null);
          return;
        }

        setCurrentUser({
          id: userId,
          name:
            profile?.name?.trim() ||
            'New User',
          role:
            profile?.role ===
            'admin'
              ? 'admin'
              : 'user',
        });
      } catch (error) {
        console.error(
          'Failed to load interaction user:',
          error,
        );

        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadCurrentUser();

      return undefined;
    }, [loadCurrentUser]),
  );

  return {
    currentUser,
    isLoading,
    refetch:
      loadCurrentUser,
  };
}