// src/features/posts/api/posts.api.ts

import { apiClient } from '@/shared/api/axiosInstance';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

import type {
  GetMyPostsResponse,
  GetPostByIdResponse,
  UpdatePostStatusResponse,
} from '@/features/posts/types/posts.types';

export const postsApi = {
  async getMyPosts(): Promise<FeedItem[]> {
    const response =
      await apiClient.get<GetMyPostsResponse>(
        '/posts/me',
      );

    return response.data.data;
  },

  async getPostById(
    postId: string,
  ): Promise<FeedItem> {
    const response =
      await apiClient.get<GetPostByIdResponse>(
        `/posts/${postId}`,
      );

    return response.data.data;
  },

  async updatePostStatus(
    postId: string,
    status: PostStatus,
  ): Promise<FeedItem> {
    const response =
      await apiClient.patch<UpdatePostStatusResponse>(
        `/posts/${postId}/status`,
        {
          status,
        },
      );

    return response.data.data;
  },

  async deletePost(
    postId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/posts/${postId}`,
    );
  },
};