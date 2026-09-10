import { apiClient } from '@/shared/api/axiosInstance';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import type {
  GetMyPostsResponse,
  GetPostByIdResponse,
} from '@/features/posts/types/posts.types';



export const postsApi = {


  // ===============================
  // GET MY POSTS
  // ===============================

  async getMyPosts(): Promise<FeedItem[]> {

    const response =
      await apiClient.get<GetMyPostsResponse>(
        '/news/me',
      );


    return response.data.data;

  },



  // ===============================
  // GET POST BY ID
  // ===============================

  async getPostById(
    postId:string,
  ):Promise<FeedItem>{


    const response =
      await apiClient.get<GetPostByIdResponse>(
        `/news/me/${postId}`,
      );


    return response.data.data;

  },



  // ===============================
  // UPDATE POST
  // ===============================

  async updatePost(
    postId:string,
    payload:Partial<FeedItem>,
  ):Promise<FeedItem>{


    const response =
      await apiClient.patch<GetPostByIdResponse>(
        `/news/${postId}`,
        payload,
      );


    return response.data.data;

  },



  // ===============================
  // UNPUBLISH POST
  // ===============================

  async unpublishPost(
    postId:string,
  ):Promise<FeedItem>{


    const response =
      await apiClient.patch<GetPostByIdResponse>(
        `/news/${postId}/unpublish`,
      );


    return response.data.data;

  },



  // ===============================
  // DELETE POST
  // ===============================

  async deletePost(
    postId:string,
  ):Promise<void>{


    await apiClient.delete(
      `/news/${postId}`,
    );

  },


};