import {
  useState,
} from 'react';

import {
  uploadProfileImage,
} from '../api/uploadProfileImage';

import {
  useProfileStore,
} from '../store/profile.store';

import {
  saveProfile,
} from '../storage/profileStorage';



export function useUploadProfileImage() {

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
      imageUri: string,
    ) => {

      try {

        setIsLoading(true);

        setError(null);


        const user =
          await uploadProfileImage(
            imageUri,
          );


        /*
         * Update Zustand
         */
        setProfile(user);


        /*
         * Update local cache
         */
        await saveProfile(user);


        return user;

      } catch (error) {

        const normalizedError =
          error instanceof Error
            ? error
            : new Error(
                'Failed to upload profile image',
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