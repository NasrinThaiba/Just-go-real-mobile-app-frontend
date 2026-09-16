// src/features/news/api/news.api.ts

import { API_BASE_URL } from '@/services/apiClient';

import type {
  FeedItem,
  NewsType,
  SupportedLanguage,
} from '@/features/news/types/news.types';


// ======================================================
// RESPONSE TYPES
// ======================================================

type NewsListResponse = {
  message?: string;

  data?: {
    items?: FeedItem[];

    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };

  items?: FeedItem[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};


type NewsDetailsResponse = {
  message?: string;

  data?: {
    item?: FeedItem;
  };

  item?: FeedItem;
};


type NewsMutationResponse = {
  message?: string;

  data?: {
    item?: FeedItem;
  };

  item?: FeedItem;
};


// ======================================================
// CREATE NEWS PAYLOAD
// ======================================================

export type CreateNewsPayload = {
  title: string;

  description?: string;

  newsType?: NewsType;

  language?: SupportedLanguage;

  category?: string;

  location?: string;

  mediaUrl?: string;

  thumbnailUrl?: string;

  status?:
    | 'draft'
    | 'pending';
};


// ======================================================
// UPDATE NEWS PAYLOAD
// ======================================================

export type UpdateNewsPayload =
  Partial<CreateNewsPayload>;


// ======================================================
// LIST QUERY
// ======================================================

export type NewsListParams = {
  newsType?: NewsType;

  language?: SupportedLanguage;

  category?: string;

  location?: string;

  page?: number;

  limit?: number;
};


// ======================================================
// ACCESS TOKEN
// ======================================================

async function getAccessToken(): Promise<
  string | null
> {

  /*
   * IMPORTANT:
   *
   * Replace this with your existing
   * authentication token getter.
   *
   * Example if using SecureStore:
   *
   * const token =
   *   await SecureStore.getItemAsync(
   *     'accessToken',
   *   );
   *
   * return token;
   */

  return null;
}


// ======================================================
// AUTH HEADERS
// ======================================================

async function getAuthHeaders(): Promise<HeadersInit> {

  const token =
    await getAccessToken();


  if (!token) {
    return {};
  }


  return {
    Authorization:
      `Bearer ${token}`,
  };
}


// ======================================================
// ERROR MESSAGE
// ======================================================

async function getErrorMessage(
  response: Response,
): Promise<string> {

  try {

    const data =
      (await response.json()) as {
        message?: string;
        errors?: unknown;
      };


    if (data.message) {
      return data.message;
    }

  } catch {
    // Ignore invalid JSON response.
  }


  return `Request failed: ${response.status}`;
}


// ======================================================
// BUILD QUERY STRING
// ======================================================

function buildNewsQuery(
  params?: NewsListParams,
): string {

  if (!params) {
    return '';
  }


  const searchParams =
    new URLSearchParams();


  if (params.newsType) {

    searchParams.set(
      'newsType',
      params.newsType,
    );

  }


  if (params.language) {

    searchParams.set(
      'language',
      params.language,
    );

  }


  if (params.category) {

    searchParams.set(
      'category',
      params.category,
    );

  }


  if (params.location) {

    searchParams.set(
      'location',
      params.location,
    );

  }


  if (
    params.page !== undefined
  ) {

    searchParams.set(
      'page',
      String(params.page),
    );

  }


  if (
    params.limit !== undefined
  ) {

    searchParams.set(
      'limit',
      String(params.limit),
    );

  }


  const query =
    searchParams.toString();


  if (!query) {
    return '';
  }


  return `?${query}`;
}


// ======================================================
// EXTRACT LIST
// ======================================================

function extractNewsItems(
  response:
    | NewsListResponse
    | FeedItem[],
): FeedItem[] {

  // Direct array response
  if (
    Array.isArray(response)
  ) {

    return response;

  }


  // Backend:
  //
  // {
  //   data: {
  //     items: [...]
  //   }
  // }

  if (
    Array.isArray(
      response.data?.items,
    )
  ) {

    return response.data.items;

  }


  // Alternative:
  //
  // {
  //   items: [...]
  // }

  if (
    Array.isArray(
      response.items,
    )
  ) {

    return response.items;

  }


  return [];
}


// ======================================================
// EXTRACT SINGLE NEWS
// ======================================================

function extractNewsItem(
  response:
    | NewsDetailsResponse
    | NewsMutationResponse
    | FeedItem,
): FeedItem | null {

  // Direct FeedItem response
  if (
    'id' in response &&
    typeof response.id === 'string'
  ) {
    return response;
  }

  // Response with data.item
  if (
    'data' in response &&
    response.data &&
    'item' in response.data &&
    response.data.item
  ) {
    return response.data.item;
  }

  // Response with item directly
  if (
    'item' in response &&
    response.item
  ) {
    return response.item;
  }

  return null;
}


// ======================================================
// 1. GET PUBLISHED NEWS
// ======================================================
//
// GET /news
//
// Public API
// ======================================================

export async function getNews(
  params?: NewsListParams,
): Promise<FeedItem[]> {

  const query =
    buildNewsQuery(
      params,
    );


  const response =
    await fetch(
      `${API_BASE_URL}/news${query}`,
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsListResponse
      | FeedItem[];


  return extractNewsItems(
    data,
  );
}


// ======================================================
// 2. GET NEWS BY ID
// ======================================================
//
// GET /news/:id
//
// Public API
// ======================================================

export async function getNewsById(
  id: string,
): Promise<FeedItem | null> {

  if (!id) {
    return null;
  }


  const response =
    await fetch(
      `${API_BASE_URL}/news/${id}`,
    );


  if (!response.ok) {

    if (
      response.status === 404
    ) {

      return null;

    }


    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsDetailsResponse
      | FeedItem;


  return extractNewsItem(
    data,
  );
}


// ======================================================
// 3. GET BREAKING NEWS
// ======================================================
//
// GET /news/breaking
//
// Public API
// ======================================================

export async function getBreakingNews(
  params?: NewsListParams,
): Promise<FeedItem[]> {

  const query =
    buildNewsQuery(
      params,
    );


  const response =
    await fetch(
      `${API_BASE_URL}/news/breaking${query}`,
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsListResponse
      | FeedItem[];


  return extractNewsItems(
    data,
  );
}


// ======================================================
// 4. GET FEATURED NEWS
// ======================================================
//
// GET /news/featured
//
// Public API
// ======================================================

export async function getFeaturedNews(
  params?: NewsListParams,
): Promise<FeedItem[]> {

  const query =
    buildNewsQuery(
      params,
    );


  const response =
    await fetch(
      `${API_BASE_URL}/news/featured${query}`,
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsListResponse
      | FeedItem[];


  return extractNewsItems(
    data,
  );
}


// ======================================================
// 5. GET TRENDING NEWS
// ======================================================
//
// GET /news/trending
//
// Public API
// ======================================================

export async function getTrendingNews(
  params?: NewsListParams,
): Promise<FeedItem[]> {

  const query =
    buildNewsQuery(
      params,
    );


  const response =
    await fetch(
      `${API_BASE_URL}/news/trending${query}`,
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsListResponse
      | FeedItem[];


  return extractNewsItems(
    data,
  );
}


// ======================================================
// 6. GET MY NEWS
// ======================================================
//
// GET /news/me
//
// Authentication required
// ======================================================

export async function getMyNews(): Promise<
  FeedItem[]
> {

  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news/me`,
      {
        method: 'GET',

        headers: authHeaders,
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsListResponse
      | FeedItem[];


  return extractNewsItems(
    data,
  );
}


// ======================================================
// 7. GET MY NEWS BY ID
// ======================================================
//
// GET /news/me/:id
//
// Authentication required
// ======================================================

export async function getMyNewsById(
  id: string,
): Promise<FeedItem | null> {

  if (!id) {
    return null;
  }


  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news/me/${id}`,
      {
        method: 'GET',

        headers: authHeaders,
      },
    );


  if (!response.ok) {

    if (
      response.status === 404
    ) {

      return null;

    }


    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsDetailsResponse
      | FeedItem;


  return extractNewsItem(
    data,
  );
}


// ======================================================
// 8. CREATE NEWS
// ======================================================
//
// POST /news
//
// Authentication required
//
// Body:
//
// {
//   title,
//   description,
//   newsType,
//   language,
//   category,
//   location,
//   mediaUrl,
//   thumbnailUrl,
//   status
// }
// ======================================================

export async function createNews(
  payload: CreateNewsPayload,
): Promise<FeedItem> {

  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          ...authHeaders,
        },

        body:
          JSON.stringify(
            payload,
          ),
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsMutationResponse
      | FeedItem;


  const item =
    extractNewsItem(
      data,
    );


  if (!item) {

    throw new Error(
      'News created but no news item was returned.',
    );

  }


  return item;
}


// ======================================================
// 9. UPDATE NEWS
// ======================================================
//
// PATCH /news/:id
//
// Authentication required
// ======================================================

export async function updateNews(
  id: string,
  payload: UpdateNewsPayload,
): Promise<FeedItem> {

  if (!id) {

    throw new Error(
      'News ID is required.',
    );

  }


  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news/${id}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          ...authHeaders,
        },

        body:
          JSON.stringify(
            payload,
          ),
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsMutationResponse
      | FeedItem;


  const item =
    extractNewsItem(
      data,
    );


  if (!item) {

    throw new Error(
      'News updated but no news item was returned.',
    );

  }


  return item;
}


// ======================================================
// 10. UNPUBLISH NEWS
// ======================================================
//
// PATCH /news/:id/unpublish
//
// Authentication required
// ======================================================

export async function unpublishNews(
  id: string,
): Promise<FeedItem | null> {

  if (!id) {

    throw new Error(
      'News ID is required.',
    );

  }


  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news/${id}/unpublish`,
      {
        method: 'PATCH',

        headers: authHeaders,
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }


  const data =
    (await response.json()) as
      | NewsMutationResponse
      | FeedItem;


  return extractNewsItem(
    data,
  );
}


// ======================================================
// 11. DELETE NEWS
// ======================================================
//
// DELETE /news/:id
//
// Authentication required
// ======================================================

export async function deleteNews(
  id: string,
): Promise<void> {

  if (!id) {

    throw new Error(
      'News ID is required.',
    );

  }


  const authHeaders =
    await getAuthHeaders();


  const response =
    await fetch(
      `${API_BASE_URL}/news/${id}`,
      {
        method: 'DELETE',

        headers: authHeaders,
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }
}


// ======================================================
// 12. INCREMENT VIEW
// ======================================================
//
// POST /news/:id/view
//
// Public API
// ======================================================

export async function incrementNewsView(
  id: string,
): Promise<void> {

  if (!id) {
    return;
  }


  const response =
    await fetch(
      `${API_BASE_URL}/news/${id}/view`,
      {
        method: 'POST',
      },
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
      ),
    );

  }
}