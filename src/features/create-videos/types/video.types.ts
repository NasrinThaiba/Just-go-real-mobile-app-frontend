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

  description: string;

  videoType: VideoType;

  videoSource: VideoSource;

  /**
   * S3 permanent object URL.
   *
   * Used for storing the reference to the
   * uploaded video object.
   */
  mediaUrl?: string;

  /**
   * S3 object key.
   *
   * Example:
   *
   * videos/user-id/uuid.mp4
   *
   * This is important when the S3 bucket is private,
   * because the backend can use this key to generate
   * a temporary signed GET URL for playback.
   */
  mediaKey?: string;

  /**
   * Used only when videoSource === 'youtube'
   */
  youtubeVideoId?: string;

  thumbnailUrl?: string;

  category: string;

  language: VideoLanguage;

  location: string;

  status:
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

  /**
   * S3 object URL.
   */
  mediaUrl: string | null;

  /**
   * S3 object key.
   *
   * Required for private-bucket playback URL generation.
   */
  mediaKey: string | null;

  youtubeVideoId: string | null;

  thumbnailUrl: string | null;

  category: string | null;

  language: VideoLanguage;

  location: string | null;

  status: VideoStatus;

  createdAt: string;

  updatedAt: string;

};