// src/features/create-videos/api/video.api.ts

import {
  apiClient,
} from '@/shared/api/axiosInstance';

import type {
  CreateVideoPayload,
  VideoItem,
} from '../types/video.types';


// =====================================================
// CREATE VIDEO
// =====================================================

export async function createVideo(
  payload: CreateVideoPayload,
): Promise<VideoItem> {

  const response =
    await apiClient.post(
      '/videos',
      payload,
    );

  return response.data.data;
}


// =====================================================
// GET MY VIDEOS
// =====================================================

export async function getMyVideos(): Promise<VideoItem[]> {

  const response =
    await apiClient.get(
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
    response.data.data.items ??
    []
  );
}


// =====================================================
// GET MY VIDEO BY ID
// =====================================================

export async function getMyVideoById(
  id: string,
): Promise<VideoItem> {

  const response =
    await apiClient.get(
      `/videos/me/${id}`,
    );

  return response.data.data;
}


// =====================================================
// UPDATE VIDEO
// =====================================================

export async function updateVideo(
  id: string,
  payload: Partial<CreateVideoPayload>,
): Promise<VideoItem> {

  const response =
    await apiClient.patch(
      `/videos/${id}`,
      payload,
    );

  return response.data.data;
}