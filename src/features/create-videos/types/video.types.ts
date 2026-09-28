// src/features/create-videos/types/video.types.ts


// =====================================================
// VIDEO TYPE
// =====================================================

export type VideoType =
  | 'breaking'
  | 'live'
  | 'latest';


// =====================================================
// VIDEO SOURCE
// =====================================================

export type VideoSource =
  | 'direct'
  | 'youtube';


// =====================================================
// VIDEO LANGUAGE
// =====================================================

export type VideoLanguage =
  | 'en'
  | 'ta';


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
// CREATE VIDEO PAYLOAD
// =====================================================

export type CreateVideoPayload = {

  title: string;

  description?: string;

  videoType: VideoType;

  videoSource?: VideoSource;

  mediaUrl?: string;

  youtubeVideoId?: string;

  thumbnailUrl?: string;

  category?: string;

  language?: VideoLanguage;

  location?: string;

  status?:
    | 'draft'
    | 'pending';

};


// =====================================================
// VIDEO API RESPONSE
// =====================================================

export type VideoItem = {

  id: string;

  title: string;

  description: string | null;

  videoType: VideoType;

  videoSource: VideoSource | null;

  mediaUrl: string | null;

  youtubeVideoId: string | null;

  thumbnailUrl: string | null;

  category: string | null;

  language: VideoLanguage;

  location: string | null;

  status: VideoStatus;

  createdAt: string;

  updatedAt: string;

};