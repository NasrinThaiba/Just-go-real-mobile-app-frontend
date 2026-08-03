import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCreatedVideos } from '@/features/videos/storage/videoStorage';

import type {
  VideoItem,
} from '@/features/videos/types/videos.types';
import type {
  SupportedLanguage,
} from '@/features/news/types/news.types';

export function useVideos(
  language?: SupportedLanguage,
) {
  const [items, setItems] =
    useState<VideoItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadVideos =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedVideos =
          await getCreatedVideos();

        const sortedVideos = [
          ...storedVideos,
        ]
          .filter(
            (item) =>
              item.type === 'video',
          )
          .sort((first, second) => {
            const firstDate =
              first.publishedAt ??
              first.createdAt;

            const secondDate =
              second.publishedAt ??
              second.createdAt;

            return (
              new Date(
                secondDate,
              ).getTime() -
              new Date(
                firstDate,
              ).getTime()
            );
          }) as VideoItem[];

        setItems(sortedVideos);
      } catch (loadError) {
        console.error(
          'Failed to load videos:',
          loadError,
        );

        setError(
          'Unable to load videos.',
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  const filteredItems =
    useMemo(() => {
      if (!language) {
        return items;
      }

      return items.filter(
        (item) =>
          item.language ===
          language,
      );
    }, [
      items,
      language,
    ]);

  return {
    items: filteredItems,
    isLoading,
    error,
    refetch: loadVideos,
  };
}