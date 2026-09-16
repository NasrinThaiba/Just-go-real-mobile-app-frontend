// src/types/common.types.ts


// ========================================
// LANGUAGE
// ========================================

export type SupportedLanguage =
  | 'en'
  | 'ta';


// ========================================
// FEED
// ========================================

export type FeedContentType =
  | 'news'
  | 'video';


export type NewsType =
  | 'breaking'
  | 'regular'
  | 'featured'
  | 'trending';


export type VideoType =
  | 'breaking'
  | 'news'
  | 'live'
  | 'interview'
  | 'short'
  | 'featured';


export type PostStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'unpublished'
  | 'rejected'
  | 'withdrawn';


export type VideoSource =
  | 'direct'
  | 'youtube';


// ========================================
// SHARED FEED ITEM
// ========================================

export type FeedItem = {

  id: string;

  title: string;

  description: string;

  type:
    | 'news'
    | 'video';

  newsType?: NewsType;

  videoType?: VideoType;

  language: SupportedLanguage;

  category: string;

  location: string;

  mediaUrl: string;

  thumbnailUrl?: string;

  videoSource?: VideoSource;

  youtubeVideoId?: string;

  author: string;

  views: number;

  likes: number;

  status: PostStatus;

  createdAt: string;

  publishedAt?: string;

};


// ========================================
// LOADING
// ========================================

export type LoadingStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';


// ========================================
// API RESPONSE
// ========================================

export type ApiResponse<T> = {

  success: boolean;

  message?: string;

  data: T;

};


export type PaginatedResponse<T> = {

  items: T[];

  total: number;

  page: number;

  limit: number;

  hasNextPage: boolean;

};


// ========================================
// SELECT OPTION
// ========================================

export type SelectOption<
  TValue extends string = string,
> = {

  label: string;

  value: TValue;

};


// ========================================
// UTILITY TYPES
// ========================================

export type Nullable<T> =
  T | null;


export type Optional<T> =
  T | undefined;


// ========================================
// ASYNC STATE
// ========================================

export type AsyncState<T> = {

  data: T | null;

  isLoading: boolean;

  error: string | null;

};


// ========================================
// ENTITY
// ========================================

export type EntityId =
  string;


// ========================================
// TIMESTAMP
// ========================================

export type TimestampFields = {

  createdAt: string;

  updatedAt: string;

};