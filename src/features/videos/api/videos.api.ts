import { API_BASE_URL } from '@/services/apiClient';

import type {
  VideoItem,
  CreateVideoInput,
  UpdateVideoInput,
} from '@/features/videos/types/videos.types';
import { apiClient } from '@/shared/api/axiosInstance';


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

    // IMPORTANT
    views:
      Number(item.views ?? 0),

    likes:
      Number(item.likes ?? 0),

  };

}


export const videosApi = {


  // =================================================
  // GET ALL VIDEOS
  // =================================================

  async getVideos(): Promise<VideoItem[]> {

    const response =
      await fetch(
        `${API_BASE_URL}/videos`,
      );


    if (!response.ok) {

      throw new Error(
        `Failed to fetch videos ${response.status}`,
      );

    }


    const result =
      await response.json() as VideoListResponse;


    return (
      result.data?.items?.map(
        normalizeVideo,
      ) ?? []
    );

  },


  // =================================================
  // GET MY VIDEOS
  // =================================================

  async getMyVideos(): Promise<VideoItem[]> {

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

},


  // =================================================
  // GET BREAKING VIDEOS
  // =================================================

  async getBreakingVideos(
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
      await fetch(
        `${API_BASE_URL}/videos/breaking?${query.toString()}`,
      );


    if (!response.ok) {

      throw new Error(
        `Failed to fetch breaking videos ${response.status}`,
      );

    }


    const result =
      await response.json() as VideoListResponse;


    return (
      result.data?.items?.map(
        normalizeVideo,
      ) ?? []
    );

  },


  // =================================================
  // GET VIDEO BY ID
  // =================================================

  async getVideoById(
    id: string,
  ): Promise<VideoItem | null> {

    if (!id) {
      return null;
    }


    const response =
      await fetch(
        `${API_BASE_URL}/videos/${id}`,
      );


    if (!response.ok) {

      if (response.status === 404) {
        return null;
      }


      throw new Error(
        `Failed to fetch video ${response.status}`,
      );

    }


    const result =
      await response.json() as VideoResponse;


    return result.data?.item
      ? normalizeVideo(
          result.data.item,
        )
      : null;

  },


  // =================================================
  // CREATE VIDEO
  // =================================================

  async createVideo(
    input: CreateVideoInput,
  ): Promise<VideoItem> {

    const response =
      await fetch(
        `${API_BASE_URL}/videos`,
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify(input),

        },
      );


    if (!response.ok) {

      const error =
        await response.text();


      throw new Error(
        error ||
        'Failed to create video',
      );

    }


    const result =
      await response.json() as VideoResponse;


    if (!result.data?.item) {

      throw new Error(
        'Video data missing',
      );

    }


    return normalizeVideo(
      result.data.item,
    );

  },


  // =================================================
  // UPDATE VIDEO
  // =================================================

  async updateVideo(
    id: string,
    input: UpdateVideoInput,
  ): Promise<VideoItem> {

    const response =
      await fetch(
        `${API_BASE_URL}/videos/${id}`,
        {

          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify(input),

        },
      );


    if (!response.ok) {

      throw new Error(
        `Failed to update video ${response.status}`,
      );

    }


    const result =
      await response.json() as VideoResponse;


    if (!result.data?.item) {

      throw new Error(
        'Updated video data missing',
      );

    }


    return normalizeVideo(
      result.data.item,
    );

  },


  // =================================================
  // DELETE VIDEO
  // =================================================

  async deleteVideo(
    id: string,
  ): Promise<void> {

    const response =
      await fetch(
        `${API_BASE_URL}/videos/${id}`,
        {
          method: 'DELETE',
        },
      );


    if (!response.ok) {

      throw new Error(
        `Failed to delete video ${response.status}`,
      );

    }

  },

};