import AsyncStorage from
  '@react-native-async-storage/async-storage';

import type {
  UserProfile,
} from '../types/profile.types';


const PROFILE_KEY =
  '@jgr/profile';



export async function saveProfile(
  profile: UserProfile,
): Promise<void> {

  await AsyncStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile),
  );

}



export async function getProfile():
  Promise<UserProfile | null> {

  try {

    const stored =
      await AsyncStorage.getItem(
        PROFILE_KEY,
      );


    if (!stored) {
      return null;
    }


    return JSON.parse(
      stored,
    ) as UserProfile;

  } catch (error) {

    console.error(
      'Failed to read profile:',
      error,
    );

    return null;

  }

}



export async function clearProfile():
  Promise<void> {

  await AsyncStorage.removeItem(
    PROFILE_KEY,
  );

}