import type {
  VideoItem,
  CreateVideoInput,
  UpdateVideoInput,
} from '@/features/videos/types/videos.types';

export const videosApi = {
  async getVideos(): Promise<
    VideoItem[]
  > {
    throw new Error(
      'Backend API is not connected yet.',
    );
  },

  async getVideoById(
    id: string,
  ): Promise<VideoItem> {
    throw new Error(
      `Backend API is not connected for video ${id}.`,
    );
  },

  async createVideo(
    input: CreateVideoInput,
  ): Promise<VideoItem> {
    void input;

    throw new Error(
      'Backend API is not connected yet.',
    );
  },

  async updateVideo(
    id: string,
    input: UpdateVideoInput,
  ): Promise<VideoItem> {
    void id;
    void input;

    throw new Error(
      'Backend API is not connected yet.',
    );
  },

  async deleteVideo(
    id: string,
  ): Promise<void> {
    void id;

    throw new Error(
      'Backend API is not connected yet.',
    );
  },
};