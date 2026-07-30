export type SupportedLanguage =
  | 'en'
  | 'ta';

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

export type VideoSource = 'direct' | 'youtube';

export type FeedItem = {
  id: string;
  title: string;
  description: string;

  type: 'news' | 'video';

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