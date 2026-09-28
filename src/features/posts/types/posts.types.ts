import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';


export type MyPostFilter =
  | 'all'
  | 'news'
  | 'video'
  | 'published';


export type PostType =
  FeedItem['type'];


export type PostSummaryData = {

  totalPosts: number;

  totalNews: number;

  totalVideos: number;

  totalFavorites: number;

  totalViews: number;

  totalPublished: number;

};


// GET ALL MY POSTS
export type GetMyPostsResponse = {

  success: boolean;

  message?: string;

  data: {
    items: FeedItem[];
  };

};


// GET SINGLE POST
export type GetPostByIdResponse = {

  success: boolean;

  message?: string;

  data: {
    item: FeedItem;
  };

};


// UPDATE POST STATUS
export type UpdatePostStatusPayload = {

  status: PostStatus;

};


export type UpdatePostStatusResponse = {

  success: boolean;

  message?: string;

  data: {
    item: FeedItem;
  };

};


// DELETE POST
export type DeletePostResponse = {

  success: boolean;

  message?: string;

};


// QUERY PARAMS
export type PostsQueryParams = {

  type?: Exclude<
    MyPostFilter,
    'all' | 'published'
  >;

  status?: PostStatus;

  page?: number;

  limit?: number;

};