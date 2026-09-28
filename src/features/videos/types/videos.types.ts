import type {
  SupportedLanguage,
  VideoType,
  PostStatus,
} from '@/features/news/types/news.types';


// =====================================================
// VIDEO SOURCE
// =====================================================

export type VideoSource =
  | 'direct'
  | 'youtube';


// =====================================================
// VIDEO STATUS
// =====================================================

export type VideoStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'unpublished';


// =====================================================
// VIDEO ITEM
// API RESPONSE
// =====================================================

export type VideoItem = {

  id: string;

  title: string;

  description: string | null;


  // =========================================
  // VIDEO
  // =========================================

  type: 'video';

  videoType?: VideoType;

  videoSource?: VideoSource | null;

  mediaUrl?: string | null;

  youtubeVideoId?: string | null;

  thumbnailUrl?: string | null;


  // =========================================
  // CONTENT
  // =========================================

  language: SupportedLanguage;

  category: string | null;

  location: string | null;


  // =========================================
  // AUTHOR
  // =========================================

  authorId: string | null;


  // =========================================
  // ENGAGEMENT
  // =========================================

  views: number;

  likes: number;


  // =========================================
  // STATUS
  // =========================================

  status: VideoStatus;


  // =========================================
  // DATES
  // =========================================

  createdAt: string;

  updatedAt: string;

  publishedAt?: string | null;

};


// =====================================================
// CREATE VIDEO
// =====================================================

export type CreateVideoInput = {

  title: string;

  description: string;

  language: SupportedLanguage;

  category: string;

  location: string;

  videoType: VideoType;

  videoSource: VideoSource;

  mediaUrl: string;

  youtubeVideoId?: string;

  thumbnailUrl?: string;

  status:
    | 'draft'
    | 'pending';

};


// =====================================================
// UPDATE VIDEO
// =====================================================

export type UpdateVideoInput =
  Partial<CreateVideoInput>;