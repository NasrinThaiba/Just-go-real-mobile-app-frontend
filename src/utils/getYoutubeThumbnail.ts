import { CONFIG } from '@/constants/config';

export function getYoutubeVideoId(
  url: string,
): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/,
  ];

  for (const pattern of patterns) {
    const match =
      url.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYoutubeThumbnail(
  url: string,
): string {
  const videoId =
    getYoutubeVideoId(url);

  if (!videoId) {
    return CONFIG.fallbackNewsImage;
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYoutubeMaxResolutionThumbnail(
  url: string,
): string {
  const videoId =
    getYoutubeVideoId(url);

  if (!videoId) {
    return CONFIG.fallbackNewsImage;
  }

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function isYoutubeUrl(
  url: string,
): boolean {
  return Boolean(
    getYoutubeVideoId(url),
  );
}