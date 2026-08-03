import axios from 'axios';

export const apiClient =
  axios.create({
    baseURL:
      process.env
        .EXPO_PUBLIC_API_BASE_URL ??
      'http://localhost:8000/api/v1',

    timeout: 15000,

    headers: {
      'Content-Type':
        'application/json',
    },
  });