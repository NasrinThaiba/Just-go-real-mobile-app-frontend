import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getProfile,
} from '../api/getProfile';

import {
  updateProfile as updateProfileApi,
} from '../api/updateProfile';

import {
  useProfileStore,
} from '../store/profile.store';

import {
  saveProfile,
} from '../storage/profileStorage';

import type {
  UpdateProfileInput,
  UserProfile,
} from '../types/profile.types';


const EMPTY_PROFILE: UserProfile = {
  id: '',
  name: 'New User',
  phone: '',
  email: '',
  profileImage: '',
  role: 'reader',
  locationName: '',
  createdAt: '',
  updatedAt: '',
};


export function useProfile() {

  const profile =
    useProfileStore(
      (state) => state.profile,
    );


  const setProfile =
    useProfileStore(
      (state) => state.setProfile,
    );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);


  const loadProfile =
    useCallback(
      async () => {

        try {

          setIsLoading(true);


          const response =
            await getProfile();


          const user =
            response.data.user;


          setProfile(user);


          await saveProfile(user);


          return user;

        } catch (error) {

          console.error(
            'Failed to load profile:',
            error,
          );

          throw error;

        } finally {

          setIsLoading(false);

        }

      },
      [setProfile],
    );


  const updateProfile =
    useCallback(
      async (
        input: UpdateProfileInput,
      ) => {

        try {

          setIsUpdating(true);


          const response =
            await updateProfileApi(
              input,
            );


          const user =
            response.data.user;


          setProfile(user);


          await saveProfile(user);


          return user;

        } finally {

          setIsUpdating(false);

        }

      },
      [setProfile],
    );


  useEffect(() => {

    if (!profile) {

      void loadProfile();

    } else {

      setIsLoading(false);

    }

  }, [
    profile,
    loadProfile,
  ]);


  return {

    profile:
      profile ?? EMPTY_PROFILE,

    isLoading,

    isUpdating,

    loadProfile,

    updateProfile,

  };

}