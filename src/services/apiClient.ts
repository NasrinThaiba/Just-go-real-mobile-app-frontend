import { CONFIG } from '@/constants/config';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = CONFIG.apiBaseUrl;

type ApiRequestOptions = RequestInit & {
  requiresAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown = null,
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function getAccessToken() {
  return AsyncStorage.getItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get('content-type');

  if (
    contentType?.includes(
      'application/json',
    )
  ) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    requiresAuth = false,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders =
    new Headers(headers);

  if (
    !requestHeaders.has(
      'Content-Type',
    ) &&
    !(requestOptions.body instanceof FormData)
  ) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    );
  }

  if (requiresAuth) {
    const token =
      await getAccessToken();

    if (token) {
      requestHeaders.set(
        'Authorization',
        `Bearer ${token}`,
      );
    }
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...requestOptions,
        headers: requestHeaders,
      },
    );
  } catch {
    throw new ApiError(
      'Network connection failed.',
      0,
    );
  }

  const data =
    await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(
      message,
      response.status,
      data,
    );
  }

  return data as T;
}

export function apiGet<T>(
  endpoint: string,
  requiresAuth = false,
) {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    requiresAuth,
  });
}

export function apiPost<
  TResponse,
  TBody = unknown,
>(
  endpoint: string,
  body: TBody,
  requiresAuth = false,
) {
  return apiRequest<TResponse>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
      requiresAuth,
    },
  );
}

export function apiPatch<
  TResponse,
  TBody = unknown,
>(
  endpoint: string,
  body: TBody,
  requiresAuth = false,
) {
  return apiRequest<TResponse>(
    endpoint,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      requiresAuth,
    },
  );
}

export function apiPut<
  TResponse,
  TBody = unknown,
>(
  endpoint: string,
  body: TBody,
  requiresAuth = false,
) {
  return apiRequest<TResponse>(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(body),
      requiresAuth,
    },
  );
}

export function apiDelete<T>(
  endpoint: string,
  requiresAuth = false,
) {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    requiresAuth,
  });
}

export function uploadFormData<T>(
  endpoint: string,
  formData: FormData,
  requiresAuth = true,
) {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: formData,
    requiresAuth,
  });
}