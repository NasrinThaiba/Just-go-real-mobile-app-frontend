import {
  useState,
} from 'react';

import {
  updateProfile,
} from '../api/updateProfile';

import {
  useProfileStore,
} from '../store/profile.store';

import {
  saveProfile,
} from '../storage/profileStorage';

import type {
  UpdateProfileInput,
} from '../types/profile.types';



export function useUpdateProfile() {

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<Error | null>(
    null,
  );


  const setProfile =
    useProfileStore(
      (state) =>
        state.setProfile,
    );



  const mutate =
    async (
      input: UpdateProfileInput,
    ) => {

      try {

        setIsLoading(true);

        setError(null);


        const response =
          await updateProfile(
            input,
          );


        const user =
          response.data.user;


        setProfile(user);


        await saveProfile(user);


        return user;

      } catch (error) {

        const normalizedError =
          error instanceof Error
            ? error
            : new Error(
                'Failed to update profile',
              );


        setError(
          normalizedError,
        );


        throw normalizedError;

      } finally {

        setIsLoading(false);

      }

    };



  return {

    mutate,

    isLoading,

    error,

  };

}