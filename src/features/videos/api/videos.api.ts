import {
  API_BASE_URL,
} from '@/services/apiClient';

import {
  apiClient,
} from '@/shared/api/axiosInstance';

import type {
  VideoItem,
  CreateVideoInput,
  UpdateVideoInput,
} from '@/features/videos/types/videos.types';


type VideoListResponse = {
  message?: string;

  data?: {
    items?: VideoItem[];
  };
};


type VideoResponse = {
  message?: string;

  data?: {
    item?: VideoItem;
  };
};


// =====================================================
// NORMALIZE VIDEO
// =====================================================

function normalizeVideo(
  item: any,
): VideoItem {

  return {
    ...item,

    type:
      item.type?.toLowerCase(),

    language:
      item.language?.toLowerCase(),

    videoType:
      item.videoType?.toLowerCase(),

    videoSource:
      item.videoSource?.toLowerCase(),

    status:
      item.status?.toLowerCase(),

    views:
      Number(item.views ?? 0),

    likes:
      Number(item.likes ?? 0),
  };
}


// =====================================================
// GET ALL VIDEOS
// =====================================================

export async function getVideos(): Promise<VideoItem[]> {

  const response =
    await apiClient.get<VideoListResponse>(
      '/videos',
    );

  return (
    response.data.data?.items?.map(
      normalizeVideo,
    ) ?? []
  );
}


// =====================================================
// GET MY VIDEOS
// =====================================================

export async function getMyVideos(): Promise<VideoItem[]> {

  const response =
    await apiClient.get<VideoListResponse>(
      '/videos/me',
    );

  console.log(
    'MY VIDEOS RESPONSE:',
    JSON.stringify(
      response.data,
      null,
      2,
    ),
  );

  return (
    response.data.data?.items?.map(
      normalizeVideo,
    ) ?? []
  );
}


// =====================================================
// GET BREAKING VIDEOS
// =====================================================

export async function getBreakingVideos(
  params: {
    language?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<VideoItem[]> {

  const query =
    new URLSearchParams();

  if (params.language) {
    query.append(
      'language',
      params.language,
    );
  }

  query.append(
    'page',
    String(
      params.page ?? 1,
    ),
  );

  query.append(
    'limit',
    String(
      params.limit ?? 20,
    ),
  );

  const response =
    await apiClient.get<VideoListResponse>(
      `/videos/breaking?${query.toString()}`,
    );

  return (
    response.data.data?.items?.map(
      normalizeVideo,
    ) ?? []
  );
}


// =====================================================
// GET LATEST VIDEOS
// =====================================================

export async function getLatestVideos(
  params: {
    language?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<VideoItem[]> {

  const query =
    new URLSearchParams();

  if (params.language) {
    query.append(
      'language',
      params.language,
    );
  }

  query.append(
    'page',
    String(
      params.page ?? 1,
    ),
  );

  query.append(
    'limit',
    String(
      params.limit ?? 20,
    ),
  );

  const response =
    await apiClient.get<VideoListResponse>(
      `/videos/latest?${query.toString()}`,
    );

  return (
    response.data.data?.items?.map(
      normalizeVideo,
    ) ?? []
  );
}


// =====================================================
// GET LIVE VIDEOS
// =====================================================

export async function getLiveVideos(
  params: {
    language?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<VideoItem[]> {

  const query =
    new URLSearchParams();

  if (params.language) {
    query.append(
      'language',
      params.language,
    );
  }

  query.append(
    'page',
    String(
      params.page ?? 1,
    ),
  );

  query.append(
    'limit',
    String(
      params.limit ?? 20,
    ),
  );

  const response =
    await apiClient.get<VideoListResponse>(
      `/videos/live?${query.toString()}`,
    );

  return (
    response.data.data?.items?.map(
      normalizeVideo,
    ) ?? []
  );
}


// =====================================================
// GET VIDEO BY ID
// =====================================================

export async function getVideoById(
  id: string,
): Promise<VideoItem | null> {

  if (!id) {
    return null;
  }

  const response =
    await apiClient.get<VideoResponse>(
      `/videos/${id}`,
    );

  return response.data.data?.item
    ? normalizeVideo(
        response.data.data.item,
      )
    : null;
}


// =====================================================
// UPDATE VIDEO
// =====================================================

export async function updateVideo(
  id: string,
  input: UpdateVideoInput,
): Promise<VideoItem> {

  const response =
    await apiClient.patch<VideoResponse>(
      `/videos/${id}`,
      input,
    );

  if (!response.data.data?.item) {
    throw new Error(
      'Updated video data missing',
    );
  }

  return normalizeVideo(
    response.data.data.item,
  );
}


// =====================================================
// DELETE VIDEO
// =====================================================

export async function deleteVideo(
  id: string,
): Promise<void> {

  await apiClient.delete(
    `/videos/${id}`,
  );
}


// =====================================================
// EXPORT OBJECT
// =====================================================

export const videosApi = {

  getVideos,

  getMyVideos,

  getBreakingVideos,

  getLatestVideos,

  getLiveVideos,

  getVideoById,

  updateVideo,

  deleteVideo,

};