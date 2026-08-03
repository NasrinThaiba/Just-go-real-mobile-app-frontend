import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

export type MyPostFilter =
  | 'all'
  | 'news'
  | 'video';

export type PostType =
  FeedItem['type'];

export type PostSummaryData = {
  totalPosts: number;
  totalNews: number;
  totalVideos: number;
  totalFavorites: number;
  totalViews: number;
};

export type GetMyPostsResponse = {
  success: boolean;
  message?: string;
  data: FeedItem[];
};

export type GetPostByIdResponse = {
  success: boolean;
  message?: string;
  data: FeedItem;
};

export type UpdatePostStatusPayload = {
  status: PostStatus;
};

export type UpdatePostStatusResponse = {
  success: boolean;
  message?: string;
  data: FeedItem;
};

export type DeletePostResponse = {
  success: boolean;
  message?: string;
};

export type PostsQueryParams = {
  type?: Exclude<MyPostFilter, 'all'>;
  status?: PostStatus;
  page?: number;
  limit?: number;
};