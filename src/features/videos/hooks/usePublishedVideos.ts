import {
  useCallback,
  useState,
} from 'react';
import {
  useFocusEffect,
} from 'expo-router';

import {
  getCreatedVideos,
} from '@/features/videos/storage/videoStorage';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

export function usePublishedVideos() {
  const [videos, setVideos] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadVideos =
    useCallback(async () => {
      try {
        setIsLoading(true);

        const localVideos =
          await getCreatedVideos();

        const publishedVideos =
          localVideos.filter(
            (item) =>
              item.status ===
              'published',
          );

        setVideos(
          publishedVideos.sort(
            (first, second) =>
              new Date(
                second.publishedAt ??
                  second.createdAt ??
                  0,
              ).getTime() -
              new Date(
                first.publishedAt ??
                  first.createdAt ??
                  0,
              ).getTime(),
          ),
        );
      } catch (error) {
        console.error(
          'Failed to load published videos:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadVideos();
    }, [loadVideos]),
  );

  return {
    videos,
    isLoading,
    refetch: loadVideos,
  };
}