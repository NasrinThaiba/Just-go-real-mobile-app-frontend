// src/features/create-videos/api/video.api.ts

import {
  apiClient,
} from '@/shared/api/axiosInstance';

import type {
  CreateVideoPayload,
  VideoItem,
} from '../types/video.types';


// =====================================================
// UPLOAD RESULT
// =====================================================

export type VideoUploadResult = {

  fileUrl: string;

  key: string;

};


// =====================================================
// UPLOAD VIDEO
// =====================================================

export async function uploadVideoFile(
  asset: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  },
): Promise<VideoUploadResult> {


  const fileName =
    asset.fileName ??
    `video-${Date.now()}.mp4`;


  const contentType =
    asset.mimeType ??
    'video/mp4';


  console.log(
    'VIDEO UPLOAD START:',
    {
      fileName,
      contentType,
      uri: asset.uri,
    },
  );


  // ===================================================
  // 1. GET PRESIGNED PUT URL
  // ===================================================

  const uploadResponse =
    await apiClient.post(
      '/media/upload-url',
      {

        fileName,

        contentType,

        mediaType:
          'video',

      },
    );


  const uploadData =
    uploadResponse.data?.data;


  const uploadUrl =
    uploadData?.uploadUrl;


  const fileUrl =
    uploadData?.fileUrl;


  const key =
    uploadData?.key;


  console.log(
    'UPLOAD URL RESPONSE:',
    uploadData,
  );


  if (
    !uploadUrl ||
    !fileUrl ||
    !key
  ) {

    throw new Error(
      'Upload information was not returned by server',
    );

  }


  // ===================================================
  // 2. READ LOCAL VIDEO
  // ===================================================

  const response =
    await fetch(
      asset.uri,
    );


  if (!response.ok) {

    throw new Error(
      `Unable to read selected video: ${response.status}`,
    );

  }


  const blob =
    await response.blob();


  console.log(
    'VIDEO BLOB READY:',
    {
      size:
        blob.size,

      type:
        blob.type,
    },
  );


  // ===================================================
  // 3. PUT VIDEO INTO S3
  // ===================================================

  const s3Response =
    await fetch(
      uploadUrl,
      {

        method:
          'PUT',

        headers: {

          'Content-Type':
            contentType,

        },

        body:
          blob,

      },
    );


  if (!s3Response.ok) {

    const errorText =
      await s3Response
        .text()
        .catch(
          () => '',
        );


    console.error(
      'S3 UPLOAD ERROR:',
      s3Response.status,
      errorText,
    );


    throw new Error(
      `S3 upload failed: ${s3Response.status}`,
    );

  }


  console.log(
    'VIDEO UPLOAD SUCCESS:',
    {
      fileUrl,
      key,
    },
  );


  // ===================================================
  // 4. RETURN URL + KEY
  // ===================================================

  return {

    fileUrl,

    key,

  };

}


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

export async function getMyVideos():
  Promise<VideoItem[]> {

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
  payload:
    Partial<CreateVideoPayload>,
): Promise<VideoItem> {

  const response =
    await apiClient.patch(
      `/videos/${id}`,
      payload,
    );


  return response.data.data;

}