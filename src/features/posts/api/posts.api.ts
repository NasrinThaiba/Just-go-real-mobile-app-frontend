import {
  apiClient,
} from '@/shared/api/axiosInstance';


import type {
  FeedItem,
} from '@/features/news/types/news.types';


import type {
  GetMyPostsResponse,
  GetPostByIdResponse,
} from '@/features/posts/types/posts.types';


import {
  videosApi,
} from '@/features/videos/api/videos.api';


import type {
  VideoItem,
} from '@/features/videos/types/videos.types';


// =====================================================
// POSTS API
// =====================================================

export const postsApi = {


  // ===================================================
  // GET MY POSTS
  // NEWS + VIDEOS
  // ===================================================

  async getMyPosts(): Promise<FeedItem[]> {


    const [
      newsResponse,
      videos,
    ] = await Promise.all([


      // ===============================================
      // MY NEWS
      // ===============================================

      apiClient.get<GetMyPostsResponse>(
        '/news/me',
      ),


      // ===============================================
      // MY VIDEOS
      // ===============================================

      videosApi.getMyVideos(),

    ]);


    // =================================================
    // NEWS ITEMS
    // =================================================

    const newsItems =
      newsResponse.data.data.items ?? [];


    console.log(
      'MY NEWS:',
      JSON.stringify(
        newsItems,
        null,
        2,
      ),
    );


    // =================================================
    // VIDEO ITEMS
    // =================================================

    console.log(
      'MY VIDEOS:',
      JSON.stringify(
        videos,
        null,
        2,
      ),
    );


    // =================================================
    // CONVERT VIDEO → FEED ITEM
    // =================================================

    const videoItems: FeedItem[] =
      videos.map(
        (video: VideoItem) => ({

          // =========================================
          // BASIC
          // =========================================

          id:
            video.id,

          title:
            video.title,

          description:
            video.description ?? '',


          // =========================================
          // TYPE
          // =========================================

          type:
            'video',


          // =========================================
          // VIDEO
          // =========================================

          videoType:
            video.videoType,

          videoSource:
            video.videoSource ?? undefined,

          youtubeVideoId:
            video.youtubeVideoId ?? undefined,

          mediaUrl:
            video.mediaUrl ?? '',

          thumbnailUrl:
            video.thumbnailUrl ?? undefined,


          // =========================================
          // CONTENT
          // =========================================

          language:
            video.language,

          category:
            video.category ?? '',

          location:
            video.location ?? '',


          // =========================================
          // AUTHOR
          // =========================================

          author:
            video.authorId ?? '',


          // =========================================
          // ENGAGEMENT
          // =========================================

          views:
            Number(
              video.views ?? 0,
            ),

          likes:
            Number(
              video.likes ?? 0,
            ),


          // =========================================
          // STATUS
          // =========================================

          status:
            video.status,


          // =========================================
          // DATES
          // =========================================

          createdAt:
            video.createdAt,

          publishedAt:
            video.publishedAt ?? undefined,

        }),
      );


    // =================================================
    // COMBINE NEWS + VIDEOS
    // =================================================

    const allItems: FeedItem[] = [

      ...newsItems,

      ...videoItems,

    ];


    console.log(
      'MY ALL POSTS:',
      JSON.stringify(
        allItems,
        null,
        2,
      ),
    );


    return allItems;

  },


  // ===================================================
  // GET POST BY ID
  // ===================================================

  async getPostById(
    postId: string,
  ): Promise<FeedItem> {


    const response =
      await apiClient.get<GetPostByIdResponse>(
        `/news/me/${postId}`,
      );


    return response.data.data.item;

  },


  // ===================================================
  // UPDATE POST
  // ===================================================

  async updatePost(
    postId: string,
    payload: Partial<FeedItem>,
  ): Promise<FeedItem> {


    const response =
      await apiClient.patch<GetPostByIdResponse>(
        `/news/${postId}`,
        payload,
      );


    return response.data.data.item;

  },


  // ===================================================
  // UNPUBLISH POST
  // ===================================================

  async unpublishPost(
    postId: string,
  ): Promise<FeedItem> {


    const response =
      await apiClient.patch<GetPostByIdResponse>(
        `/news/${postId}/unpublish`,
      );


    return response.data.data.item;

  },


  // ===================================================
  // DELETE POST
  // ===================================================

  async deletePost(
    postId: string,
  ): Promise<void> {


    await apiClient.delete(
      `/news/${postId}`,
    );

  },


};