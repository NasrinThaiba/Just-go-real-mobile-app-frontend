import type {
  FeedItem,
  PostStatus,
  SupportedLanguage,
  VideoType,
} from '@/features/news/types/news.types';

export type VideoSource =
  | 'direct'
  | 'youtube';

export type VideoItem =
  FeedItem & {
    type: 'video';
    videoType?: VideoType;
    videoSource?: VideoSource;
    youtubeVideoId?: string;
    thumbnailUrl?: string;
  };

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
  status: PostStatus;
};

export type UpdateVideoInput =
  Partial<CreateVideoInput>;