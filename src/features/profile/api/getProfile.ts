import {
  apiClient,
} from '@/lib/api/apiClient';

import type {
  GetProfileResponse,
} from '../types/profile.types';



export async function getProfile() {

  return apiClient<GetProfileResponse>(
    '/users/me',
    {
      method: 'GET',
    },
  );

}