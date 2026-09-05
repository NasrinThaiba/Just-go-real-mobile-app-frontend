import {
  apiClient,
} from '@/lib/api/apiClient';

import type {
  UpdateProfileInput,
  UpdateProfileResponse,
} from '../types/profile.types';



export async function updateProfile(
  input: UpdateProfileInput,
) {

  return apiClient<UpdateProfileResponse>(
    '/users/me',
    {

      method: 'PATCH',

      body: input,

    },
  );

}